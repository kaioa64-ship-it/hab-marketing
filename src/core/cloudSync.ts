// src/core/cloudSync.ts
/**
 * Adaptador de sincronização em nuvem leve para o Hub Coagro v3.0 (Supabase / PostgreSQL)
 * Utiliza fetch nativo e PostgREST sem dependências pesadas de SDKs externos.
 * Oferece fallback transparente para localStorage quando offline ou sem variáveis de ambiente.
 */

import { MarketingRequestItem, MarketingRequestStatus } from './types';
import { AgroDictionaryEntry } from './coagroDictionary';

export interface CloudSyncConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

export type CloudSyncState = 'idle' | 'syncing' | 'online' | 'offline' | 'error';

// Configuração segura com leitura em Vite e Node (para testes de auditoria)
function getEnvVar(key: string): string {
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as unknown as { env?: Record<string, string> }).env) {
      const val = (import.meta as unknown as { env?: Record<string, string> }).env?.[key];
      if (val) return val;
    }
  } catch {
    // Ignora erro em ambientes sem import.meta.env
  }

  try {
    if (typeof process !== 'undefined' && process.env) {
      const val = process.env[key];
      if (val) return val;
    }
  } catch {
    // Ignora erro em ambientes sem process
  }

  return '';
}

let syncConfigOverride: CloudSyncConfig | null = null;
let currentSyncState: CloudSyncState = 'idle';
let lastSyncTimestampISO: string | null = null;
let lastSyncError: string | null = null;

const syncListeners = new Set<(status: CloudSyncState) => void>();

function setSyncState(state: CloudSyncState, err: string | null = null) {
  currentSyncState = state;
  lastSyncError = err;
  syncListeners.forEach((fn) => fn(state));
}

export function configureCloudSync(config: CloudSyncConfig | null) {
  syncConfigOverride = config;
}

export function getEffectiveSyncConfig(): CloudSyncConfig {
  if (syncConfigOverride) return syncConfigOverride;
  return {
    supabaseUrl: getEnvVar('VITE_SUPABASE_URL').trim().replace(/\/$/, ''),
    supabaseAnonKey: getEnvVar('VITE_SUPABASE_ANON_KEY').trim(),
  };
}

export function isCloudSyncConfigured(): boolean {
  const cfg = getEffectiveSyncConfig();
  return Boolean(cfg.supabaseUrl && cfg.supabaseAnonKey);
}

export function getCloudSyncStatus(): {
  state: CloudSyncState;
  isConfigured: boolean;
  lastSyncTimestampISO: string | null;
  lastError: string | null;
} {
  return {
    state: currentSyncState,
    isConfigured: isCloudSyncConfigured(),
    lastSyncTimestampISO,
    lastError: lastSyncError,
  };
}

export function subscribeCloudSyncStatus(listener: (state: CloudSyncState) => void): () => void {
  syncListeners.add(listener);
  return () => syncListeners.delete(listener);
}

// ---------------------------------------------------------------------------
// Mapeamento de Tipos: JavaScript CamelCase <-> PostgreSQL Snake_Case
// ---------------------------------------------------------------------------

export interface DbMarketingRequestRow {
  id: string;
  protocol_code: string;
  created_at: string;
  updated_at: string;
  store_id: string;
  store_name: string;
  requester_email: string;
  module_type: string;
  title: string;
  subtitle_or_summary: string;
  governance_track: string;
  status: string;
  guardrail_warnings: string[];
  unknown_dictionary_terms: string[];
  curator_notes: string | null;
  approved_file_url: string | null;
  payload_json: Record<string, unknown>;
}

export interface DbAgroDictionaryRow {
  id: string;
  canonical_term: string;
  category: string;
  aliases: string[];
  added_by: string;
  added_at: string;
}

export function mapMarketingRequestToDb(item: MarketingRequestItem): DbMarketingRequestRow {
  return {
    id: item.id,
    protocol_code: item.protocolCode,
    created_at: item.createdAtISO,
    updated_at: item.updatedAtISO,
    store_id: item.storeId,
    store_name: item.storeName,
    requester_email: item.requesterEmail,
    module_type: item.moduleType,
    title: item.title,
    subtitle_or_summary: item.subtitleOrSummary,
    governance_track: item.governanceTrack,
    status: item.status,
    guardrail_warnings: item.guardrailWarnings || [],
    unknown_dictionary_terms: item.unknownDictionaryTerms || [],
    curator_notes: item.curatorNotes || null,
    approved_file_url: item.approvedFileUrl || null,
    payload_json: (item.payloadJson as Record<string, unknown>) || {},
  };
}

export function mapDbToMarketingRequest(row: DbMarketingRequestRow): MarketingRequestItem {
  return {
    id: row.id,
    protocolCode: row.protocol_code,
    createdAtISO: row.created_at,
    updatedAtISO: row.updated_at,
    storeId: row.store_id,
    storeName: row.store_name,
    requesterEmail: row.requester_email,
    moduleType: row.module_type as MarketingRequestItem['moduleType'],
    title: row.title,
    subtitleOrSummary: row.subtitle_or_summary,
    governanceTrack: row.governance_track as MarketingRequestItem['governanceTrack'],
    status: row.status as MarketingRequestItem['status'],
    guardrailWarnings: Array.isArray(row.guardrail_warnings) ? row.guardrail_warnings : [],
    unknownDictionaryTerms: Array.isArray(row.unknown_dictionary_terms) ? row.unknown_dictionary_terms : [],
    curatorNotes: row.curator_notes || undefined,
    approvedFileUrl: row.approved_file_url || undefined,
    payloadJson: (row.payload_json as MarketingRequestItem['payloadJson']) || {},
  };
}

export function mapAgroDictionaryToDb(entry: AgroDictionaryEntry): DbAgroDictionaryRow {
  return {
    id: entry.id,
    canonical_term: entry.canonicalTerm,
    category: entry.category,
    aliases: entry.aliases || [],
    added_by: entry.addedBy || 'Curador (Kaio)',
    added_at: entry.addedAtISO || new Date().toISOString(),
  };
}

export function mapDbToAgroDictionary(row: DbAgroDictionaryRow): AgroDictionaryEntry {
  return {
    id: row.id,
    canonicalTerm: row.canonical_term,
    category: row.category as AgroDictionaryEntry['category'],
    aliases: Array.isArray(row.aliases) ? row.aliases : [],
    addedBy: row.added_by,
    addedAtISO: row.added_at,
  };
}

// ---------------------------------------------------------------------------
// Cliente REST Nativo (PostgREST)
// ---------------------------------------------------------------------------

async function makePostgrestRequest<T>(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    body?: unknown;
    headers?: Record<string, string>;
  } = {}
): Promise<T | null> {
  const cfg = getEffectiveSyncConfig();
  if (!cfg.supabaseUrl || !cfg.supabaseAnonKey) {
    return null;
  }

  const url = `${cfg.supabaseUrl}/rest/v1/${endpoint.replace(/^\//, '')}`;
  const headers: Record<string, string> = {
    apikey: cfg.supabaseAnonKey,
    Authorization: `Bearer ${cfg.supabaseAnonKey}`,
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Supabase REST Error [${response.status}]: ${errorText || response.statusText}`);
  }

  const text = await response.text();
  if (!text) return null;
  return JSON.parse(text) as T;
}

// ---------------------------------------------------------------------------
// Métodos Públicos de Sincronização
// ---------------------------------------------------------------------------

export async function fetchRemoteMarketingRequests(): Promise<MarketingRequestItem[] | null> {
  if (!isCloudSyncConfigured()) return null;
  try {
    setSyncState('syncing');
    const rows = await makePostgrestRequest<DbMarketingRequestRow[]>(
      'marketing_requests?select=*&order=created_at.desc'
    );
    setSyncState('online');
    lastSyncTimestampISO = new Date().toISOString();
    if (!rows) return [];
    return rows.map(mapDbToMarketingRequest);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    setSyncState('error', msg);
    return null;
  }
}

export async function upsertRemoteMarketingRequest(item: MarketingRequestItem): Promise<boolean> {
  if (!isCloudSyncConfigured()) return false;
  try {
    const dbRow = mapMarketingRequestToDb(item);
    await makePostgrestRequest('marketing_requests', {
      method: 'POST',
      headers: {
        Prefer: 'resolution=merge-duplicates,return=minimal',
      },
      body: dbRow,
    });
    setSyncState('online');
    return true;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    setSyncState('error', msg);
    return false;
  }
}

export async function updateRemoteMarketingRequestStatus(
  requestId: string,
  status: MarketingRequestStatus,
  curatorNotes?: string,
  approvedFileUrl?: string
): Promise<boolean> {
  if (!isCloudSyncConfigured()) return false;
  try {
    const patchPayload: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };
    if (curatorNotes !== undefined) {
      patchPayload.curator_notes = curatorNotes;
    }
    if (approvedFileUrl !== undefined) {
      patchPayload.approved_file_url = approvedFileUrl;
    }
    await makePostgrestRequest(`marketing_requests?id=eq.${encodeURIComponent(requestId)}`, {
      method: 'PATCH',
      headers: {
        Prefer: 'return=minimal',
      },
      body: patchPayload,
    });
    setSyncState('online');
    return true;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    setSyncState('error', msg);
    return false;
  }
}

export async function fetchRemoteAgroDictionary(): Promise<AgroDictionaryEntry[] | null> {
  if (!isCloudSyncConfigured()) return null;
  try {
    setSyncState('syncing');
    const rows = await makePostgrestRequest<DbAgroDictionaryRow[]>(
      'agro_dictionary?select=*&order=canonical_term.asc'
    );
    setSyncState('online');
    lastSyncTimestampISO = new Date().toISOString();
    if (!rows) return [];
    return rows.map(mapDbToAgroDictionary);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    setSyncState('error', msg);
    return null;
  }
}

export async function insertRemoteAgroDictionaryTerm(entry: AgroDictionaryEntry): Promise<boolean> {
  if (!isCloudSyncConfigured()) return false;
  try {
    const dbRow = mapAgroDictionaryToDb(entry);
    await makePostgrestRequest('agro_dictionary', {
      method: 'POST',
      headers: {
        Prefer: 'resolution=merge-duplicates,return=minimal',
      },
      body: dbRow,
    });
    setSyncState('online');
    return true;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    setSyncState('error', msg);
    return false;
  }
}
