# Relatório de Auditoria Independente de Frontend, UX/UI e Arquitetura Visual
**Projeto:** Studio Varejo & Agro Pro  
**Versão Auditada:** `v2.1.0`  
**Data:** 19 de Outubro de 2026  
**Especialidade:** Engenharia de Frontend Sênior & Especialista em Design Systems / UX de Varejo  
**Premissa Central:** **Zero Atrito e Velocidade Extrema** (preenchimento mínimo → design pré-renderizado automático → impressão e exportação imediatas).

---

## 1. Sumário Executivo

A aplicação possui uma arquitetura base extremamente sólida e moderna:
- **Zero bibliotecas pesadas de terceiros no cliente:** Apenas React 18 e Tailwind CSS, gerando um bundle de produção ultraleve de 354 kB (101 kB gzip).
- **Escala de layout determinística em `cqw`:** Permite que os cartazes e cards sociais redimensionem perfeitamente para qualquer proporção de tela ou resolução de impressão.
- **Impressão vetorial em 300 DPI sem dependências externas:** O módulo `printOrSaveA4Sheet` utiliza um iframe isolado com clonagem de estilos Tailwind, gerando PDFs vetoriais nítidos em menos de 50 milissegundos.
- **Cálculo de cores com WCAG 2.1:** Protege o operador contra impressões ilegíveis em preto e branco e em fundos coloridos.

No entanto, a auditoria identificou **gargalos de usabilidade e atrito cognitivo**, além de **4 pontos de quebra visual no mundo real** que devem ser atacados para cumprir integralmente a premissa de "zero atrito".

---

## 2. Tabela Completa de Diagnóstico Arquitetural e de UX/UI

| Componente / Arquivo | Nota UX/UI (0-10) | Complexidade & Dependências | Veredito | Análise Crítica (Falhas Visuais, Atritos de Uso ou Débito Técnico) |
| :--- | :---: | :--- | :---: | :--- |
| **`src/App.tsx`** (Orquestrador) | **6.5** | **Alta** (2.350 linhas). Concentra estados de 4 módulos, upload, recorte alfa, formulários, atalhos e preview. | **Refatorar** | Monólito com sobrecarga cognitiva. Exige decisões que o motor já calcula sozinho (título de etiqueta, arquétipo de cartaz, 9 botões de vigência/arredondamento). O preview empilha seletores acima do cartaz, gerando rolagem vertical desnecessária. |
| **`SingleStorePosterUnit`** (`src/engine/PosterAndSocialCanvas.tsx`) | **8.5** | **Média/Alta** (~800 linhas). Container Queries (`inline-size` e `cqw`). Sem libs externas. | **Refatorar** | Renderização impecável dos 4 arquétipos, porém estruturada em blocos repetitivos sem componentização interna (`<PosterHeader>`, `<AtomicPrice>`, `<GovernanceFooter>`). |
| **`StorePosterA4Sheet`** (`src/engine/PosterAndSocialCanvas.tsx`) | **9.0** | **Baixa**. Grid CSS nativo para 1x A4, 2x A5 e 4x Gôndola 2x2. | **Manter** | Paginação e linhas de corte com tesoura (`✂`) excelentes. Isolamento de specs por slot via `resolvedBatchEntries`. |
| **`SocialMediaCardCanvas`** (`src/engine/PosterAndSocialCanvas.tsx`) | **8.5** | **Baixa**. CSS puro escalado em `cqw` para 9:16, 4:5 e 1:1. | **Refatorar** | Quando o produto não possui imagem, fica um vazio visual no centro do card. O degradê radial não compensa a ausência de um selo/ícone ilustrativo. |
| **`GuidedCarouselCanvas`** (`src/engine/PosterAndSocialCanvas.tsx`) | **9.0** | **Baixa**. 100% White-Label, barra de progresso em pílulas dinâmicas. | **Manter** | Isolamento completo de produtos por slide via `slideOffer` e geração automática a partir da base ERP. |
| **`HrAndNoticeCanvas`** (`src/engine/PosterAndSocialCanvas.tsx`) | **8.5** | **Baixa**. Suporta A4 e Feed 4:5 com cores institucionais. | **Manter** | Atende avisos de segurança NR-06, vagas de emprego e comunicados da rede sem atrito de design. |
| **`resolveThemePalette`** (`src/engine/PosterAndSocialCanvas.tsx`) | **9.5** | **Mínima**. Matemática de luminância WCAG 2.1. | **Manter** | Garante legibilidade em modo Toner P&B (`#000000` / `#FFFFFF`) e temas coloridos, impedindo texto claro sobre fundo claro. |
| **`printOrSaveA4Sheet`** (`src/engine/exporter.ts`) | **9.5** | **Zero dependências**. Iframe isolado + clonagem de estilos `@media print`. | **Manter** | Disparo em < 50ms com resolução vetorial nativa de 300 DPI, dispensando `jsPDF` ou `pdfmake`. |
| **`exportElementToPng`** (`src/engine/exporter.ts`) | **7.0** | **Média**. SVG `<foreignObject>` + Canvas 2D + Web Share API. | **Refatorar** | O navegador isola o SVG rasterizado em `<foreignObject>` dentro de `new Image()`, bloqueando fontes Google Fonts externas em celulares e navegadores com sandbox restrito, revertendo para fontes de sistema (Arial/Times). |
| **`tightCropAlphaDataUrl` & `analyzeProductImageLocal`** (`src/engine/exporter.ts`) | **9.0** | **Baixa**. Flood-Fill 4-conectado nativo no Canvas em milissegundos. | **Manter** | Remove fundos brancos/claros no cliente sem APIs pagas de IA, com downscaling preventivo para fotos > 1600px. |
| **`BrandKitModal.tsx`** (`src/ui/`) | **8.5** | **Baixa**. Modal White-Label puro com validação de contraste e exportação JSON. | **Manter** | Configuração da loja em 60s sem poluir a tela principal. |
| **`ErpIntegrationModal.tsx`** (`src/ui/`) | **8.0** | **Baixa**. Suporte a CSV, JSON e contrato Headless. | **Refatorar** | O painel da API Headless confunde o operador comum da loja. Deve ser recolhido em uma aba "Avançado/TI". |
| **`PaywallModal.tsx`** (`src/ui/`) | **9.0** | **Baixa**. Portão de ativação e aviso de cota mensal. | **Manter** | Não interfere na exploração e ativa licenças com clareza. |
| **`src/core/resolve.ts`** | **9.5** | **Zero dependências**. Computação pura de tokens tipográficos e escala `cqw`. | **Manter** | Converte atributos da oferta em classes tipográficas determinísticas. |
| **`package.json`** | **8.5** | **Mínima**. Apenas React 18 e Tailwind CSS no cliente. | **Refatorar** | O pacote `puppeteer-core` deve ser isolado como script de teste E2E e removido do manifesto principal caso não seja usado. |

---

## 3. Teste de Estresse Visual (Edge Cases do Mundo Real)

### Falha Visual 1: Preços de 5 Dígitos em Gôndola 2x2 (ex: R$ 18.990,00)
- **Causa:** `resolveRenderSpec` agrupa `intDigits >= 4` em `18.5cqw`. Para valores de 5 dígitos (R$ 18.990), o conjunto de números inteiros + vírgula + centavos + unidade de medida ultrapassa a largura máxima do box de preço.
- **Efeito Visual:** Centavos e unidade quebram linha e descem, estragando o alinhamento baseline.
- **Correção:** Adicionar degrau para `intDigits >= 5` com fontes calibradas (`15cqw` na Gôndola e `17cqw` no A5).

### Falha Visual 2: Título Longo Técnico + Advertência Regulatória MAPA Longa
- **Causa:** Um defensivo agrícola com título longo (ex: `INSETICIDA CIPERMETRINA 250ML`) em lote próximo ao vencimento ativa o rodapé combinado (Lei Federal 14.785/2023 + Receituário + Diretrizes PROCON), totalizando mais de 300 caracteres no rodapé.
- **Efeito Visual:** Em meia-folha A5 (`isA5Half`), a altura combinada pode pressionar a margem inferior do cartaz, cortando o ID Forense no momento da guilhotina.
- **Correção:** Quando `isHighRiskRegulated` for ativo e `isCompact` for verdadeiro, o padding vertical do bloco de preço deve reduzir de `py-[2cqw]` para `py-[1cqw]`.

### Falha Visual 3: Card Social Sem Foto Cadastrada
- **Causa:** Nem todo produto do ERP possui fotografia cadastrada. No `SocialMediaCardCanvas`, `!offer.imageUrl` resulta em `null`.
- **Efeito Visual:** Fica um buraco cinza/radial vazio no meio do card, enfraquecendo a estética do post no Instagram.
- **Correção:** Injetar um Badge Tipográfico Monumental de Departamento (ex: selo estilizado com a inicial e nome do departamento) para ocupar o centro com equilíbrio de design.

### Falha Visual 4: Preservação de Tipografia no PNG via SVG `<foreignObject>`
- **Causa:** O método `exportElementToPng` serializa o DOM em SVG e desenha no Canvas 2D via `Image()`. Motores Blink e WebKit isolam a imagem e não baixam fontes remotas do Google Fonts dentro de um elemento SVG.
- **Efeito Visual:** No preview a arte exibe `Montserrat` ou `Oswald`, mas no PNG baixado a fonte vira a fonte padrão do sistema (Arial/Times).
- **Correção:** Injetar os `@font-face` diretamente na tag `<style>` do SVG serializado.

---

## 4. Matriz de Redução de Fricção (De 14 para 3 Passos)

Para transformar o Studio Varejo Pro na ferramenta mais rápida do mercado para o operador de caixa e balcão:

```
[ FLUXO ATUAL: 14 PASSOS ]
1. Colar texto no Smart Paste
2. Alternar entre Individual e Lote
3. Escolher Título da Etiqueta no dropdown
4. Clicar na Mecânica Promocional (8 botões)
5. Digitar ou buscar Código SKU
6. Clicar no botão "Limpar Siglas"
7. Ajustar Título do Produto
8. Ajustar Subtítulo
9. Escolher Arredondamento (4 botões)
10. Escolher Vigência (5 botões)
11. Escolher Arquétipo no Preview (4 botões)
12. Escolher Cor no Preview (3 botões)
13. Escolher Formato da Folha (3 botões)
14. Clicar no Botão de Impressão

[ PROPOSTA ZERO ATRITO: 3 PASSOS ]
1. Digitar Código SKU ou Colar WhatsApp (Smart Paste)
       ↓
2. O Motor Resolve Automaticamente:
   - Sanitização de siglas e ortografia (onBlur)
   - Arquétipo ideal (Preço / Parcela / Condição / De-Por)
   - Arredondamento e vigência padrão da loja
   - Alertas regulatórios MAPA e PROCON
       ↓
3. 1 Clique: IMPRIMIR (Ctrl+P) ou BAIXAR PNG (Enter)
```

---

## 5. Plano de Ação Priorizado

1. **P0: Injeção de Fontes no Exportador PNG (`src/engine/exporter.ts`)**
   - Garantir que o PNG gerado carregue as fontes oficiais dos presets White-Label.
2. **P1: Escala para 5 Dígitos e Compressão de Rodapé Denso (`src/core/resolve.ts` e `PosterAndSocialCanvas.tsx`)**
   - Evitar quebras de linha em preços de maquinários e sobreposições em A5.
3. **P2: Eliminação de Controles Redundantes em `src/App.tsx`**
   - Automatizar a limpeza de siglas no `onBlur` e sincronizar o layout exclusivamente via `resolveRecommendedArchetype`.
4. **P3: Fallback Gráfico para Cards Sociais Sem Imagem (`SocialMediaCardCanvas`)**
   - Criar badge gráfico monumental ocupando o terço central quando não houver foto.
5. **P4: Modularização Interna de `SingleStorePosterUnit`**
   - Decompor o componente em `<PosterHeader>`, `<AtomicPrice>` e `<CoreGovernanceFooter>`.
