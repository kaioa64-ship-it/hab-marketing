// src/ui/PaywallModal.tsx
import React, { useState, useEffect, useRef } from 'react';
import { PlanTier, LeadProfile, SAAS_BRAND, buildCommercialCheckoutUrl } from '../core/types';
import { useStudioStore, studioActions } from '../core/store';

export interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  planTier: PlanTier;
  usedThisMonth: number;
  monthlyLimit: number;
  initialMode?: 'LEAD_CAPTURE' | 'UPGRADE_PAYWALL';
  onSuccess?: () => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  isOpen,
  onClose,
  planTier,
  usedThisMonth,
  monthlyLimit,
  initialMode,
  onSuccess,
}) => {
  const state = useStudioStore();
  const [mode, setMode] = useState<'LEAD_CAPTURE' | 'UPGRADE_PAYWALL'>('LEAD_CAPTURE');
  const [leadName, setLeadName] = useState(state.leadProfile?.name || '');
  const [storeName, setStoreName] = useState(state.leadProfile?.storeName || state.brandKit.companyName || '');
  const [leadContact, setLeadContact] = useState(state.leadProfile?.whatsappOrEmail || '');
  const [branchCount, setBranchCount] = useState<string>(state.leadProfile?.branchCount || '1 loja');
  const [licenseKey, setLicenseKey] = useState('');
  const contactInputRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      const hasLead = Boolean(
        state.leadProfile?.whatsappOrEmail ||
        (typeof window !== 'undefined' &&
          (localStorage.getItem('gabarito_lead_profile_v1') ||
           localStorage.getItem('alfa_pulso_lead_contact') ||
           localStorage.getItem('alfa_pulso_lead_whatsapp')))
      );

      if (initialMode) {
        setMode(initialMode);
      } else if (!hasLead && planTier === 'FREE') {
        setMode('LEAD_CAPTURE');
      } else {
        setMode('UPGRADE_PAYWALL');
      }
      setFeedback(null);
    }
  }, [isOpen, initialMode, planTier, state.leadProfile]);

  if (!isOpen) return null;

  const isQuotaReached = planTier === 'FREE' && usedThisMonth >= monthlyLimit;

  const handleGoogleOneClick = () => {
    const cleanedContact = leadContact.trim();
    if (!cleanedContact || cleanedContact.length < 4) {
      setFeedback({
        type: 'error',
        message:
          '⚡ Preencha seu WhatsApp ou E-mail comercial abaixo para vincular em 1 clique e liberar seu Gabarito em 300 DPI.',
      });
      contactInputRef.current?.focus();
      return;
    }

    const profile: LeadProfile = {
      name: leadName.trim() || 'Lojista',
      storeName: storeName.trim() || state.brandKit.companyName || 'Minha Loja',
      whatsappOrEmail: cleanedContact,
      branchCount,
      authProvider: 'google',
      capturedAt: new Date().toISOString(),
    };

    studioActions.setLeadProfile(profile);

    setFeedback({
      type: 'success',
      message: '✅ Conta identificada com sucesso! Liberando seu Gabarito em 300 DPI...',
    });
    setTimeout(() => {
      onClose();
      onSuccess?.();
    }, 600);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadContact.trim() || leadContact.trim().length < 4) {
      setFeedback({
        type: 'error',
        message: '⚠️ Informe um WhatsApp ou e-mail comercial válido para liberar o download.',
      });
      return;
    }

    const profile: LeadProfile = {
      name: leadName.trim() || 'Responsável',
      storeName: storeName.trim() || 'Minha Loja',
      whatsappOrEmail: leadContact.trim(),
      branchCount,
      authProvider: 'direct',
      capturedAt: new Date().toISOString(),
    };

    studioActions.setLeadProfile(profile);

    setFeedback({
      type: 'success',
      message: '🎉 Identificação confirmada! Liberando seu Gabarito em 300 DPI...',
    });

    setTimeout(() => {
      onClose();
      onSuccess?.();
    }, 600);
  };

  const handleActivateKey = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = studioActions.activateLicenseKey(licenseKey);
    if (ok) {
      setFeedback({
        type: 'success',
        message: '✅ Licença PRO ativada com sucesso! Exportações ilimitadas liberadas.',
      });
      setTimeout(() => {
        setFeedback(null);
        onClose();
        onSuccess?.();
      }, 1200);
    } else {
      setFeedback({
        type: 'error',
        message:
          '⚠️ Chave inválida. Informe um código iniciado por ALFA- ou PRO- (mínimo 8 caracteres).',
      });
    }
  };

  return (
    <div
      data-modal="paywall-checkout"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden my-8">
        {/* Topo de Conversão */}
        {/* Topo de Conversão */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white px-6 py-5 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm font-black transition-colors cursor-pointer"
            aria-label="Fechar modal"
          >
            ✕
          </button>

          <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider mb-2">
            {mode === 'LEAD_CAPTURE'
              ? '🎉 Arte 100% Pronta com Blindagem Legal'
              : isQuotaReached
                ? 'Limite Mensal Grátis Atingido'
                : 'Planos Comerciais • Gabarito Pro'}
          </span>

          <h2 className="text-xl font-black tracking-tight leading-snug">
            {mode === 'LEAD_CAPTURE'
              ? 'Seu Gabarito está pronto em 300 DPI!'
              : isQuotaReached
                ? `Você utilizou suas ${monthlyLimit} artes grátis deste mês!`
                : 'Escolha o Plano Ideal para a sua Loja'}
          </h2>

          <p className="text-xs text-slate-300 mt-1">
            {mode === 'LEAD_CAPTURE'
              ? 'Identifique sua loja para baixar e imprimir em alta resolução imediatamente (sem cartão de crédito).'
              : 'Gere cartazes A4, A5, Gôndola e Stories em menos de 10 segundos com conformidade PROCON/MAPA.'}
          </p>
        </div>

        {/* CORPO DO MODAL */}
        <div className="p-6 space-y-5">
          {feedback && (
            <div
              className={`p-3 rounded-xl text-xs font-bold text-center border ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                  : 'bg-red-50 text-red-900 border-red-300'
              }`}
            >
              {feedback.message}
            </div>
          )}

          {mode === 'LEAD_CAPTURE' ? (
            /* ============================================================== */
            /* MODO 1: CAPTURA DE LEAD RÁPIDA NOS 95% (DOWNLOAD GRATUITO)     */
            /* ============================================================== */
            <div className="space-y-4">
              {/* Opção 1: 1 Clique com Google */}
              <div>
                <button
                  type="button"
                  onClick={handleGoogleOneClick}
                  className="w-full py-3 px-5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs uppercase tracking-wide shadow-xs flex items-center justify-center gap-3 transition-all cursor-pointer"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continuar com Google (1 Clique)</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-[10px] font-extrabold uppercase text-slate-400">
                  ou preencha para liberar
                </span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              {/* Opção 2: Formulário rápido */}
              <form onSubmit={handleLeadSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                      Seu Nome
                    </label>
                    <input
                      type="text"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      placeholder="Ex: Carlos Santos"
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                      Nome da Loja ou Filial
                    </label>
                    <input
                      type="text"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="Ex: Agro São José"
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                    WhatsApp Comercial ou E-mail <span className="text-red-600">*</span>
                  </label>
                  <input
                    ref={contactInputRef}
                    type="text"
                    value={leadContact}
                    onChange={(e) => setLeadContact(e.target.value)}
                    placeholder="Ex: (16) 99876-5432 ou gerente@loja.com"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1.5">
                    Quantas lojas você possui?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: '1 loja', label: '1 loja' },
                      { id: '2 a 4 lojas', label: '2 a 4 lojas' },
                      { id: '5+ filiais', label: '5+ filiais' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setBranchCount(opt.id)}
                        className={`py-2 px-2 rounded-xl text-xs font-black transition-all border text-center ${
                          branchCount === opt.id
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  <span>⚡</span> Liberar Download & Impressão Imediata
                </button>
              </form>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setMode('UPGRADE_PAYWALL')}
                  className="text-[11px] font-bold text-slate-600 hover:text-slate-900 hover:underline cursor-pointer"
                >
                  Já tem chave de licença PRO ou quer ver os planos? Clique aqui.
                </button>
              </div>
            </div>
          ) : (
            /* ============================================================== */
            /* MODO 2: 2 CAMINHOS DE AUTOVENDA (STARTER vs REDE/GOVERNANÇA)   */
            /* ============================================================== */
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* CAMINHO 1: PLANO BALCÃO PRO (R$ 97/mês) */}
                <div className="p-4 rounded-2xl border-2 border-slate-900 bg-slate-50 flex flex-col justify-between space-y-3 relative">
                  <span className="absolute -top-2.5 left-3 px-2 py-0.5 rounded-full bg-slate-900 text-amber-300 text-[9px] font-black uppercase tracking-wider">
                    Ideal para 1 Loja • Balcão
                  </span>
                  <div>
                    <div className="text-xs font-black uppercase text-slate-950">
                      Plano Balcão Pro
                    </div>
                    <div className="text-2xl font-black text-slate-950 mt-1 leading-none">
                      R$ 97
                      <span className="text-[11px] font-bold text-slate-600">/mês</span>
                    </div>
                    <ul className="text-[11px] font-semibold text-slate-700 space-y-1 mt-2.5">
                      <li>✓ Cartazes A4, A5 e Gôndola Ilimitados</li>
                      <li>✓ Stories 9:16 e Feed 4:5 em 1080p</li>
                      <li>✓ Auto-recorte inteligente de fotos em 1 clique</li>
                      <li>✓ Validação jurídica PROCON/MAPA 100% blindada</li>
                    </ul>
                  </div>
                  <a
                    href={buildCommercialCheckoutUrl(
                      'BALCAO',
                      `Olá! Sou ${leadName || 'lojista'} da loja ${storeName || 'Varejo'}. Quero assinar o Plano Balcão Pro R$${SAAS_BRAND.plans.balcaoProPrice} do Gabarito Pro!`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-black text-amber-300 font-black text-[11px] uppercase tracking-wider text-center shadow-xs transition-colors block"
                  >
                    💳 Assinar Balcão Pro
                  </a>
                </div>

                {/* CAMINHO 2: PLANO GOVERNANÇA DE REDE (R$ 197/mês) */}
                <div className="p-4 rounded-2xl border-2 border-amber-400 bg-amber-50/40 flex flex-col justify-between space-y-3 relative">
                  <span className="absolute -top-2.5 left-3 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black uppercase tracking-wider">
                    Redes & Franquias
                  </span>
                  <div>
                    <div className="text-xs font-black uppercase text-slate-900">
                      Plano Governança de Rede
                    </div>
                    <div className="text-2xl font-black text-slate-900 mt-1 leading-none">
                      R$ 197
                      <span className="text-[11px] font-bold text-slate-600">/mês</span>
                    </div>
                    <p className="text-[10.5px] font-bold text-amber-950 leading-tight mt-1.5 bg-amber-100/70 p-1.5 rounded-lg border border-amber-200">
                      🔒 Trave o gabarito da sua marca para operadores não errarem preço nem regra do MAPA/PROCON.
                    </p>
                    <ul className="text-[11px] font-semibold text-slate-700 space-y-1 mt-2">
                      <li>✓ Múltiplas lojas e filiais conectadas ({branchCount})</li>
                      <li>✓ Integração automática com ERP (API/CSV)</li>
                      <li>✓ Módulo Carrossel Guiado + Módulo RH</li>
                      <li>✓ Trava de margem de custo anti-prejuízo</li>
                    </ul>
                  </div>
                  <div className="space-y-1.5">
                    <a
                      href={buildCommercialCheckoutUrl(
                        'REDE',
                        `Olá! Sou ${leadName || 'lojista'} da loja ${storeName || 'Varejo'} (${branchCount}). Tenho interesse no Plano Governança de Rede R$${SAAS_BRAND.plans.governancaPrice} do Gabarito Pro!`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-[11px] uppercase tracking-wider text-center shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>📲</span> Falar no WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              {/* Ativação de Chave de Licença */}
              <form
                onSubmit={handleActivateKey}
                className="pt-3 border-t border-slate-200 space-y-2"
              >
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
                  🔑 Já possui uma Chave de Licença PRO?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={licenseKey}
                    onChange={(e) => setLicenseKey(e.target.value)}
                    placeholder="Ex: ALFA-PRO-2026"
                    className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-mono font-bold uppercase text-slate-900"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-950 text-white text-xs font-extrabold uppercase tracking-wider shrink-0 transition-colors cursor-pointer"
                  >
                    Ativar
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Rodapé do Modal com Informações de Cota */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-[11px] text-slate-500">
          <span>
            Status:{' '}
            <strong className="text-slate-800">
              {planTier === 'PRO'
                ? 'Plano PRO Ilimitado'
                : `Gratuito (${usedThisMonth}/${monthlyLimit} artes usadas)`}
            </strong>
          </span>
          {planTier === 'PRO' && (
            <button
              type="button"
              onClick={() => studioActions.setPlanTier('FREE')}
              className="text-slate-400 hover:text-slate-700 underline font-semibold cursor-pointer"
            >
              Simular modo Gratuito
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
