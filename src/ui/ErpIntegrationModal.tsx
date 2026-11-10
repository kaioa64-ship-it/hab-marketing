// src/ui/ErpIntegrationModal.tsx
import React, { useState } from 'react';
import {
  BatchParsedRow,
  ErpCatalogRecord,
  ErpSyncConfig,
} from '../core/types';
import { studioActions, useStudioStore } from '../core/store';
import {
  exportCatalogToCsv,
  searchErpCatalog,
  buildHeadlessRenderPayload,
} from '../core/businessRules';

interface ErpIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  customCatalogDb: ErpCatalogRecord[];
  parsedBatchRows: BatchParsedRow[];
  erpSyncConfig: ErpSyncConfig;
  variant?: 'modal' | 'embedded';
}

const SAMPLE_BLING_TINY_JSON = JSON.stringify(
  {
    produtos: [
      {
        produto: {
          codigo: '501',
          gtin: '7891000501005',
          descricao: 'MOTOS GASOL 52CC SABRE 18 POL',
          vlr_tabela: 1190.0,
           preco: 899.0,
          preco_custo: 610.0,
          unidade: 'UN',
          parcelas: 10,
        },
      },
      {
        produto: {
          codigo: '502',
          gtin: '7891000502002',
          descricao: 'RAC GOLDEN FORMULA AD CARNE 15KG',
          vlr_tabela: 169.9,
          preco: 139.9,
          preco_custo: 104.0,
          unidade: 'KG',
          brinde: 'COMPRE 1 E GANHE POTE HERMÉTICO',
        },
      },
      {
        produto: {
          codigo: '503',
          gtin: '7891000503009',
          descricao: 'SEMENTE MILHO HIBRIDO SAFRA 20KG',
          vlr_tabela: 0,
          preco: 429.0,
          preco_custo: 310.0,
          unidade: 'SC',
        },
      },
    ],
  },
  null,
  2
);

const SAMPLE_TOTVS_SANKHYA_CSV = `CODIGO;EAN;DESCRICAO;PRECO_DE;PRECO_POR;CUSTO;PARCELAS;CONDICAO
601;7891000601002;GERAD ENERG GASOL 3.5KVA BIVOLT;2890,00;2390,00;1750,00;10;
602;7891000602009;ORDENHADEIRA BALDE AO PE 1 CJ INOX;3490,00;2990,00;2180,00;12;
603;7891000603006;HERBICIDA GLIFOSATO 500 ML;49,90;34,90;22,00;;
604;7891000604003;IVERMECTINA BOVINA 1% 500ML;98,00;74,90;49,00;;COMPRE 2 E GANHE APLICADOR`;

export const ErpIntegrationModal: React.FC<ErpIntegrationModalProps> = ({
  isOpen,
  onClose,
  customCatalogDb,
  parsedBatchRows,
  erpSyncConfig,
  variant = 'modal',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [rawImportText, setRawImportText] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isSyncingUrl, setIsSyncingUrl] = useState(false);
  const store = useStudioStore();

  if (!isOpen) return null;

  const embedded = variant === 'embedded';

  const headlessPayload = buildHeadlessRenderPayload(
    store.currentOffer,
    store.brandKit,
    store.posterConfig
  );

  const catalogList = searchErpCatalog(
    searchQuery,
    customCatalogDb,
    parsedBatchRows,
    50
  );

  const handleImportText = (textToImport: string, replace = false) => {
    const res = studioActions.importCatalogDataset(textToImport, replace);
    if (res.imported > 0) {
      setFeedbackMessage(
        `✅ ${res.imported} produtos importados e higienizados com sucesso (${res.format})!`
      );
      setRawImportText('');
    } else {
      setFeedbackMessage(
        '⚠️ Nenhum produto válido encontrado no conteúdo enviado. Verifique o formato CSV/JSON.'
      );
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        handleImportText(reader.result, false);
      }
    };
    reader.readAsText(file);
  };

  const handleSyncFromUrl = async () => {
    const url = (erpSyncConfig.endpointOrSheetUrl || '').trim();
    if (!url) {
      setFeedbackMessage('⚠️ Informe uma URL de API JSON ou planilha CSV publicada.');
      return;
    }
    setIsSyncingUrl(true);
    setFeedbackMessage(null);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const text = await response.text();
      handleImportText(text, false);
    } catch {
      setFeedbackMessage(
        '⚠️ Não foi possível conectar à URL remota (verifique CORS ou conexão). Use o upload de arquivo ou colagem direta abaixo.'
      );
    } finally {
      setIsSyncingUrl(false);
    }
  };

  const handleExportCsv = () => {
    const csv = exportCatalogToCsv(catalogList);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `catalogo-erp-gabarito-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      data-modal="erp-integration"
      className={
        embedded
          ? 'settings-embed'
          : 'fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto'
      }
    >
      <div
        className={
          embedded
            ? 'settings-embed-card'
            : 'bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden my-6'
        }
      >
        {/* Cabeçalho */}
        {!embedded && (
          <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-black uppercase tracking-wide flex items-center gap-2">
                <span>🔌</span> Hub Universal de Base de Dados & Integração ERP
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Conecte Bling, Tiny, TOTVS, Sankhya, Siagri, Linx ou planilhas CSV/Excel sem digitação manual
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm font-black transition-colors"
              aria-label="Fechar central ERP"
            >
              ✕
            </button>
          </div>
        )}

        <div className={embedded ? 'space-y-6' : 'p-6 space-y-6 max-h-[82vh] overflow-y-auto'}>
          {feedbackMessage && (
            <div className="px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-extrabold flex items-center justify-between">
              <span>{feedbackMessage}</span>
              <button
                type="button"
                onClick={() => setFeedbackMessage(null)}
                className="text-emerald-800 hover:text-emerald-950 font-black ml-2"
              >
                ✕
              </button>
            </div>
          )}

          {/* 1. BUSCA INSTANTÂNEA NA BASE DE PRODUTOS ATIVA */}
          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-emerald-900">
                  1. Consultar Base de Produtos da Loja ({catalogList.length} SKUs disponíveis)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Clique em qualquer produto para preencher Código SKU, Título Limpo, Preço, Mecânica e Modelo de Cartaz automaticamente
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-[11px] font-extrabold text-slate-700"
                >
                  📥 Exportar Base CSV
                </button>
                {customCatalogDb.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      studioActions.clearCustomCatalog();
                      setFeedbackMessage('Base customizada limpa (mantendo itens de demonstração).');
                    }}
                    className="px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-[11px] font-extrabold text-red-800"
                  >
                    Limpar Importados ({customCatalogDb.length})
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Digite o Código SKU (ex: 201), Código de Barras EAN (ex: 789...) ou Nome (ex: Triturador, Ração, Glifosato)..."
                className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-900"
              />
            </div>

            <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-200 divide-y divide-slate-100">
              {catalogList.map((item) => (
                <div
                  key={item.skuCode}
                  className="px-3.5 py-2.5 bg-white hover:bg-emerald-50/40 flex flex-wrap items-center justify-between gap-2 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-mono text-[10px] font-black">
                        CÓD: {item.skuCode}
                      </span>
                      {item.eanBarcode && (
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[10px] font-bold">
                          EAN: {item.eanBarcode}
                        </span>
                      )}
                      <span className="text-xs font-extrabold text-slate-900 truncate">
                        {item.cleanedTitle}
                      </span>
                      {item.mechanicType === 'INSTALLMENT_FINANCING' && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase">
                          🚜 {item.installmentCount || 10}x Sem Juros
                        </span>
                      )}
                      {item.mechanicType === 'BUY_WIN_GIFT' && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black uppercase">
                          🎁 {item.giftOrConditionText}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-3">
                      {item.priceFrom && item.priceFrom > item.priceTo ? (
                        <span>
                          De:{' '}
                          <span className="line-through">
                            R$ {item.priceFrom.toFixed(2).replace('.', ',')}
                          </span>
                        </span>
                      ) : (
                        <span>Preço Direto</span>
                      )}
                      <strong className="text-emerald-900">
                        Por: R$ {item.priceTo.toFixed(2).replace('.', ',')} /{item.unit}
                      </strong>
                      {item.costPrice && (
                        <span>Custo: R$ {item.costPrice.toFixed(2).replace('.', ',')}</span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      studioActions.applyCatalogRecord(item);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-950 text-white text-[11px] font-extrabold uppercase tracking-wide shrink-0"
                  >
                    ⚡ Usar no Cartaz/Card
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* 2. IMPORTAÇÃO UNIVERSAL POR ARQUIVO OU COLAGEM (QUALQUER ERP) */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  2. Importar Arquivo ou Colar do ERP
                </h3>
                <label className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-extrabold cursor-pointer">
                  📂 Enviar .CSV / .JSON
                  <input
                    type="file"
                    accept=".csv,.tsv,.txt,.json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Reconhece automaticamente colunas de <strong>Bling, Tiny, TOTVS Protheus, Sankhya, Siagri, Linx, Omie</strong> ou planilhas do Excel.
              </p>

              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleImportText(SAMPLE_BLING_TINY_JSON, false)}
                  className="px-2.5 py-1 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-[10px] font-extrabold text-emerald-950"
                >
                  + Testar Carga JSON (Bling/Tiny)
                </button>
                <button
                  type="button"
                  onClick={() => handleImportText(SAMPLE_TOTVS_SANKHYA_CSV, false)}
                  className="px-2.5 py-1 rounded-lg border border-blue-300 bg-blue-50 hover:bg-blue-100 text-[10px] font-extrabold text-blue-950"
                >
                  + Testar Carga CSV (TOTVS/Sankhya)
                </button>
              </div>

              <textarea
                rows={4}
                value={rawImportText}
                onChange={(e) => setRawImportText(e.target.value)}
                placeholder="Cole aqui o CSV, colunas do Excel ou JSON exportado do seu sistema ERP..."
                className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-mono text-slate-800"
              />

              <button
                type="button"
                disabled={!rawImportText.trim()}
                onClick={() => handleImportText(rawImportText, false)}
                className="w-full py-2 rounded-xl bg-emerald-900 hover:bg-emerald-950 disabled:opacity-40 text-white text-xs font-extrabold uppercase tracking-wider"
              >
                Importar e Higienizar para a Base da Loja
              </button>
            </div>

            {/* 3. CONECTOR DE SINCRONIZAÇÃO AUTOMÁTICA (URL / WEBHOOK / GOOGLE SHEETS) */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  3. Sincronização Automática (API / Planilha Online)
                </h3>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Vincule o link de uma <strong>Planilha Google Sheets publicada como CSV</strong> ou um <strong>Endpoint REST JSON</strong> do seu sistema para atualizar preços com 1 clique.
                </p>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-slate-600 mb-1">
                    URL da Base Remota (CSV ou JSON)
                  </label>
                  <input
                    type="url"
                    value={erpSyncConfig.endpointOrSheetUrl || ''}
                    onChange={(e) =>
                      studioActions.updateErpSyncConfig({
                        endpointOrSheetUrl: e.target.value,
                      })
                    }
                    placeholder="https://docs.google.com/spreadsheets/.../pub?output=csv"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-mono text-slate-800"
                  />
                </div>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={erpSyncConfig.autoApplyArchetypeOnLookup}
                    onChange={(e) =>
                      studioActions.updateErpSyncConfig({
                        autoApplyArchetypeOnLookup: e.target.checked,
                      })
                    }
                    className="rounded border-slate-300 text-emerald-900"
                  />
                  <span>
                    Selecionar automaticamente o Modelo de Cartaz ideal (01..04) ao puxar SKU
                  </span>
                </label>
              </div>

              <div className="space-y-2 pt-2">
                {erpSyncConfig.lastSyncISO && (
                  <div className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg">
                    ✓ Última carga: {erpSyncConfig.lastDetectedFormat} ({new Date(erpSyncConfig.lastSyncISO).toLocaleTimeString('pt-BR')})
                  </div>
                )}
                <button
                  type="button"
                  disabled={isSyncingUrl}
                  onClick={handleSyncFromUrl}
                  className="btn btn-primary btn-block"
                >
                  {isSyncingUrl ? 'Sincronizando...' : 'Sincronizar Base via URL Agora'}
                </button>
              </div>
            </div>
          </section>

          {/* 4. API HEADLESS ENTERPRISE & GERADOR AUTOMÁTICO DE CARROSSEL (FASE 4) */}
          <section className="p-4 rounded-xl border border-slate-200 bg-slate-50/80 text-slate-900 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                  4. Contrato API Headless Enterprise (POST /api/v1/render) & Automação
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Payload canônico determinístico pronto para integração direta via Webhook com ERPs (Bling, Tiny, TOTVS, Sankhya, Siagri, Linx).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    studioActions.generateCarouselFromCatalog(3);
                    studioActions.setActiveModule('CAROUSEL');
                    onClose();
                  }}
                  className="btn btn-ghost"
                >
                  Gerar Carrossel da Base ERP
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof navigator !== 'undefined' && navigator.clipboard) {
                      navigator.clipboard.writeText(JSON.stringify(headlessPayload, null, 2));
                      setFeedbackMessage('✅ Payload JSON da API Headless copiado para a área de transferência!');
                    }
                  }}
                  className="btn btn-primary"
                >
                  Copiar Payload JSON
                </button>
              </div>
            </div>

            <pre className="max-h-40 overflow-y-auto rounded-lg bg-white border border-slate-200 p-3 text-xs font-mono text-slate-800 leading-relaxed">
              {JSON.stringify(headlessPayload, null, 2)}
            </pre>
          </section>
        </div>

        {/* Rodapé */}
        {!embedded && (
          <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              ✓ Base de produtos salva localmente no navegador (funciona mesmo sem internet)
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-extrabold uppercase tracking-wider"
            >
              Fechar Central ERP
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
