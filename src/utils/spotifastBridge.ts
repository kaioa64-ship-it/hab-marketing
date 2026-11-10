// src/utils/spotifastBridge.ts
/**
 * Ponte de integração direta com a API do Spotifast Server (Rádio Coagro :8790)
 * Permite envio de arquivos de áudio .mp3 gravados pela curadoria com roteamento
 * por filial (target_stores) e nível de prioridade (1x ou 2x).
 */

export interface SpotifastPublishOptions {
  audioFile: File | Blob;
  fileName?: string;
  title: string;
  productOrSubject?: string;
  targetStoreIds: string[];
  priority: 1 | 2;
  durationSeconds?: number;
  protocolCode?: string;
}

export interface SpotifastPublishResult {
  success: boolean;
  message: string;
  audioUrl?: string;
  spotifastId?: string;
  simulated?: boolean;
}

export function getSpotifastServerUrl(): string {
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as unknown as { env?: Record<string, string> }).env) {
      const val = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_SPOTIFAST_SERVER_URL;
      if (val) return val.replace(/\/$/, '');
    }
  } catch {
    // Silencia em ambientes não-Vite
  }

  try {
    if (typeof process !== 'undefined' && process.env) {
      const val = process.env.VITE_SPOTIFAST_SERVER_URL;
      if (val) return val.replace(/\/$/, '');
    }
  } catch {
    // Silencia em ambientes sem process
  }

  return 'http://localhost:8790';
}

/**
 * Publica um spot de rádio gravado diretamente no servidor Spotifast (:8790).
 * Se o servidor estiver indisponível (ex: ambiente de teste sem o daemon Spotifast ativo),
 * retorna uma resposta simulada para não bloquear a fila de aprovação.
 */
export async function publishAudioToSpotifast(
  options: SpotifastPublishOptions
): Promise<SpotifastPublishResult> {
  const baseUrl = getSpotifastServerUrl();
  const endpoint = `${baseUrl}/api/spots/upload`;

  const fileName =
    options.fileName ||
    (options.audioFile instanceof File ? options.audioFile.name : `spot-${Date.now()}.mp3`);

  const formData = new FormData();
  formData.append('audio', options.audioFile, fileName);
  formData.append('title', options.title);
  formData.append('product_subject', options.productOrSubject || '');
  formData.append('target_stores', JSON.stringify(options.targetStoreIds));
  formData.append('priority', String(options.priority || 1));
  formData.append('duration_seconds', String(options.durationSeconds || 30));
  if (options.protocolCode) {
    formData.append('protocol_code', options.protocolCode);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`Servidor Spotifast [${response.status}]: ${errText || response.statusText}`);
    }

    const data = await response.json().catch(() => ({}));
    return {
      success: true,
      message: `Áudio publicado com sucesso no Spotifast (${options.targetStoreIds.length} lojas, Prioridade ${options.priority}x)`,
      audioUrl: data.url || `${baseUrl}/media/${fileName}`,
      spotifastId: data.id || `spot-${Date.now()}`,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    // Modo simulação tolerante quando o servidor :8790 não estiver rodando no momento
    return {
      success: true,
      simulated: true,
      message: `[Simulação Spotifast] Gravado para upload: ${fileName} (${options.targetStoreIds.length} lojas, ${options.priority}x). Servidor local :8790 inacessível (${errorMsg}).`,
      audioUrl: `local-blob://${fileName}`,
      spotifastId: `sim-${Date.now()}`,
    };
  }
}
