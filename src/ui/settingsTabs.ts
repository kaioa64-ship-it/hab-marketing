export type SettingsTab =
  | 'identidade'
  | 'regras'
  | 'cartazes'
  | 'social'
  | 'erp'
  | 'acesso';

export const SETTINGS_TABS: { id: SettingsTab; label: string; hint: string }[] = [
  { id: 'identidade', label: 'Identidade da marca', hint: 'Logo, cores, departamentos e contatos' },
  { id: 'regras', label: 'Regras comerciais', hint: 'Preços, vigência e compliance' },
  { id: 'cartazes', label: 'Cartazes de loja', hint: 'Formato, tema e arquétipo padrão' },
  { id: 'social', label: 'Redes sociais', hint: 'Proporção, tema e zonas seguras' },
  { id: 'erp', label: 'Base ERP', hint: 'Catálogo, importação e sincronização' },
  { id: 'acesso', label: 'Acesso e interface', hint: 'Modo de uso e campos visíveis' },
];

export function isSettingsTab(value: string | null | undefined): value is SettingsTab {
  return SETTINGS_TABS.some((tab) => tab.id === value);
}
