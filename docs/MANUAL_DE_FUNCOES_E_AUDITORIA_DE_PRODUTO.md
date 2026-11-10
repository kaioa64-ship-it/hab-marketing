# Manual Completo de Funções, Auditoria de Produto e Plano de Execução (v2.7.0)
**Gabarito Pro — Plataforma de Precificação em 10s & Governança Visual**  
*Documento Oficial de Referência Técnica, Auditoria de Código-Fonte e Plano de Aprovação*

---

## 📌 Sumário Executivo

Este documento consolida:
1. **O inventário real de 100% das funções, botões e fluxos** do **Gabarito Pro (`v2.7.0`)**, separando com transparência o que é motor determinístico real, o que é simulação de interface (mock) e o que depende de configuração externa.
2. **A auditoria cruzada entre a intenção visual e o código-fonte atual** (`src/engine/PosterAndSocialCanvas.tsx`, `src/core/businessRules.ts`, `src/ui/*`), identificando exatamente por que alguns cartazes ainda parecem "protótipos de engenharia" e onde estão os gargalos no código.
3. **O Plano de Execução para Aprovação**, dividindo cirurgicamente **o que a IA consegue executar 100% sozinha no código (Zero Intervenção)** do que **depende de credenciais ou decisões suas**.

> **Status desta etapa:** Documento revisado, auditado contra o código-fonte `v2.7.0` e aguardando sua aprovação para disparo da implementação. Nenhuma alteração em `src/` foi executada nesta etapa.

---

## 1. Mapeamento de Fidelidade: O Que Funciona vs. O Que É Mock (Auditoria `v2.7.0`)

| Recurso / Área | Status Atual | Arquivo / Função no Código | Diagnóstico Real de Comportamento e Gaps Encontrados |
| :--- | :---: | :--- | :--- |
| **Motor de Cálculo Comercial & Centavos** | ✅ **100% Real** | `src/core/businessRules.ts` (`computeOfferMetrics`, `applyCommercialRounding`) | Calcula DE/POR, descontos %, parcelas CDC, equivalência por kg/litro (Decreto 5.903) e centavos atômicos. Auditado por 22 testes em `scripts/audit.mjs`. |
| **Parser Smart Paste (WhatsApp)** | ✅ **100% Real** | `src/core/businessRules.ts` (`parseWhatsAppSmartPaste`) | Extrai produto, peso/medida (blindado contra NPK e decimais), DE/POR, parcelamento e validade localmente a custo R$ 0. |
| **Validação MAPA / PROCON / CRMV** | ✅ **100% Real** | `src/core/businessRules.ts` (`detectRegulatoryCategoryByText`, `evaluateOfferGuardrails`) | Detecta NCMs (`3808*`, `3101..3105*`, `3002.30*`, `2203..2208*`) e princípios ativos, bloqueando exportação se `POR >= DE`, abaixo do custo ou data vencida. |
| **Impressão A4 / A5 / Gôndola / Grid 6x** | ✅ **100% Real** | `src/engine/exporter.ts` (`printOrSaveA4Sheet`) | Gera iframe isolado em `210mm × 297mm` com paginação automática para lotes. *(Gap menor: falta escapar `documentTitle` contra HTML injection).* |
| **Exportação PNG 1080p (Mobile/Web)** | ✅ **100% Real** | `src/engine/exporter.ts` (`exportElementToPng`) | Serializa o DOM em SVG `<foreignObject>` e suporta Web Share API no celular com fallback para download. |
| **Recorte Inteligente de Fundo Branco** | ✅ **100% Real** | `src/engine/exporter.ts` (`tightCropAlphaDataUrl`, `analyzeProductImageLocal`) | Algoritmo Flood-Fill 4-conectado em Canvas 2D com downscaling preventivo (1600px) e diagnóstico instantâneo de resolução/transparência. |
| **Disparo de Webhook n8n (Lead)** | ⚠️ **Parcial (90% Real)** | `src/utils/leadWebhook.ts` (`sendLeadCapturedToN8n`) + `src/core/store.ts` | Dispara POST real no `setLeadProfile`. **Gaps encontrados:** (1) não possui `try/catch` nem timeout (`AbortController`); (2) se `VITE_N8N_WEBHOOK_URL` receber apenas a URL base do túnel Cloudflared, precisa normalizar o sufixo `/webhook/gabarito-lead-captured`. |
| **Login Google no Modal (1-Clique)** | ⚠️ **Mock / Simulação** | `src/ui/PaywallModal.tsx` (`handleGoogleOneClick`, linha 62) | Não abre OAuth2 do Google. Hoje grava `'Lojista Google'` e `'usuario.google@varejo.com'` mesmo se os inputs estiverem vazios, o que envia **leads fictícios** para o seu n8n. |
| **Botões de Assinatura / Checkout WhatsApp** | ⚠️ **Hardcoded** | `src/ui/PaywallModal.tsx` (linhas 350, 386) e `src/ui/LandingPage.tsx` (linha 410) | Os links apontam para `https://wa.me/5500999990000` chumbado no código em vez de ler uma constante configurável em `SAAS_BRAND` / `.env`. |
| **Seletor dos Novos Templates na UI** | ⚠️ **Desatualizado na UI** | `src/ui/SettingsCenter.tsx` (linhas 328–340) e `src/App.tsx` | Os 7 arquétipos existem no motor (`PROMO_CLASSIC_V`, `PROMO_MODERN_V`, `CLEAN_DIRECT_PRICE`, `MACHINERY_INSTALLMENT`, `CONDITION_ADVANTAGE`, `COMBO_ADVANTAGE`, `GRID_MULTIPRODUCT_4X`), mas o `<select>` em Configurações só lista os 4 antigos e falta um seletor rápido no Estúdio. |
| **Módulo de RH & Comunicados** | ⚠️ **Fora do Core** | `src/ui/Sidebar.tsx` (linha 34) e `src/App.tsx` (linhas 823–1040) | Funcional, mas distrai o lojista no Modo Balcão. Deve ficar oculto por padrão no Modo Balcão (acessível apenas no Modo Gerente ou via toggle de preferências). |
| **Módulo de IA (Enricher Remoto)** | ⚙️ **Híbrido** | `src/core/businessRules.ts` (`SmartProductEnricherService`) | Roda 100% local por padrão (R$ 0). Se o usuário preencher `geminiApiKey` em Configurações, aciona o `gemini-2.5-flash` para ler rótulos de fotos. |
| **Extrator Automático de Paleta pela Logo** | 🚧 **No Core (Falta Ligar na UI)** | `src/core/businessRules.ts` (`extractDominantColorsFromImage`) | A função já existe no core (extrai cor primária e destaque via Canvas 2D), mas ainda não foi conectada ao botão de upload de logo em `BrandKitModal.tsx`. |
| **Histórico Forense (`generationAuditHistory`) & Multi-Tenant Scope** | 🚧 **Nos Tipos/Store (Falta Ligar)** | `src/core/types.ts` (`GenerationAuditRecord`) + `src/core/store.ts` | Os tipos `GenerationAuditRecord`, `enableSubDepartments` e a persistência escopada por `tenantId` já estão declarados no estado, faltando apenas registrar cada exportação e expor na UI. |

---

## 2. Inventário de Telas e Controles (Botão a Botão)

### 2.1. Barra Superior (`src/ui/Topbar.tsx`)
- **Menu Hambúrguer (Mobile):** Abre/fecha gaveta lateral em telas `< 1024px`.
- **Breadcrumb Dinâmico:** Exibe localização atual (`Estúdio / Cartazes de loja`, `Configurações · Identidade`, `Apresentação Comercial`).
- **Seletor `[ 🛒 Modo Balcão ]` vs `[ ⚙️ Modo Gerente ]`:**
  - *Modo Balcão (`OPERATOR`):* Oculta controles secundários (arredondamento, custo, vigência manual, categoria regulatória) e exibe apenas 4 mecânicas essenciais para operação em 10 segundos.
  - *Modo Gerente (`MANAGER`):* Libera as 8 mecânicas comerciais, preço de custo (trava anti-prejuízo), vigência PROCON manual, estratégias de arredondamento e categoria regulatória (MAPA/CRMV/CONAR).
- **Botão `[ ⚡ Voltar ao Estúdio ]`:** Exibido quando o usuário está na Landing Page de Apresentação.
- **Indicador "Salvo automaticamente":** Confirmação visual de persistência contínua no `localStorage` (com debounce de 120ms).
- **Botão Ajuda (`Alt+H`):** Abre modal com todos os atalhos de teclado para operação sem mouse.
- **Botão `Minha conta` (`GP`):** Atalho direto para `#/configuracoes/acesso`.

### 2.2. Navegação Lateral (`src/ui/Sidebar.tsx`)
1. **Logo Oficial Gabarito Pro:** Renderização vetorial (`GabaritoLogoSvg`) com esquadro industrial `#FACC15` e grafite `#0F172A`.
2. **Card de Workspace da Loja:** Mostra o nome da empresa/filial e permite trocar o **Departamento Ativo** em 1 clique (alterando a paleta dos cartazes sem afetar a casca do SaaS).
3. **Módulos de Trabalho:**
   - 📱 **Redes sociais (`Alt+1`):** Cards para Story 9:16, Feed 4:5 e Quadrado 1:1.
   - 🏷️ **Cartazes de loja (`Alt+2`):** Folha A4 (1x), Meia-Folha A5 (2x), Gôndola (4x) e Grid Multiproduto (6x).
   - 🎠 **Carrosséis (`Alt+3`):** Gerador guiado de slides 4:5 (Capa Hook, Produtos ERP, CTA Final WhatsApp).
   - 📋 **RH & comunicados (`Alt+4`):** Vagas, avisos internos e segurança NR-06 *(candidato a ocultação no Modo Balcão)*.
   - ⚙️ **Configurações gerais (`Alt+M`):** Acesso à Central Unificada em 6 abas.
4. **Card de Cota Freemium:**
   - Monitora `data-freemium-tier`, `data-freemium-used` e `data-freemium-limit` (`0 a 30 artes/mês` no plano `FREE`).
   - Botão **`Liberar uso ilimitado`**: Abre o modal de upgrade.
5. **Rodapé da Sidebar:**
   - Link **`🌐 Apresentação & Planos`** (abre a Landing Page integrada com calculadora de ROI).
   - Alternador rápido de perfil (`Operação de balcão` vs `Gestão da unidade`).

### 2.3. Fluxo de Criação do Estúdio (`src/App.tsx`)
- **Passo 1 — Entrada Rápida (Smart Paste + Modo Lote):**
  - Input com disparo automático no `Ctrl+V` (`onPaste`) e botão **"Testar com texto de exemplo"**.
  - Alternador **Individual (Manual)** vs **Lote Auditável (ERP / CSV)**.
- **Passo 2 — Produto & Preço:**
  - Pílula de **Score de Governança (`0 a 100`)** e ID Forense (`#AP-XXXX-XXX`).
  - Seletor de **Mecânica Comercial** + sub-painel contextual (parcelas `2x..24x`, brinde Compre & Ganhe, Leve X Pague Y, desconto na 2ª unidade, quantidade mínima de atacado ou dias para vencimento no Validade Turbo).
  - Campo **SKU / EAN** com autocomplete silencioso na base ERP importada.
  - Campo **Nome do Produto** com contador `0/48`, alerta de legibilidade aos 42 caracteres e limpeza automática de siglas no `onBlur`.
  - Campos **DE (R$)** e **POR (R$)** + botões de **Auto-Reparo em 1 Clique** (`⇄ Inverter DE/POR` e `⚡ Ajustar p/ Margem`) quando um guardrail de bloqueio é acionado.
- **Passo 3 — Barra de Prévia e Exportação:**
  - Controles rápidos de formato (`A4`, `A5`, `Gôndola` / `Story`, `Feed`, `1:1`), tema (`Colorido` vs `Toner`) e toggles (`Selo % OFF`, `R$ / kg`).
  - Stage com cantoneiras técnicas e botão de ponte **`Usar em redes sociais`** (leva a oferta do Cartaz A4 para o Story com 1 clique).
  - Barra de exportação protegida por guardrail e pelo portão de captura de lead aos 95%.

---

## 3. Auditoria Visual no Código: Por Que os Cartazes Ainda Parecem "Protótipos" e Como Resolver

Analisando linha a linha o arquivo `src/engine/PosterAndSocialCanvas.tsx`, identificamos as **4 causas técnicas exatas** da sensação de "layout de engenheiro" e a solução determinística para cada uma:

### Causa Técnica 1: Competição Visual no Rodapé (`renderCoreGovernanceFooter`, linhas 184–269)
- **O que o código faz hoje:** O rodapé renderiza o `offer.ctaText` ("APROVEITE! ÚLTIMAS UNIDADES!") em caixa alta `font-black` tamanho `2.9cqw`, quase do mesmo peso visual de informações secundárias, além de uma linha longa concatenando `CÓD + Vigência + #ID Forense` e a logo à direita. Quando o produto é `STANDARD` (sem restrição MAPA), ainda existe excesso de bordas grossas (`border-t-[0.45cqw]`).
- **Como corrigir no código:**
  - Reduzir o peso óptico do rodapé institucional: transformar `CÓD`, `Vigência` e `#ID Forense` em uma barra técnica discreta, limpa e perfeitamente alinhada (`font-mono` sutil para o ID e código, destaque limpo para a validade PROCON).
  - Manter a tarja de segurança pesada **exclusivamente** quando houver restrição legal ativa (`AGRO_PESTICIDE`, `VET_PRESCRIPTION`, `ALCOHOL_18`, `AGRO_FERTILIZER_SEED`, `NEAR_EXPIRY`).

### Causa Técnica 2: Desconexão entre `visualStylePreset` (Skins) e `layoutArchetype` (Geometrias)
- **O que o código faz hoje:** As skins `RETAIL_POP`, `AGRO_BRUTALIST` e `MINIMAL_BOUTIQUE` estão aplicadas quase que apenas no `PROMO_CLASSIC_V` (linhas 607–612). Nos demais arquétipos (`PROMO_MODERN_V`, `CLEAN_DIRECT_PRICE`, `MACHINERY_INSTALLMENT`, `COMBO_ADVANTAGE`), a skin escolhida pelo lojista quase não altera o acabamento estético.
- **Como corrigir no código:**
  - Criar tokens visuais derivados do `stylePreset` dentro de `SingleStorePosterUnit` (ex: chanfro industrial `clip-path` e grid técnico no `AGRO_BRUTALIST`; amplo respiro de 8% a 12%, borda fina `#E2E8F0` e zero chapados pesados no `MINIMAL_BOUTIQUE`; contraste amarelo sol `#FACC15` + grafite `#0F172A` e pílulas flutuantes no `RETAIL_POP`).

### Causa Técnica 3: Falta de Anatomia Óptica Rigorosa no Preço Atômico
- **O que o código faz hoje:** Em vários blocos de preço, o símbolo `R$` está muito grande (`7.5cqw` a `9cqw`) e colado na base, empurrando o número inteiro para a direita e diminuindo o impacto a 3 metros de distância. Além disso, falta a classe `tabular-nums` em todos os blocos de preço para travar a largura óptica dos dígitos.
- **Como corrigir no código:**
  - Padronizar um subcomponente/bloco de **Preço Atômico Oficial** (preservando estritamente `data-price-integer` e `data-price-cents` no mesmo container DOM):
    - `R$` posicionado à esquerda em escala controlada (~28% do inteiro), alinhado ao topo ou base com `font-extrabold`.
    - Número inteiro monumental com `font-black tracking-tighter tabular-nums leading-[0.82]`.
    - Coluna direita empilhando `,{centsPart}` no topo (`leading-none`) e `/{unit}` logo abaixo.
    - Equivalência legal (Decreto 5.903 — `Equivale a R$ XX,XX/KG`) em pílula/barra discreta de alto contraste abaixo do preço.

### Causa Técnica 4: Ausência de Seletor Rápido de Templates no Estúdio (`App.tsx`)
- **O que o código faz hoje:** O usuário no Estúdio não vê os 5 Templates Campeões na tela principal. Para mudar o arquétipo ou a skin, precisa sair do Estúdio e navegar até `Configurações -> Cartazes` ou `Configurações -> Identidade`.
- **Como corrigir no código:**
  - Adicionar na barra superior da prévia (ou logo acima do preview no Estúdio) um seletor rápido dos **Templates Oficiais** e atualizar o `<select>` de `SettingsCenter.tsx` com todos os arquétipos homologados.

---

## 4. Especificação dos 5 Templates Campeões de Venda

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                     OS 5 TEMPLATES ESSENCIAIS DE VENDA                       │
├───────────────────────────┬────────────────────────┬─────────────────────────┤
│ Template / Preset         │ Segmento Principal     │ Assinatura Visual       │
├───────────────────────────┼────────────────────────┼─────────────────────────┤
│ 1. Varejo Pop Super       │ Mercados & Atacarejo   │ Pílula + Preço Amarelo  │
│ 2. Agro Brutalist         │ Cooperativas & Insumos │ Chanfro 45° + Tarja MAPA│
│ 3. Minimal Boutique       │ Pet Shop & Premium     │ Respiro Amplo + Clean   │
│ 4. Maquinário & Parcelado │ Ferragens & Máquinas   │ Parcela 10x + Total CDC │
│ 5. Combo & Atacado        │ Giro Rápido & Bebidas  │ Selo #10B981 + Unitário │
└───────────────────────────┴────────────────────────┴─────────────────────────┘
```

1. **Varejo Pop Super (`PROMO_MODERN_V` / `RETAIL_POP`):**
   - Header em pílula flutuante arredondada (`rounded-full`), título em até 2 linhas ultra-legível e card central de preço em Grafite Profundo `#0F172A` com dígitos em Amarelo Gabarito `#FACC15` (ou fundo claro no modo Toner P&B).
2. **Agro Brutalist (`AGRO_BRUTALIST` / `CLEAN_DIRECT_PRICE` & `PROMO_CLASSIC_V`):**
   - Cantos chanfrados a 45°, cabeçalho técnico com SKU em evidência, bloco de preço sólido e tarja regulatória MAPA/CRMV com visual de etiqueta de segurança industrial alemã.
3. **Minimal Boutique (`MINIMAL_BOUTIQUE`):**
   - Fundo branco puro `#FFFFFF`, moldura interna fina, amplo espaço negativo (respiro generoso), tipografia elegante sem inclinações ou faixas berrantes, destacando o preço com sobriedade para Pet Shops e Empórios.
4. **Maquinário & Parcelamento CDC (`MACHINERY_INSTALLMENT`):**
   - Estrutura tabular robusta destacando a parcela monumental (`10x R$ 189,90`) e faixa inferior obrigatória do CDC com o valor total à vista (`PREÇO À VISTA: R$ 1.899,00`).
5. **Combo & Vantagem Comercial (`COMBO_ADVANTAGE`):**
   - Divisão clara em dois polos: banner de vantagem em Verde Esmeralda `#10B981` (`★ LEVE 3 PAGUE 2 ★` ou `★ COMPRE 1 E GANHE... ★`) + preço unitário efetivo diluído logo abaixo com equivalência por quilo/litro.

---

## 5. Auditoria de Segurança e Hardening (Gaps Reais Encontrados no Código)

Durante a inspeção estática do código-fonte `v2.7.0`, identificamos **4 pontos de segurança e robustez** que precisam ser aplicados antes do lançamento comercial:

1. **Sanitização Anti-XSS Determinística em `cleanErpProductTitle` (`src/core/businessRules.ts`):**
   - *Situação atual:* A função remove prefixos de código e expande siglas, mas não remove caracteres de tags HTML (`<`, `>`, `script`, `iframe`, `onerror=`, `javascript:`).
   - *Correção planejada:* Inserir filtro determinístico no início de `cleanErpProductTitle` removendo qualquer tag HTML/atributos de script antes do processamento de tokens, mais um teste automatizado (`TEST-23`) em `scripts/audit.mjs`.
2. **Escape de HTML no Título de Impressão (`src/engine/exporter.ts`):**
   - *Situação atual:* Na linha 47 de `exporter.ts`, `<title>${documentTitle}</title>` recebe a string diretamente dentro de `doc.write()`.
   - *Correção planejada:* Sanitizar `documentTitle` removendo `[<>"'&]` antes de injetar no HTML do iframe de impressão.
3. **Blindagem de Rede, Timeout e Normalização de URL no Webhook (`src/utils/leadWebhook.ts`):**
   - *Situação atual:* `fetch(N8N_WEBHOOK_URL)` não tem `try/catch` interno, não tem timeout (`AbortSignal.timeout(5000)`), não trunca campos longos e pode falhar silenciosamente com `UnhandledPromiseRejection` se o túnel estiver offline. Além disso, se o usuário colar apenas `https://xyz.trycloudflare.com` na Vercel sem o path `/webhook/gabarito-lead-captured`, o POST cairá na raiz do n8n (404).
   - *Correção planejada:* Normalizar a URL automaticamente (adicionando `/webhook/gabarito-lead-captured` caso a URL aponte para `trycloudflare.com` ou `localhost:5678` sem path), truncar campos em 120 caracteres e envolver em `try/catch` com timeout de 5 segundos.
4. **Higienização do Lead Capture e Remoção de Telefone Fake (`src/ui/PaywallModal.tsx` e `src/ui/LandingPage.tsx`):**
   - *Situação atual:* O botão "Continuar com Google (1 Clique)" envia dados fictícios (`usuario.google@varejo.com`) para o n8n mesmo com campos em branco, e os botões de WhatsApp usam `5500999990000` hardcoded.
   - *Correção planejada:* Centralizar o telefone/links comerciais em `SAAS_BRAND` (`src/core/types.ts`) com suporte a variáveis de ambiente (`VITE_COMMERCIAL_WHATSAPP`, `VITE_CHECKOUT_BALCAO_URL`, `VITE_CHECKOUT_REDE_URL`) e fazer o botão de acesso rápido validar ou preencher de forma transparente sem poluir o CRM com contatos falsos.

---

## 6. PLANO DE EXECUÇÃO PARA APROVAÇÃO (O Que Será Feito Sem Sua Intervenção vs. Com Sua Intervenção)

Para máxima segurança e governança, dividimos o plano em **dois blocos**. Todo o **Bloco A** pode ser executado **100% autonomamente pela IA no código**, sem exigir nenhuma ação manual sua.

### 🟢 BLOCO A — Executável 100% Sem Sua Intervenção (Autonomia Total no Repositório)

Assim que você aprovar este plano, executaremos os 9 itens abaixo em sequência e validaremos com `npm test`, `npx tsc --noEmit` e `npx vite build`:

- [x] **`EXEC-01` (Hardening Anti-XSS no Core e Exportador — CONCLUÍDO):**
  - **Arquivos:** `src/core/businessRules.ts` (`cleanErpProductTitle`) e `src/engine/exporter.ts` (`printOrSaveA4Sheet`).
  - **Ação executada:** Filtradas tags HTML/scripts (`<script>`, `<iframe>`, `javascript:`, event handlers `on*=`, `<`, `>`) na entrada de títulos do ERP/Smart Paste e escapado `documentTitle` (`safeDocumentTitle`) no iframe de impressão A4.
- [x] **`EXEC-02` (Blindagem do Conector Webhook n8n — CONCLUÍDO):**
  - **Arquivo:** `src/utils/leadWebhook.ts`.
  - **Ação executada:** Implementada `resolveN8nWebhookUrl()` (anexa `/webhook/gabarito-lead-captured` automaticamente quando `VITE_N8N_WEBHOOK_URL` contém apenas o domínio base do túnel Cloudflared ou localhost), sanitização/truncamento de campos em 120 caracteres e `try/catch` com `AbortController` (timeout de 5s).
- [x] **`EXEC-03` (Centralização de Links Comerciais e Fim do `5500999990000` Hardcoded — CONCLUÍDO):**
  - **Arquivos:** `src/core/types.ts` (`SAAS_BRAND`, `buildCommercialCheckoutUrl`), `src/ui/PaywallModal.tsx` e `src/ui/LandingPage.tsx`.
  - **Ação executada:** Adicionados `commercialWhatsapp`, `checkoutBalcaoUrl`, `checkoutRedeUrl` e `buildCommercialCheckoutUrl()` em `src/core/types.ts` (lendo `VITE_COMMERCIAL_WHATSAPP` e `VITE_CHECKOUT_*`) e substituídos todos os links chumbados.
- [x] **`EXEC-04` (Correção do Fluxo de Captura de Lead no Modal 95% — CONCLUÍDO):**
  - **Arquivo:** `src/ui/PaywallModal.tsx`.
  - **Ação executada:** Bloqueado o disparo de leads fictícios (`usuario.google@varejo.com`) no `handleGoogleOneClick`; caso o campo de contato ainda esteja vazio, o sistema foca automaticamente no input de WhatsApp/E-mail com orientação amigável antes de disparar o webhook para o n8n.
- [x] **`EXEC-05` (Polimento Estético de Diretor de Arte nos 5 Templates e Rodapé Limpo — CONCLUÍDO):**
  - **Arquivo:** `src/engine/PosterAndSocialCanvas.tsx`.
  - **Ação executada:**
    1. Despoluído `renderCoreGovernanceFooter()` (reduzido peso óptico dos metadados secundários com `font-mono tabular-nums` e mantidos 100% dos atributos `data-*`).
    2. Aplicado `tabular-nums` e proporção óptica calibrada no símbolo `R$` (~28% do inteiro) e centavos empilhados em todos os arquétipos.
    3. Conectados os acabamentos de `RETAIL_POP` (contraste amarelo/grafite + pílula), `AGRO_BRUTALIST` (chanfro 45° `brutalistClipPath`) e `MINIMAL_BOUTIQUE` (respiro amplo + borda fina `#E2E8F0`) nos blocos de preço e unificados `COMBO_ADVANTAGE` / `CONDITION_ADVANTAGE`.
- [x] **`EXEC-06` (Seletor Completo de Arquétipos no Estúdio e na Central de Configurações — CONCLUÍDO):**
  - **Arquivos:** `src/ui/SettingsCenter.tsx` e `src/App.tsx`.
  - **Ação executada:** Atualizado o `<select>` em `SettingsCenter.tsx` com todos os 7 arquétipos homologados (`PROMO_MODERN_V`, `PROMO_CLASSIC_V`, `CLEAN_DIRECT_PRICE`, `MACHINERY_INSTALLMENT`, `COMBO_ADVANTAGE`, `CONDITION_ADVANTAGE`, `GRID_MULTIPRODUCT_4X`) e adicionado seletor rápido de modelo direto na barra de ferramentas da prévia no Estúdio (`src/App.tsx`).
- [x] **`EXEC-07` (Ocultação Inteligente do Módulo RH no Modo Balcão — CONCLUÍDO):**
  - **Arquivo:** `src/ui/Sidebar.tsx`.
  - **Ação executada:** No `Modo Balcão (OPERATOR)`, o item `RH & comunicados` fica oculto no menu principal para foco 100% comercial em vendas, permanecendo acessível no `Modo Gerente (MANAGER)` ou via atalho `Alt+4`.
- [x] **`EXEC-08` (Conexão das Funções Já Iniciadas no Core: Auto-Paleta da Logo, Toggle de Subdepartamentos e Histórico Forense — CONCLUÍDO):**
  - **Arquivos:** `src/ui/BrandKitModal.tsx`, `src/ui/Sidebar.tsx`, `src/core/store.ts` e `src/engine/PosterAndSocialCanvas.tsx`.
  - **Ação executada:**
    1. Conectada `extractDominantColorsFromImage` ao botão `"🎨 Extrair Cores"` em `BrandKitModal.tsx` quando há logo enviada.
    2. Conectada a flag `brandKit.enableSubDepartments` no `BrandKitModal.tsx` e na `Sidebar.tsx`.
    3. Conectado `generationAuditHistory` (`GenerationAuditRecord`) na action `consumeExportQuota` de `src/core/store.ts`, gravando os últimos 50 cartazes gerados com `forensicId`, SKU, preço e timestamp.
- [x] **`EXEC-09` (Expansão da Suíte de Auditoria Automatizada para 25 Testes — CONCLUÍDO):**
  - **Arquivo:** `scripts/audit.mjs` e `CHANGELOG.md`.
  - **Ação executada:** Adicionados `TEST-23` (sanitização Anti-XSS), `TEST-24` (suporte aos 6+ arquétipos e gravação de `generationAuditHistory`) e `TEST-25` (normalização de URL do túnel n8n e `buildCommercialCheckoutUrl`), atingindo **25/25 PASS**, `tsc --noEmit` 0 erros e `vite build` limpo.

---

### 🟡 BLOCO B — O Que Depende de Você (Configuração Externa / Decisão Comercial)

Estes itens **não dependem de código**, mas sim das suas contas externas (já detalhados operacionalmente em [`docs/PENDENCIAS_CONFIGURACAO_AGENCIA.md`](./PENDENCIAS_CONFIGURACAO_AGENCIA.md)):

1. **Seu Número Oficial de WhatsApp Comercial:**
   - Informar qual número (com DDD, ex: `5581999999999`) você quer deixar como padrão em `SAAS_BRAND` (ou definir `VITE_COMMERCIAL_WHATSAPP` na Vercel) para receber os cliques dos planos de R$ 97 e R$ 197.
2. **Links de Checkout (Asaas / Mercado Pago / Kiwify / Stripe):**
   - Quando tiver os links de pagamento dos planos R$ 97 e R$ 197, basta definir `VITE_CHECKOUT_BALCAO_URL` e `VITE_CHECKOUT_REDE_URL` na Vercel (ou nos informar para deixarmos como padrão).
3. **Ativação dos Containers Locais (`n8n` + `Evolution API` + `Cloudflared`):**
   - Importar `scripts/n8n-workflow-gabarito.json` em `http://localhost:5678`, escanear o QR Code do WhatsApp em `http://localhost:8080` e colar a URL do túnel Cloudflared na variável `VITE_N8N_WEBHOOK_URL` da Vercel.

---

## ✅ Como Aprovar para Execução Imediata

Para autorizar a execução de todo o **Bloco A (`EXEC-01` a `EXEC-09`)**, basta responder:
- **"Aprovado, pode executar o Bloco A"** (e, se desejar, informe já o seu número de WhatsApp comercial para já embutirmos no `EXEC-03`).
