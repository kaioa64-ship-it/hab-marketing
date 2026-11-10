// src/ui/BrandKitModal.tsx
import React from 'react';
import { TenantBrandKit } from '../core/types';
import { studioActions } from '../core/store';
import {
  getContrastRatio,
  resolveAccessibleTextColor,
  extractDominantColorsFromImage,
  WHITE_LABEL_TYPOGRAPHY_PRESETS,
  WHITE_LABEL_SEGMENT_PRESETS,
} from '../core/businessRules';
import { tightCropAlphaDataUrl } from '../engine/exporter';

interface BrandKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandKit: TenantBrandKit;
  variant?: 'modal' | 'embedded';
}

const DEPARTMENT_ICONS: { key: string; emoji: string; label: string }[] = [
  { key: 'leaf', emoji: '🌿', label: 'Agro / Horti' },
  { key: 'heart', emoji: '🐾', label: 'Pet / Vet' },
  { key: 'meat', emoji: '🥩', label: 'Açougue / Frios' },
  { key: 'cart', emoji: '🛒', label: 'Mercearia' },
  { key: 'pill', emoji: '💊', label: 'Farmácia' },
  { key: 'tool', emoji: '🛠️', label: 'Construção' },
];

export const BrandKitModal: React.FC<BrandKitModalProps> = ({
  isOpen,
  onClose,
  brandKit,
  variant = 'modal',
}) => {
  if (!isOpen) return null;

  const embedded = variant === 'embedded';

  const [logoRemoveBg, setLogoRemoveBg] = React.useState(true);
  const [rawLogoDataUrl, setRawLogoDataUrl] = React.useState<string | null>(null);

  const applyLogoWithCropOption = async (dataUrl: string, removeBg: boolean) => {
    let finalLogo = dataUrl;
    if (removeBg) {
      finalLogo = await tightCropAlphaDataUrl(dataUrl, true);
    }
    studioActions.updateBrandKit({ defaultLogoUrl: finalLogo });
    try {
      const { primaryColorHex, accentColorHex } = await extractDominantColorsFromImage(finalLogo);
      const targetDeptId =
        brandKit.activeDepartmentId || brandKit.departments[0]?.id || 'dept-1';
      studioActions.updateDepartment(targetDeptId, {
        primaryColorHex,
        accentColorHex,
      });
    } catch {
      // fallback silencioso
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === 'string') {
        const dataUrl = reader.result;
        setRawLogoDataUrl(dataUrl);
        await applyLogoWithCropOption(dataUrl, logoRemoveBg);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleToggleLogoBg = async (enabled: boolean) => {
    setLogoRemoveBg(enabled);
    if (rawLogoDataUrl) {
      await applyLogoWithCropOption(rawLogoDataUrl, enabled);
    }
  };

  const handleExtractLogoColors = async () => {
    if (!brandKit.defaultLogoUrl) return;
    const { primaryColorHex, accentColorHex } = await extractDominantColorsFromImage(
      brandKit.defaultLogoUrl
    );
    const targetDeptId =
      brandKit.activeDepartmentId || brandKit.departments[0]?.id || 'dept-1';
    studioActions.updateDepartment(targetDeptId, {
      primaryColorHex,
      accentColorHex,
    });
  };

  return (
    <div
      data-modal="brand-kit"
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
            : 'bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8'
        }
      >
        {/* Cabeçalho do Modal */}
        {!embedded && (
          <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-black uppercase tracking-wide flex items-center gap-2">
                <span>⚙️</span> Identidade da Marca
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Nome, logo, cores, contatos e setores da loja
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm font-black transition-colors"
              aria-label="Fechar configuração de marca"
            >
              ✕
            </button>
          </div>
        )}

        <div className={embedded ? 'space-y-6' : 'p-6 space-y-6 max-h-[80vh] overflow-y-auto'}>
          {/* 1. IDENTIDADE DA MARCA & CONTATO PADRÃO */}
          <section className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-900 border-b border-slate-100 pb-1.5">
              1. Identidade da Marca
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-700 mb-1">
                  Nome da Empresa / Rede <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={brandKit.companyName}
                  onChange={(e) =>
                    studioActions.updateBrandKit({ companyName: e.target.value })
                  }
                  placeholder="Ex: Agropecuária Boi Forte"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-extrabold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-700 mb-1">
                  WhatsApp / Telefone Comercial <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={brandKit.defaultPhoneWhatsapp || ''}
                  onChange={(e) =>
                    studioActions.updateBrandKit({
                      defaultPhoneWhatsapp: e.target.value,
                    })
                  }
                  placeholder="Ex: (16) 99999-0000"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-500 mb-1">
                  Filial / Unidade <span className="font-normal text-slate-400">(Opcional)</span>
                </label>
                <input
                  type="text"
                  value={brandKit.defaultBranchName || ''}
                  onChange={(e) =>
                    studioActions.updateBrandKit({
                      defaultBranchName: e.target.value,
                    })
                  }
                  placeholder="Ex: Unidade Matriz - Centro"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-500 mb-1">
                  Registro MAPA <span className="font-normal text-slate-400">(Opcional)</span>
                </label>
                <input
                  type="text"
                  value={brandKit.mapaRegistrationCode || ''}
                  onChange={(e) =>
                    studioActions.updateBrandKit({
                      mapaRegistrationCode: e.target.value,
                    })
                  }
                  placeholder="Ex: MAPA: SP-00192-X"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-800"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Opcional: quando vazio, a faixa do MAPA é ocultada automaticamente dos cartazes.
                </p>
              </div>
            </div>

            {/* Upload de Logo com Opção de Fundo e Extração de Cores */}
            <div className="pt-1">
              <label className="block text-[11px] font-extrabold uppercase text-slate-600 mb-1.5">
                Logotipo Oficial da Marca
              </label>
              <div className="flex flex-col gap-2 p-3 rounded-xl border border-dashed border-slate-300 bg-slate-50">
                <div className="flex items-center gap-3">
                  {brandKit.defaultLogoUrl ? (
                    <div className="h-12 px-3 py-1 bg-white rounded-lg border border-slate-200 flex items-center justify-center shrink-0">
                      <img
                        src={brandKit.defaultLogoUrl}
                        alt="Logo da Marca"
                        className="max-h-10 max-w-[120px] object-contain"
                      />
                    </div>
                  ) : (
                    <div className="h-12 w-12 rounded-lg bg-slate-200/70 flex items-center justify-center text-lg shrink-0">
                      🏷️
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-800">
                      {brandKit.defaultLogoUrl
                        ? 'Logo anexada à marca'
                        : 'Nenhuma logo enviada (usando nome em texto)'}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Formatos PNG ou JPG
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <label className="px-3 py-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-extrabold cursor-pointer transition-colors">
                      {brandKit.defaultLogoUrl ? 'Trocar Logo' : 'Enviar Logo'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                    {brandKit.defaultLogoUrl && (
                      <>
                        <button
                          type="button"
                          onClick={handleExtractLogoColors}
                          title="Extrair cor primária e cor de destaque automaticamente da logo enviada"
                          className="px-2.5 py-1.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-xs font-extrabold text-amber-950"
                        >
                          🎨 Extrair Paleta
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            studioActions.updateBrandKit({
                              defaultLogoUrl: undefined,
                            })
                          }
                          className="px-2.5 py-1.5 rounded-lg border border-slate-300 hover:bg-red-50 text-xs font-bold text-red-700"
                        >
                          Remover
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Micro-orientação e Toggle de Fundo */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-slate-200">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={logoRemoveBg}
                      onChange={(e) => handleToggleLogoBg(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
                    />
                    <span className="text-xs font-bold text-slate-700">
                      Remover fundo branco da logo automaticamente
                    </span>
                  </label>
                  <span className="text-[11px] text-slate-500 italic">
                    Recomendado: envie arquivo PNG sem fundo para melhor acabamento.
                  </span>
                </div>
              </div>
            </div>

            {/* Presets Rápidos de Segmento White-Label (1 Clique) */}
            <div className="pt-2">
              <label className="block text-[11px] font-extrabold uppercase text-slate-600 mb-1.5">
                ⚡ Presets Rápidos de Segmento (Cores WCAG + Tipografia em 1 Clique)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {WHITE_LABEL_SEGMENT_PRESETS.map((seg) => (
                  <button
                    key={seg.id}
                    type="button"
                    onClick={() => studioActions.applySegmentPreset(seg.id)}
                    className="p-2 rounded-xl border border-slate-200 hover:border-emerald-700 bg-slate-50 hover:bg-emerald-50/40 text-left transition-all flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{seg.emoji}</span>
                      <div className="flex items-center gap-1">
                        <span
                          style={{ backgroundColor: seg.dept1.primaryColorHex }}
                          className="w-3 h-3 rounded-full border border-white shadow-2xs"
                        />
                        <span
                          style={{ backgroundColor: seg.dept1.accentColorHex }}
                          className="w-3 h-3 rounded-full border border-white shadow-2xs"
                        />
                        <span
                          style={{ backgroundColor: seg.dept2.primaryColorHex }}
                          className="w-3 h-3 rounded-full border border-white shadow-2xs"
                        />
                      </div>
                    </div>
                    <span className="text-[11px] font-extrabold text-slate-800 leading-tight">
                      {seg.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Seletor de Tipografia Oficial da Marca (Zero Hardcode) */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-extrabold uppercase text-slate-600">
                  🔤 Par Tipográfico Homologado da Marca (Títulos & Preços + Rodapé)
                </label>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Anti-Canva • Leitura 2m Garantida
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {WHITE_LABEL_TYPOGRAPHY_PRESETS.map((preset) => {
                  const isSelected =
                    brandKit.typographyPresetId === preset.id ||
                    brandKit.fontHeading === preset.fontHeading;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => studioActions.applyTypographyPreset(preset.id)}
                      data-typography-preset={preset.id}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-emerald-900 bg-emerald-950/5 ring-2 ring-emerald-900/20'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          style={{ fontFamily: preset.fontHeading }}
                          className="text-xs font-black uppercase text-slate-900"
                        >
                          {preset.label}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-900 text-white">
                            Ativo
                          </span>
                        )}
                      </div>
                      <p
                        style={{ fontFamily: preset.fontBody }}
                        className="text-[10px] font-medium text-slate-500 mt-0.5"
                      >
                        {preset.segmentHint}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 2. SUBDEPARTAMENTOS & PALETA DE CORES */}
          <section className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-emerald-900">
                  2. Subdepartamentos & Setores da Loja
                </h3>
                <p className="text-[11px] text-slate-500">
                  Configure cores e setores específicos (Açougue, Pet, Agro, etc.)
                </p>
              </div>
              <label className="inline-flex items-center gap-2 cursor-pointer select-none bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  checked={brandKit.enableSubDepartments !== false}
                  onChange={(e) => studioActions.setEnableSubDepartments(e.target.checked)}
                  className="w-4 h-4 accent-emerald-700 rounded cursor-pointer"
                />
                <span className="text-xs font-extrabold text-slate-800">
                  Habilitar Subdepartamentos
                </span>
              </label>
            </div>

            {brandKit.enableSubDepartments === false ? (
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                ℹ️ Subdepartamentos desativados. Todas as artes usarão a identidade principal da loja.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {brandKit.departments.map((dept, index) => {
                  const primaryTextHex = resolveAccessibleTextColor(
                    dept.primaryColorHex
                  );
                  const primaryContrast = getContrastRatio(
                    dept.primaryColorHex,
                    primaryTextHex
                  );
                  const accentTextHex = resolveAccessibleTextColor(
                    dept.accentColorHex
                  );
                  const accentContrast = getContrastRatio(
                    dept.accentColorHex,
                    accentTextHex
                  );

                  return (
                    <div
                      key={dept.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                          Departamento #{index + 1}
                        </span>
                        <span
                          style={{
                            backgroundColor: dept.primaryColorHex,
                            color: primaryTextHex,
                          }}
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase shadow-2xs"
                        >
                          Preview Topo ({primaryContrast}:1)
                        </span>
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-slate-600 mb-1">
                          Nome do Departamento / Linha
                        </label>
                        <input
                          type="text"
                          value={dept.label}
                          onChange={(e) =>
                            studioActions.updateDepartment(dept.id, {
                              label: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-extrabold text-slate-900"
                        />
                      </div>

                      {/* Seletor rápido de ícone */}
                      <div>
                        <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">
                          Ícone da Aba
                        </label>
                        <div className="flex flex-wrap gap-1">
                          {DEPARTMENT_ICONS.map((item) => (
                            <button
                              key={item.key}
                              type="button"
                              onClick={() =>
                                studioActions.updateDepartment(dept.id, {
                                  iconKey: item.key,
                                })
                              }
                              className={`px-2 py-1 rounded-lg text-[11px] font-bold border transition-all flex items-center gap-1 ${
                                dept.iconKey === item.key
                                  ? 'bg-slate-900 text-white border-slate-900'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              <span>{item.emoji}</span>
                              <span>{item.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Cores Primária, Secundária e Destaque */}
                      <div className="grid grid-cols-3 gap-2 pt-1">
                        <div>
                          <label className="block text-[10px] font-extrabold text-slate-600 mb-1">
                            Primária
                          </label>
                          <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200">
                            <input
                              type="color"
                              value={dept.primaryColorHex}
                              onChange={(e) =>
                                studioActions.updateDepartment(dept.id, {
                                  primaryColorHex: e.target.value,
                                })
                              }
                              className="w-6 h-6 rounded cursor-pointer border-0 p-0"
                            />
                            <span className="text-[10px] font-mono font-bold uppercase text-slate-700">
                              {dept.primaryColorHex}
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-extrabold text-slate-600 mb-1">
                            Secundária
                          </label>
                          <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200">
                            <input
                              type="color"
                              value={dept.secondaryColorHex}
                              onChange={(e) =>
                                studioActions.updateDepartment(dept.id, {
                                  secondaryColorHex: e.target.value,
                                })
                              }
                              className="w-6 h-6 rounded cursor-pointer border-0 p-0"
                            />
                            <span className="text-[10px] font-mono font-bold uppercase text-slate-700">
                              {dept.secondaryColorHex}
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-extrabold text-slate-600 mb-1">
                            Destaque
                          </label>
                          <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200">
                            <input
                              type="color"
                              value={dept.accentColorHex}
                              onChange={(e) =>
                                studioActions.updateDepartment(dept.id, {
                                  accentColorHex: e.target.value,
                                })
                              }
                              className="w-6 h-6 rounded cursor-pointer border-0 p-0"
                            />
                            <span className="text-[10px] font-mono font-bold uppercase text-slate-700">
                              {dept.accentColorHex}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Validação WCAG Ao Vivo */}
                      <div className="flex items-center justify-between pt-1 text-[10px] font-bold text-slate-600">
                        <span>
                          Contraste Selo:{' '}
                          <strong className="text-slate-900">
                            {accentContrast}:1 (
                            {accentContrast >= 7
                              ? 'AAA'
                              : accentContrast >= 4.5
                                ? 'AA'
                                : 'Auto-Fix'}
                            )
                          </strong>
                        </span>
                        <span
                          style={{
                            backgroundColor: dept.accentColorHex,
                            color: accentTextHex,
                          }}
                          className="px-2 py-0.5 rounded-full font-black uppercase"
                        >
                          25% OFF
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* 3. CAMPANHAS SAZONAIS & SELOS DE OFERTA */}
          <section className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-emerald-900">
                3. Campanhas Sazonais & Selos de Oferta
              </h3>
            </div>

            {brandKit.seasonalCampaigns[0] && (
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Título da Campanha
                    </label>
                    <input
                      type="text"
                      value={brandKit.seasonalCampaigns[0].name}
                      onChange={(e) =>
                        studioActions.updateSeasonalCampaign(
                          brandKit.seasonalCampaigns[0].id,
                          { name: e.target.value }
                        )
                      }
                      placeholder="Ex: Black Friday / Feirão do Produtor"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Logo / Selo da Campanha
                    </label>
                    <div className="flex items-center gap-2">
                      {brandKit.seasonalCampaigns[0].badgeLogoUrl && (
                        <img
                          src={brandKit.seasonalCampaigns[0].badgeLogoUrl}
                          alt="Selo da Campanha"
                          className="h-8 max-w-[80px] object-contain bg-white rounded border border-slate-200 px-1"
                        />
                      )}
                      <label className="px-3 py-2 rounded-lg bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-extrabold cursor-pointer transition-colors shrink-0">
                        {brandKit.seasonalCampaigns[0].badgeLogoUrl ? 'Trocar Selo' : 'Enviar Selo'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = async () => {
                              if (typeof reader.result === 'string') {
                                const seloUrl = await tightCropAlphaDataUrl(reader.result, true);
                                try {
                                  const { primaryColorHex, accentColorHex } =
                                    await extractDominantColorsFromImage(seloUrl);
                                  studioActions.updateSeasonalCampaign(
                                    brandKit.seasonalCampaigns[0].id,
                                    {
                                      badgeLogoUrl: seloUrl,
                                      primaryColorHex,
                                      accentColorHex,
                                    }
                                  );
                                } catch {
                                  studioActions.updateSeasonalCampaign(
                                    brandKit.seasonalCampaigns[0].id,
                                    { badgeLogoUrl: seloUrl }
                                  );
                                }
                              }
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>
                      {brandKit.seasonalCampaigns[0].badgeLogoUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            studioActions.updateSeasonalCampaign(
                              brandKit.seasonalCampaigns[0].id,
                              { badgeLogoUrl: undefined }
                            )
                          }
                          className="px-2.5 py-2 rounded-lg border border-slate-200 text-xs font-bold text-red-700 hover:bg-red-50"
                        >
                          Remover
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">
                      Cor de Fundo da Campanha
                    </label>
                    <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200">
                      <input
                        type="color"
                        value={brandKit.seasonalCampaigns[0].primaryColorHex}
                        onChange={(e) =>
                          studioActions.updateSeasonalCampaign(
                            brandKit.seasonalCampaigns[0].id,
                            { primaryColorHex: e.target.value }
                          )
                        }
                        className="w-6 h-6 rounded cursor-pointer border-0 p-0"
                      />
                      <span className="text-[10px] font-mono font-bold uppercase text-slate-700">
                        {brandKit.seasonalCampaigns[0].primaryColorHex}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">
                      Cor do Selo / Destaque
                    </label>
                    <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200">
                      <input
                        type="color"
                        value={brandKit.seasonalCampaigns[0].accentColorHex}
                        onChange={(e) =>
                          studioActions.updateSeasonalCampaign(
                            brandKit.seasonalCampaigns[0].id,
                            { accentColorHex: e.target.value }
                          )
                        }
                        className="w-6 h-6 rounded cursor-pointer border-0 p-0"
                      />
                      <span className="text-[10px] font-mono font-bold uppercase text-slate-700">
                        {brandKit.seasonalCampaigns[0].accentColorHex}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1">
                  Chave Gemini Flash Vision (Opcional — Leitura de Rótulo por IA)
                </label>
                <input
                  type="password"
                  value={brandKit.geminiApiKey || ''}
                  onChange={(e) =>
                    studioActions.updateBrandKit({
                      geminiApiKey: e.target.value,
                    })
                  }
                  placeholder="AIzaSy... (Vazio = Motor Local R$ 0)"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-800 focus:border-emerald-800 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1">
                  Portabilidade / Clonar Loja para outra Filial (.JSON)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const json = studioActions.exportFullTenantBackup();
                      const blob = new Blob([json], {
                        type: 'application/json;charset=utf-8;',
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `backup-white-label-${brandKit.companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-extrabold transition-colors"
                  >
                    💾 Exportar JSON
                  </button>

                  <label className="flex-1 px-3 py-2 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-[11px] font-extrabold text-center cursor-pointer transition-colors">
                    📂 Restaurar JSON
                    <input
                      type="file"
                      accept=".json,application/json"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () => {
                          if (typeof reader.result === 'string') {
                            studioActions.importFullTenantBackup(reader.result);
                          }
                        };
                        reader.readAsText(file);
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Rodapé do Modal */}
        {!embedded && (
          <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-extrabold uppercase tracking-wider shadow-sm transition-colors"
            >
              Concluir Configuração
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
