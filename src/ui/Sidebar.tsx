import React from 'react';
import { useStudioStore, studioActions } from '../core/store';
import { COAGRO_HUB_BRAND, type ModuleMode } from '../core/types';
import { COAGRO_STORES, getCoagroStoreById } from '../core/coagroStores';
import { LogoHorizontalAzul, CoagroSimboloCasinha } from './coagroLogos';
import {
  IconCarousel,
  IconMegaphone,
  IconPoster,
  IconSettings,
  IconShield,
  IconSparkles,
  IconUsers,
} from './icons';
import type { SettingsTab } from './settingsTabs';

interface SidebarProps {
  activeModule: ModuleMode;
  isSettings: boolean;
  onSelectModule: (module: ModuleMode) => void;
  onOpenSettings: (tab?: SettingsTab) => void;
  onOpenHelp: () => void;
  onOpenPaywall: () => void;
  onOpenLandingPage?: () => void;
  drawerOpen: boolean;
  onCloseDrawer: () => void;
}

const MODULES: {
  id: ModuleMode;
  label: string;
  badge?: string;
  icon: React.FC<{ size?: number }>;
}[] = [
  { id: 'STORE_POSTER', label: '1. Cartazes de PDV', badge: 'Via Verde', icon: IconPoster },
  { id: 'BANNER_FAIXA', label: '2. Faixas & Lonas', badge: 'Cotação', icon: IconSparkles },
  { id: 'SOCIAL_MEDIA', label: '3. Anúncios Loja (Zap)', icon: IconMegaphone },
  { id: 'CAROUSEL', label: '4. Carrossel de Ofertas', icon: IconCarousel },
  { id: 'BRAND_HUB', label: '5. Kit Colaborador & Marca', icon: IconUsers },
  { id: 'RADIO_SPOT', label: '6. Rádio Coagro (:8790)', icon: IconMegaphone },
  { id: 'HR_NOTICE', label: '7. Comunicados & Mural A4', icon: IconUsers },
  { id: 'CURATOR_QUEUE', label: 'Fila do Curador (Kaio)', icon: IconShield },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  isSettings,
  onSelectModule,
  onOpenSettings,
  onOpenHelp,
  drawerOpen,
  onCloseDrawer,
}) => {
  const state = useStudioStore();
  const { brandKit, activeStoreId, userRole, marketingRequests } = state;
  const activeStore = getCoagroStoreById(activeStoreId);
  const activeDept =
    brandKit.departments.find((d) => d.id === brandKit.activeDepartmentId) ||
    brandKit.departments[0];

  const pendingRequestsCount = marketingRequests.filter(
    (r) => r.status === 'PENDING' || r.status === 'QUOTING'
  ).length;

  const select = (module: ModuleMode) => {
    onSelectModule(module);
    onCloseDrawer();
  };

  return (
    <aside className="sidebar" aria-label="Navegação principal" data-drawer-open={drawerOpen}>
      <button
        type="button"
        className="brand-lockup flex items-center gap-2.5"
        onClick={() => select('STORE_POSTER')}
        aria-label={`Ir para o ${COAGRO_HUB_BRAND.name}`}
      >
        <LogoHorizontalAzul className="h-9 w-auto max-w-[186px]" />
      </button>

      <p className="sidebar-label">NOSSAS UNIDADES · FILIAL ATIVA</p>

      <div className="workspace-card space-y-2.5">
        <div className="workspace-top">
          <span className="workspace-avatar bg-[#004d40] text-[#ffab00]" aria-hidden="true">
            <CoagroSimboloCasinha className="w-5 h-5" />
          </span>
          <span className="workspace-copy">
            <strong title={activeStore.nome}>{activeStore.nome}</strong>
            <span title={`${activeStore.cidade}/${activeStore.estado} • ${activeStore.telefoneFormatado}`}>
              {activeStore.cidade}/{activeStore.estado} • {activeStore.telefoneFormatado}
            </span>
          </span>
        </div>

        <div>
          <label htmlFor="sidebar-store-select" className="sr-only">
            Selecionar unidade Coagro
          </label>
          <select
            id="sidebar-store-select"
            value={activeStoreId}
            onChange={(e) => studioActions.setActiveStore(e.target.value)}
            className="w-full rounded-lg bg-white border border-slate-200 text-slate-800 px-2.5 py-1.5 text-[11px] font-bold cursor-pointer focus:outline-none focus:border-[#002B49]"
          >
            {COAGRO_STORES.filter(
              (st) => st.ativo !== false && st.identityEnabled !== false && st.bandeira !== 'RB_AGRICOLA'
            ).map((st) => (
              <option key={st.id} value={st.id}>
                {st.nome} ({st.cidade}/{st.estado})
              </option>
            ))}
          </select>
        </div>

        {brandKit.enableSubDepartments !== false && (
          <div className="workspace-departments" role="group" aria-label="Bandeira ativa">
            {brandKit.departments
              .filter(
                (dept) =>
                  dept.enabled !== false &&
                  (dept.id === 'dept-1' || (dept.id === 'dept-2' && activeStore.hasPetDepartment))
              )
              .map((dept) => {
              const active = dept.id === activeDept?.id;
              return (
                <button
                  key={dept.id}
                  type="button"
                  onClick={() => studioActions.setActiveDepartment(dept.id)}
                  className={`workspace-dept${active ? ' workspace-dept--active' : ''}`}
                  aria-pressed={active}
                  title={`Ativar paleta ${dept.label}`}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full inline-block mr-1.5 shrink-0"
                    style={{ backgroundColor: dept.primaryColorHex }}
                    aria-hidden="true"
                  />
                  {dept.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <p className="sidebar-label">MÓDULOS DO HUB COAGRO</p>
      <nav className="side-nav" aria-label="Menu principal">
        {MODULES.map(({ id, label, badge, icon: Icon }) => {
          const active = !isSettings && activeModule === id;
          const isQueue = id === 'CURATOR_QUEUE';
          return (
            <button
              key={id}
              type="button"
              className={`side-link justify-between${active ? ' side-link--active' : ''}`}
              aria-current={active ? 'page' : undefined}
              onClick={() => select(id)}
            >
              <span className="flex items-center gap-2.5 truncate">
                <Icon size={16} />
                <span className="truncate">{label}</span>
              </span>
              {isQueue && pendingRequestsCount > 0 ? (
                <span className="px-1.5 py-0.5 rounded-full bg-[#ffab00] text-slate-950 text-[10px] font-black shrink-0">
                  {pendingRequestsCount}
                </span>
              ) : badge ? (
                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[9px] font-bold uppercase shrink-0">
                  {badge}
                </span>
              ) : null}
            </button>
          );
        })}

        <button
          type="button"
          className={`side-link${isSettings ? ' side-link--active' : ''}`}
          aria-current={isSettings ? 'page' : undefined}
          onClick={() => {
            onOpenSettings();
            onCloseDrawer();
          }}
        >
          <IconSettings size={16} />
          <span>Configurações &amp; Base ERP</span>
          {isSettings && <i aria-hidden="true" />}
        </button>
      </nav>

      <div className="sidebar-bottom">
        <div
          className="freemium-card"
          data-freemium-tier="ENTERPRISE"
          data-governance-role={userRole}
        >
          <div className="freemium-top">
            <span className="free-dot" aria-hidden="true" />
            GOVERNANÇA DETERMINÍSTICA
          </div>
          <div className="freemium-count">
            <strong>{pendingRequestsCount}</strong>
            <span>
              demandas na
              <br />
              fila do Curador
            </span>
          </div>
          <p>
            Identidade travada (#002B49 / #004d40 / #ffab00). Zero alucinação de IA generativa.
          </p>
          <button
            type="button"
            className="upgrade-link"
            onClick={() => select('CURATOR_QUEUE')}
          >
            <IconShield size={11} /> Abrir Painel do Curador
          </button>
        </div>
      </div>
    </aside>
  );
};
