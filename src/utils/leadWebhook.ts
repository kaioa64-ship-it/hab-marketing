// src/utils/leadWebhook.ts
// Conector blindado: dispara o evento gabarito:lead_captured da Vercel
// direto para o webhook local do n8n (via Cloudflared Tunnel) com timeout e normalização de URL.

declare global {
  interface ImportMetaEnv {
    VITE_N8N_WEBHOOK_URL?: string;
    VITE_COMMERCIAL_WHATSAPP?: string;
    VITE_CHECKOUT_BALCAO_URL?: string;
    VITE_CHECKOUT_REDE_URL?: string;
  }
  interface ImportMeta {
    env: ImportMetaEnv;
  }
}

export function resolveN8nWebhookUrl(rawUrl?: string): string {
  const candidate = (rawUrl ?? import.meta.env?.VITE_N8N_WEBHOOK_URL ?? '').trim();
  if (!candidate) {
    return 'https://pulso-pi-hazel.vercel.app/api/webhook/gabarito-lead-captured';
  }
  const withoutTrailingSlash = candidate.replace(/\/+$/, '');
  // Se o usuário informou apenas o domínio base do túnel Cloudflared ou localhost:5678, anexa o path do webhook n8n
  if (/^https?:\/\/[^/]+$/i.test(withoutTrailingSlash)) {
    return `${withoutTrailingSlash}/webhook/gabarito-lead-captured`;
  }
  return withoutTrailingSlash;
}

export const N8N_WEBHOOK_URL = resolveN8nWebhookUrl();

const sanitizeField = (val: string | undefined, maxLen = 120): string | undefined => {
  if (!val) return undefined;
  return String(val).replace(/[<>]/g, '').trim().slice(0, maxLen);
};

export async function sendLeadCapturedToN8n(
  lead: {
    name?: string;
    storeName?: string;
    whatsappOrEmail?: string;
    branchCount?: string;
    authProvider?: 'google' | 'direct';
  }
): Promise<boolean> {
  if (typeof fetch === 'undefined') return false;
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutId = controller ? setTimeout(() => controller.abort(), 5000) : null;

  try {
    const response = await fetch(resolveN8nWebhookUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller?.signal,
      body: JSON.stringify({
        event: 'gabarito:lead_captured',
        name: sanitizeField(lead.name, 80),
        storeName: sanitizeField(lead.storeName, 120),
        whatsappOrEmail: sanitizeField(lead.whatsappOrEmail, 120),
        branchCount: sanitizeField(lead.branchCount, 40),
        authProvider: lead.authProvider === 'google' ? 'google' : 'direct',
        capturedAt: new Date().toISOString(),
      }),
    });
    return response.ok;
  } catch {
    // Falha silenciosa para nunca travar a liberação do download 300 DPI no navegador do lojista
    return false;
  } finally {
    if (timeoutId !== null) clearTimeout(timeoutId);
  }
}
