import React from 'react';
import { IconHelp, IconMenu } from './icons';
import { useStudioStore, studioActions } from '../core/store';
import { getCoagroStoreById } from '../core/coagroStores';
import type { CoagroUserRole } from '../core/types';
import type { SettingsTab } from './settingsTabs';

interface TopbarProps {
  pageLabel: string;
  isSettings: boolean;
  onToggleDrawer: () => void;
  onOpenHelp: () => void;
  onOpenSettings: (tab?: SettingsTab) => void;
  initials: string;
  workMode?: 'OPERATOR' | 'MANAGER';
  onSelectWorkMode?: (mode: 'OPERATOR' | 'MANAGER') => void;
  isLandingPage?: boolean;
  onToggleLandingPage?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  pageLabel,
  isSettings,
  onToggleDrawer,
  onOpenHelp,
  onOpenSettings,
  onSelectWorkMode,
  isLandingPage = false,
  onToggleLandingPage,
}) => {
  const state = useStudioStore();
  const activeStore = getCoagroStoreById(state.activeStoreId);
  const { userRole } = state;

  const handleRoleChange = (nextRole: CoagroUserRole) => {
    studioActions.setUserRole(nextRole);
    if (onSelectWorkMode) {
      onSelectWorkMode(nextRole === 'OPERATOR' ? 'OPERATOR' : 'MANAGER');
    }
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="menu-button"
          onClick={onToggleDrawer}
          aria-label="Abrir menu de navegação"
        >
          <IconMenu size={17} />
        </button>
        <div className="breadcrumb" aria-label="Você está em">
          <span>Hub Coagro ({activeStore.nome.replace('Coagro ', '')})</span>
          <b>/</b>
          <strong>
            {isLandingPage
              ? 'Apresentação Executiva'
              : isSettings
                ? `Configurações · ${pageLabel}`
                : pageLabel}
          </strong>
        </div>
      </div>

      <div className="topbar-actions flex items-center gap-2">
        {/* Seletor RBAC de 3 Níveis (Seção 3.1 da Especificação) */}
        {!isLandingPage && (
          <div className="hidden sm:inline-flex items-center gap-1 p-0.5 bg-slate-100 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => handleRoleChange('OPERATOR')}
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 cursor-pointer ${
                userRole === 'OPERATOR'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Perfil Balcão: Emissão rápida de cartazes via verde"
            >
              <span>🛒</span> Balcão
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('STORE_MANAGER')}
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 cursor-pointer ${
                userRole === 'STORE_MANAGER'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Perfil Gerente de Loja: Preenche formulários e solicita peças ao Marketing"
            >
              <span>🏬</span> Gerente ({activeStore.cidade})
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('CURATOR_ADMIN')}
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 cursor-pointer ${
                userRole === 'CURATOR_ADMIN'
                  ? 'bg-[#004d40] text-[#ffab00] shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Perfil Curador Único (Kaio — Marketing): Visão global, edição e exportação alta resolução"
            >
              <span>🛡️</span> Curador (Kaio)
            </button>
          </div>
        )}

        {onToggleLandingPage && isLandingPage && (
          <button
            type="button"
            onClick={onToggleLandingPage}
            className="px-2.5 py-1 rounded-xl border text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer bg-amber-400 text-slate-950 border-amber-500 shadow-2xs"
            title="Voltar ao Hub Coagro"
          >
            <span>⚡ Voltar ao Hub</span>
          </button>
        )}

        <button
          type="button"
          className="top-icon-button"
          onClick={onOpenHelp}
          title="Ajuda e atalhos (Alt+H)"
          aria-label="Abrir ajuda e atalhos"
        >
          <IconHelp size={15} />
        </button>
        <button
          type="button"
          className="top-profile"
          onClick={() => onOpenSettings('acesso')}
          title="Preferências de acesso e filial"
        >
          <span
            className="profile-avatar"
            style={{ width: 24, height: 24, flexBasis: 24 }}
          >
            {userRole === 'CURATOR_ADMIN' ? 'KV' : 'GE'}
          </span>
          <span className="hidden sm:inline">
            {userRole === 'CURATOR_ADMIN' ? 'Curador' : activeStore.cidade}
          </span>
        </button>
      </div>
    </header>
  );
};
