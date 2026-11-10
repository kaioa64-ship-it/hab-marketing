# PRODUCT VISION & ROADMAP DEFINITIVO — ALFA PULSO IA (v1.0)

> **FONTE ÚNICA DA VERDADE (SSOT)** para Produto, Arquitetura e Orquestração de Agentes.
> Qualquer agente de IA (Gemini Flash, Claude, OpenCode) que atuar neste repositório DEVE obedecer estritamente às regras, limites de escopo e contratos deste documento.

---

## 1. Visão Executiva e Posicionamento

**O que somos:** Uma plataforma SaaS B2B Multi-Tenant de **Governança Visual, Precificação de 10 Segundos e Compliance Regulatório (MAPA/PROCON/CONAR)** para o varejo físico e redes multifiliais (Agropecuárias, Pet Shops, Supermercados, Material de Construção e Farmácias).

- **A Promessa Central:** O gerente de loja ou operador cola uma mensagem do WhatsApp (ou planilha do ERP) e gera, em menos de 10 segundos, Cartazes de Loja (A4, A5, Gôndola 2x2) e Artes de Redes Sociais (Story 9:16, Feed 4:5, Quadrado 1:1) com acabamento de agência e zero risco de multa ou prejuízo.
- **Nossos 2 Adversários:**
  1. **Anti-Canva:** É estritamente proibido existir edição livre (*drag-and-drop*), caixas de texto soltas ou escolha livre de fontes pelo operador. Se o usuário puder desalinhar um layout, o sistema falhou.
  2. **Anti-Alucinação Visual:** IA nunca desenha layout nem inventa preço. O layout é 100% matemático e determinístico (`CSS Container Queries` + `RenderSpec`). IA entra apenas para *ler* dados brutos (texto/rótulo) com fallback local imediato.

---

## 2. Protocolo de Orquestração de IAs (Papéis no Desenvolvimento)

Para máxima eficiência de custos de API e zero regressão, o desenvolvimento segue esta divisão rígida de trabalho:

1. **Arquiteto & Orquestrador Chefe (Gemini Pro / Chat Principal & API Pontual):**
   - **Quando acionar:** Apenas em mudanças estruturais de arquitetura (`src/core/`), criação de novos motores matemáticos, definição de contratos TypeScript, resolução de impasses complexos e estratégia de negócio.
   - **Proibido gastar saldo com:** Ajustes bobos de CSS, criação de botões simples ou repetição de formulários.
2. **Executor de UI & Produtividade Diária (Gemini 3.8 Flash / IDE Nativa):**
   - **Quando acionar:** Criação de componentes visuais em `src/App.tsx` ou `src/ui/`, modais, conexão de inputs com actions que já existem no `store.ts`, estilização Tailwind e tarefas mecânicas.
   - **Regra de contenção:** Nunca tem permissão para alterar fórmulas matemáticas de `businessRules.ts` ou contratos de `types.ts` sem ordem explícita.
3. **Auditor Independente & QA (Claude / Scripts de Verificação):**
   - **Quando acionar:** Após cada entrega relevante, rodando `npx tsc --noEmit`, `npx vite build`, inspeção de DOM (`scrollHeight === clientHeight`) e testes de mesa em funções críticas antes do commit.

---

## 3. Os 6 Princípios Arquiteturais Inegociáveis

1. **Contrato Único Determinístico (`RenderSpec` em `src/core/resolve.ts`):**
   Nenhum componente React calcula preço, desconto, cor de contraste ou regra jurídica sozinho. Tudo passa por `resolveRenderSpec()`, garantindo WYSIWYG absoluto entre tela e exportação.
2. **Custo Marginal Zero por Padrão (Waterfall Architecture):**
   Limpeza de siglas de ERP, extração de peso/unidade, cálculo de preço diluído por KG/Litro (CDC), arredondamento psicológico, recorte de bordas transparentes (`tightCropAlphaDataUrl`) e exportação PNG/PDF rodam 100% no navegador do cliente a custo R$ 0,00.
3. **Governança como Trava Dura (Anti-Prejuízo e Compliance):**
   - Preço `POR >= DE` ou `POR <= Custo` **bloqueia** a exportação (`canExport = false`).
   - Palavras proibidas pela rede (`bannedWords`) **bloqueiam** a exportação.
   - Categorias restritas (`AGRO_PESTICIDE`, `VET_PRESCRIPTION`, `ALCOHOL_18`) injetam rodapé legal obrigatório e inamovível.
   - Toda peça carrega um ID Forense determinístico (`#AP-XXXX-XXX`) no rodapé.
4. **Proporcionalidade Matemática (`cqw`) e Física de Papel:**
   Todo cartaz e card social usa `container-type: inline-size` e unidades `cqw`, respeitando as reduções de escala para Meia-Folha A5 (`isA5Half`) e a cruzeta única de guilhotina para Gôndola 2x2.
5. **Estado Único entre Físico e Digital:**
   Uma oferta preenchida ou colada via *Smart Paste* serve simultaneamente ao Cartaz A4 e ao Story/Feed com 1 clique, sem redigitação.
6. **White-Label Puro na Raiz (`TenantBrandKit`):**
   Zero referências fixas a marcas específicas no código. Cores (com reparo automático de contraste WCAG 2.1), logos, departamentos e regras vêm de `brandKit`.

---

## 4. O Que Já Está Construído e Consolidado (Baseline v2.0.0 — PRODUTO COMPLETO ENTREGUE)

- [x] Core completo em `src/core/types.ts`, `businessRules.ts`, `resolve.ts` e `store.ts` (com migração segura de `localStorage` `schemaVersion: 4` e portabilidade `.json`).
- [x] **Smart Paste do WhatsApp** blindado contra pesos decimais (`10.1kg`), fórmulas NPK (`10-10-10`), milhares (`1.299,90`), códigos de máquinas (`TRF 400`), parcelamentos (`em 10x sem juros de 189,90`) e brindes (`compre 1 e ganhe...`).
- [x] **Módulo 1 (`STORE_POSTER` — 4 Arquétipos de Cartazes de Loja 100% White-Label):**
  1. `PROMO_CLASSIC_V` (Promoção Clássica De/Por em V + Selo `% OFF`)
  2. `CLEAN_DIRECT_PRICE` (Preço Direto / Etiqueta de Gôndola Quadrada Limpa com economia de toner P&B)
  3. `MACHINERY_INSTALLMENT` (Maquinário / Investimento com destaque monumental na parcela `10x R$ 189,90` e total à vista obrigatório pelo CDC)
  4. `CONDITION_ADVANTAGE` (Destaque na Condição Comercial: `Compre 1 e Ganhe`, `Compre 2 pelo Preço de 1`, `Leve 3 Pague 2`, `Atacado`)
- [x] **Módulo 2 (`SOCIAL_MEDIA` — Story 9:16, Feed 4:5 e Quadrado 1:1):**
  - Guias de Safe Zone, bullets automáticos, Tight Crop Alfa adaptativo, diagnóstico de imagem e compartilhamento nativo via Web Share API.
- [x] **Módulo 3 (`CAROUSEL` — Construtor de Carrossel Guiado 4:5 — `GuidedCarouselCanvas`):**
  - Sequência guiada de alta conversão (`HOOK_COVER` Capa -> `PRODUCT_OR_CONTENT` Ofertas com bloco de preço/condição -> `FINAL_CTA` Chamada WhatsApp) e botão `⚡ Gerar da Base ERP` que monta o carrossel inteiro em 1 clique.
- [x] **Módulo 4 (`HR_NOTICE` — RH, Vagas & Comunicados Internos A4 e Social — `HrAndNoticeCanvas`):**
  - 3 Arquétipos 100% White-Label (`JOB_VACANCY` "Estamos Contratando", `INTERNAL_NOTICE` "Comunicado Oficial" e `SAFETY_COMPLIANCE` "Segurança / EPI NR-06") com saída em Folha A4 ou Card 4:5, código de referência (`CÓD`) e ID Forense (`generateHrForensicId`).
- [x] **Governança White-Label Total & Elementos Core Obrigatórios (`BrandKitModal.tsx`):**
  - Zero cores, fontes ou nomes chumbados em código.
  - 4 Pares Tipográficos Homologados (`INDUSTRIAL_IMPACT`, `AGRO_ROBUST`, `RETAIL_CLASSIC`, `TECH_PRECISION`), 4 Presets de Segmento, Editor de Campanhas Sazonais da Matriz, Chave opcional Gemini Flash Vision e Exportação/Restauração de Backup Completo (`.json`).
- [x] **Hub Universal de Base de Dados & Contrato API Headless (`ErpIntegrationModal.tsx`):**
  - Importação universal de arquivos `.csv`, `.tsv`, `.txt`, `.json` ou colagem direta de **Bling, Tiny, TOTVS Protheus, Sankhya, Siagri, Linx, Omie e Excel** (`normalizeUniversalErpDataset`).
  - Busca instantânea e autocomplete por **Código SKU**, **Código de Barras EAN-13** ou **Nome do Produto**, sincronização via URL/Google Sheets e gerador canônico de payload **API Headless Enterprise (`POST /api/v1/render`)** (`buildHeadlessRenderPayload`).

---

## 5. HISTÓRICO DE SPRINTS CONCLUÍDAS (v1.0 a v2.0.0 — 100% ENTREGUES)

- [x] **Sprint Final 1:** Modal White-Label de Configuração da Marca (`BrandKitModal.tsx`) com Pares Tipográficos e Presets de Segmento.
- [x] **Sprint Final 2:** Polimento Visual dos Templates + Remoção Adaptativa de Fundo Claro + Diagnóstico Instantâneo de Imagem.
- [x] **Sprint Final 3:** Portão Comercial (`PaywallModal.tsx` + Freemium Lock 30 artes/mês + Chave PRO).
- [x] **Sprint Final 4 (`v1.1.0`):** 4 Arquétipos de Cartazes de Loja + Mecânicas de Maquinário Parcelado e Compre & Ganhe.
- [x] **Sprint Final 5 (`v1.2.0`):** Hub Universal de Base de Dados ERP (`ErpIntegrationModal.tsx`) + Autocomplete SKU/EAN-13 + Lote Misto Multi-Arquétipo.
- [x] **Sprint Final 6 (`v2.0.0` — Produto Completo):** Carrossel Guiado (`CAROUSEL`) + Módulo RH/Vagas & Comunicados (`HR_NOTICE`) + Campanhas Sazonais & Backup JSON + Contrato API Headless (`POST /api/v1/render`).

---

## 6. Evolução Contínua Pós-v2.0.0 (Infraestrutura Cloud & Escala Comercial)

- **Backend Cloud Multi-Tenant (Opcional):** Sincronização em nuvem via Supabase/PostgreSQL consumindo o mesmo estado `StudioGlobalState` (`schemaVersion: 4`) já exportável em `.json`.
- **Worker Headless em Nuvem:** Endpoint serverless executando `buildHeadlessRenderPayload` para disparo de filas de impressão remotas via Webhooks de ERPs.

---

## 7. Anti-Escopo (Banido Permanentemente do Estúdio de Operação)
- Editor livre estilo Canva (arrastar caixas, mudar fontes manualmente).
- Simuladores teóricos que poluem a tela do lojista (*Simulador de Corredor com blur*, *Comparador Duelo A/B de 4 telas*, *Playbook teórico*).
- Dois motores de renderização separados que divergem entre si.
