# Documentação Técnica — Facelift Editorial "Pulso" (v2.3.0)

> **Data:** 2026-10-20  
> **Escopo:** Repaginação visual completa da casca da aplicação (`App Shell`), criação da Central Única de Configurações e despoluição do estúdio diário, preservando 100% da lógica de negócio (`src/core/**`) e dos templates matemáticos (`src/engine/**`).

---

## 1. Resumo Executivo

A aplicação recebeu a arquitetura visual editorial **Pulso** (inspirada na referência `interface legal/` e formalizada em [`DIRECIONAMENTO_VISUAL_PULSO_LUNA_MAX.md`](./DIRECIONAMENTO_VISUAL_PULSO_LUNA_MAX.md) e [`DEBLOAT_AND_ROLES_PLAN.md`](./DEBLOAT_AND_ROLES_PLAN.md)):

1. **App Shell Editorial (`252px` Sidebar + `65px` Topbar + Canvas `#f4f5f0`):** Substituição do antigo cabeçalho horizontal colorido e do rodapé fixo por uma navegação lateral fixa no desktop e gaveta deslizante (`drawer`) no mobile (`<= 1023px`).
2. **Menu Principal com 5 Categorias:**
   - `Redes sociais` (`SOCIAL_MEDIA` · `Alt+1`)
   - `Cartazes de loja` (`STORE_POSTER` · `Alt+2`)
   - `Carrosséis` (`CAROUSEL` · `Alt+3`)
   - `RH & comunicados` (`HR_NOTICE` · `Alt+4`)
   - `Configurações gerais` (`#/configuracoes/<aba>`)
3. **Central Única de Configurações (`SettingsCenter.tsx`):** Consolidação de todas as parametrizações da loja em 6 abas navegáveis com suporte a deep-link por hash (`identidade`, `regras`, `cartazes`, `social`, `erp`, `acesso`), embutindo `BrandKitModal` e `ErpIntegrationModal` via prop `variant="embedded"`.
4. **Stage de Prévia com Cantoneiras de Guilhotina (`PreviewStage.tsx`):** Moldura `.creative-frame` com cantoneiras gráficas nos 4 cantos para peças individuais e modo empilhado `.preview-stage--stack` para o Lote Auditável (múltiplas páginas A4 sem corte de `overflow`).
5. **Preferências de Interface Isoladas (`useUiPrefs.ts`):** Persistência reativa em `localStorage['alfa_pulso_ui_prefs_v1']` via `useSyncExternalStore`, mantendo `workMode` (`OPERATOR` | `MANAGER`) e visibilidade de campos opcionais por módulo sem interferir no `StudioGlobalState` (`schemaVersion: 4`) nem no backup `.json`.
6. **Refinamento de Usabilidade Operacional (`UX-02`):**
   - Escala tipográfica ampliada para leitura confortável em monitores de balcão (base `15px`, inputs `14px`, labels `12px`, links `13.5px`).
   - Microcopy direta e comercial (remoção de slogans e de atalhos soltos na barra principal, mantendo atalhos no modal dedicado `Alt+H`, e alinhamento inline de `HelpHint`).
   - Busca silenciosa de SKU em segundo plano sem botões de infraestrutura (`Base ERP`) na tela de operação.
   - Opções secundárias de CTA recolhidas no accordion **"Mais opções de CTA"**.
   - Cantos retos (`border-radius: 0`) nos cards de preview e exportação de Redes Sociais, e remoção de cabeçalhos escuros herdados nos modais embutidos.

---

## 2. Inventário de Arquivos Criados e Modificados

### Arquivos Criados
| Arquivo | Responsabilidade |
| :--- | :--- |
| `src/ui/styles/pulso-shell.css` | Tokens CSS em `:root` (`--canvas`, `--paper`, `--line`, `--ink`, `--muted`, `--brand`, `--highlight`, `--tint`) e classes escopadas do shell, sidebar, topbar, formulários, stage de prévia, central de configurações e responsividade (`1250px`, `1060px`, `1023px`, `900px`, `680px`). Zero regras `@media print` ou seletores que alcancem `[data-sheet]`. |
| `src/ui/icons.tsx` | Conjunto de ícones SVG vetoriais leves (`stroke="currentColor"`, zero dependências externas). |
| `src/ui/useUiPrefs.ts` | Store externo sincronizado com `useSyncExternalStore` na chave `alfa_pulso_ui_prefs_v1` para persistir `workMode` e os toggles de visibilidade de campos por módulo (`UiControl`). |
| `src/ui/settingsTabs.ts` | Tipagem `SettingsTab`, metadados das 6 abas da Central de Configurações e type guard `isSettingsTab`. |
| `src/ui/Sidebar.tsx` | Barra lateral fixa/drawer com wordmark `alfa pulso.`, card do espaço de trabalho com seletor de departamentos, menu de 5 categorias, card de cota freemium (`data-freemium-*`), atalho de ajuda e seletor de perfil (`Modo balcão` / `Modo governança`). |
| `src/ui/Topbar.tsx` | Barra superior de `65px` com botão hambúrguer mobile, breadcrumb contextual, indicador `Salvo automaticamente`, botão de ajuda (`Alt+H`) e atalho de conta. |
| `src/ui/PreviewStage.tsx` | Stage pontilhado (`.stage-dots`), moldura `.creative-frame` com cantoneiras (`.frame-corner--tl/tr/bl/br`) e suporte ao modo empilhado (`.preview-stage--stack`) para lotes. |
| `src/ui/SettingsCenter.tsx` | Página dedicada da Central de Configurações com 6 abas (`identidade`, `regras`, `cartazes`, `social`, `erp`, `acesso`), controles de visibilidade por módulo e exposição do toggle `showPricePerKgOrLiter`. |

### Arquivos Modificados
| Arquivo | Mudanças Realizadas |
| :--- | :--- |
| `src/main.tsx` | Importação de `./ui/styles/pulso-shell.css` após `./index.css`. |
| `src/App.tsx` | Migração para o layout `.app-shell` com injeção dinâmica de `--brand` e `--brand-ink` (WCAG 2.1 via `resolveAccessibleTextColor`), cabeçalho editorial `.page-intro`, cabeçalho numerado `.editor-header` (`01`), barra unificada `.preview-tools`, card `.compliance-inline`, roteamento hash `#/configuracoes/<aba>` (incluindo listener `hashchange`), modal de ajuda/atalhos (`Alt+H`) e remoção de botões/chips duplicados. |
| `src/ui/BrandKitModal.tsx` | Adicionada prop opcional `variant?: 'modal' | 'embedded'` para renderização inline dentro da aba `Identidade da marca` sem overlay `fixed inset-0`. |
| `src/ui/ErpIntegrationModal.tsx` | Adicionada prop opcional `variant?: 'modal' | 'embedded'` para renderização inline dentro da aba `Base ERP` sem overlay `fixed inset-0`. |
| `src/core/store.ts` | Adicionada action `togglePosterPricePerMeasure(show: boolean)` para controlar `posterConfig.showPricePerKgOrLiter` já existente no estado. |
| `index.html` | Adicionado favicon SVG inline (eliminando erro 404 de `/favicon.ico`) e atualizado título da página. |
| `scripts/audit.mjs` | Corrigida geração de data local (`YYYY-MM-DD`) no teste de vigência retroativa (evitando falso negativo por fuso UTC vs UTC-3). |
| `.gitignore` | Ignorados artefatos locais da pasta de referência (`interface legal/node_modules`, `interface legal/data`, `interface legal/.next`). |

---

## 3. Contratos DOM e Garantias Arquiteturais Preservadas

Todos os contratos semânticos exigidos por `AGENTS.md`, `PRODUCT_VISION.md` e `scripts/audit.mjs` foram verificados em navegador headless (Puppeteer):

- **Cartazes e Peças (`PosterAndSocialCanvas.tsx` intocado):**
  - `data-sheet` (`a4-full`, `a5-half`, `gondola`, `a4-hr-notice`, `social-hr-notice`)
  - `data-slots` (`1`, `2`, `4`)
  - `data-poster-archetype`
  - `data-price-integer`, `data-price-cents`, `data-effective-price`, `data-price-per-measure`
  - `data-guardrail-status`, `data-sku-code`, `data-brand-name`, `data-font-heading`, `data-font-body`
  - `data-carousel-slide-type`, `data-slide-index`, `data-hr-archetype`
- **Modo Lote:**
  - `data-batch-total` e `data-batch-valid` preservados no painel de lote e nas folhas renderizadas.
- **Freemium & Planos:**
  - `data-freemium-tier`, `data-freemium-used` e `data-freemium-limit` preservados no `.freemium-card` da Sidebar.
- **Atalhos de Teclado Sem Mouse:**
  - `Alt+1` (Redes sociais), `Alt+2` (Cartazes), `Alt+3` (Carrosséis), `Alt+4` (RH & comunicados), `Alt+M` (Identidade da marca), `Alt+E` (Base ERP), `Alt+V` (Focar Smart Paste), `Alt+L` (Higienizar siglas), `Alt+H` (Ajuda), `Ctrl/Cmd+P` (Imprimir A4) e `Esc` (Fechar painéis/drawer).

---

## 4. Validação Executada

1. **TypeScript (`npx tsc --noEmit`):** `0` erros.
2. **Build de Produção (`npx vite build`):** Compilado com sucesso (`dist/assets/index-*.css` e `dist/assets/index-*.js`).
3. **Suíte de Auditoria (`npm test` / `node scripts/audit.mjs`):** `18/18` testes aprovados.
4. **Verificação E2E Headless (`puppeteer-core` + Google Chrome):**
   - `scrollHeight === clientHeight` (`503px === 503px`) em `A4_FULL`, `A5_HALF` e `GONDOLA_2X2`.
   - Navegação completa pelos 5 itens da sidebar e pelas 6 abas de configurações (`#/configuracoes/*`).
   - Persistência de `alfa_pulso_ui_prefs_v1` e abertura/fechamento do drawer mobile (`390x844`) sem erros de console ou rede.
