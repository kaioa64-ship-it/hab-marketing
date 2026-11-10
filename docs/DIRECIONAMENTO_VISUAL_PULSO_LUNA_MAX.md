# GUIA DEFINITIVO DE DIRECIONAMENTO VISUAL E LAYOUT
## Da Interface Genérica/Claude para a Estética Editorial "Pulso" (Luna Max · 1º Colocado)

> **Documento Estratégico de Produto e UI Architecture**  
> **Objetivo:** Repaginar a aplicação principal mantendo 100% das funções de negócio (Smart Paste, 4 Arquétipos de Cartaz, Social Media, Carrossel, RH, BrandKit e ERP Hub), eliminando o visual escuro/genérico de IA e aplicando a elegância limpa, corporativa e determinística do modelo **Pulso (Luna Max)**.

---

## 1. Diagnóstico: Por que o modelo Pulso (Luna Max) venceu?

| Aspecto | Interface Atual (Estilo "Claude/Dark AI") | Nova Interface Pulso (Luna Max 1º Colocado) |
| :--- | :--- | :--- |
| **Atmosfera & Fundo** | Fundo ardósia/chumbo escuro (`#0f172a`, `#020617`), visual de prompt de desenvolvedor ou console técnico. | Fundo claro em papel editorial (`#F4F5F0` canvas / `#FFFFFF` surface), transmitindo **higiene de varejo e procedência agrícola**. |
| **Percepção pelo Lojista** | Parece uma "ferramenta de IA experimental" que requer conhecimento técnico. | Parece um **software corporativo homologado da rede**, transmitindo governança, autoridade e segurança. |
| **Linhas & Divisórias** | Bordas azuis/cinza escuro com sombras pesadas e glow artificial. | Linhas finas, precisas e sutis (`#E8EBE3`), sem ruído visual. |
| **Paleta Cromática** | Gradientes roxo/azul padrão de LLM genérico. | **Verde-floresta botânico (`#245D3E` / `#173A29`)** no Agro e **Terracota/Laranja fresco (`#C86837`)** no Varejo Urbano, com acentos limão/âmbar pontuais. |
| **Grid do Estúdio** | Múltiplos painéis sanfonados e botões empilhados verticalmente. | **Grid Bi-Partida Elegante:** Formulário de configuração no lado esquerdo (com numeração de passos) e Canvas de visualização à direita. |
| **Acabamento do Cartaz** | Bordas soltas na tela sem referência de papel real. | **Frame com cantoneiras de guilhotina**, proporções matemáticas reais (9:16, 1:1, A4, A5) e textura física de papel. |

---

## 2. A Anatomia do Layout Pulso (Estrutura Espacial)

A estrutura visual do Luna Max é composta por 3 eixos fundamentais:

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [TOPBAR SUPERIOR (65px)]  Workspace / Estúdio de Campanhas   ● Sistema Operacional  [Ajuda] [Avatar]   │
├─────────────────┬─────────────────────────────────────────────────────────────────────────────────────┤
│                 │ [HERO COMPACTO] Da matriz à ponta. Sem perder a marca. [Pronto em 3s]               │
│                 ├─────────────────────────────────────────────────────────────────────────────────────┤
│  SIDEBAR FIXA   │ [SWITCHER DE SEGMENTO/MÓDULO]  Agro & Revendas  |  Varejo Urbano                    │
│    (252px)      ├──────────────────────────────────────────┬──────────────────────────────────────────┤
│                 │                                          │                                          │
│ • Logo Pulso.   │  COLUNA 01: FORMULÁRIO (Configuração)    │  COLUNA 02: STAGE DE PRÉVIA              │
│ • Workspace     │  ┌────────────────────────────────────┐  │  ┌────────────────────────────────────┐  │
│   MB/AV         │  │ 01 O que vamos divulgar?           │  │  │ [Stories | Feed | A4 | A5]         │  │
│ • Menu Naveg.   │  │ • Unidade / Filial                 │  │  │ [Modo Econômico de Impressão]      │  │
│ • Cota Freemium │  │ • Smart Paste / Busca SKU          │  │  │ ┌────────────────────────────────┐ │  │
│ • Gov. Matriz   │  │ • Nome do Produto & Apresentação   │  │  │ │ ┌                            ┐ │ │  │
│ • Central Ajuda │  │ • Upload / Câmera de Foto          │  │  │ │ │                            │ │ │  │
│ • Perfil Lojista│  │ • Mecânica (R$ | De/Por | + | !)   │  │  │ │ │  FRAME COM CANTONEIRAS     │ │ │  │
│                 │  │ • Preços (DE / POR / Parcelas)     │  │  │ │ │  E PROPORÇÃO REAL (cqw)    │ │ │  │
│                 │  │ • Card de Compliance (MAPA/CDC)    │  │  │ │ │                            │ │ │  │
│                 │  │ [⚡ Gerar Prévia da Campanha]       │  │  │ │ └                            ┘ │ │  │
│                 │  └────────────────────────────────────┘  │  │ └────────────────────────────────┘ │  │
│                 │                                          │  │ [Compartilhar] [Imprimir] [Export] │  │
│                 │                                          │  └────────────────────────────────────┘  │
└─────────────────┴──────────────────────────────────────────┴──────────────────────────────────────────┘
```

---

## 3. Guia de Mapeamento: Suas Funções Atuais na Nova Roupa Visual

Nenhuma linha de lógica do seu core (`businessRules.ts`, `resolve.ts`, `types.ts`, `store.ts`) precisa ser jogada fora. Veja exatamente onde cada função atual se acomoda:

### 3.1. Sidebar Fixa da Aplicação (252px)
- **Topo:** Wordmark `pulso.` com ponto verde lima `#79A948` + subtítulo `GOVERNANÇA COMERCIAL` (tracking 1.18px, font-size 7px).
- **Card de Filial:** Mostra a bandeira ativa (`Mercado do Bairro` ou `AgroVale Rede`), status e número de lojas.
- **Navegação de Alta Hierarquia:**
  - `Visão Geral` (Dashboard / Métricas de uso da rede).
  - `Estúdio de Campanhas` (A tela principal do operador).
  - `Marca & Guardrails` (Abre o modal institucional do `BrandKit`).
  - `Base de Dados ERP` (Abre o `ErpIntegrationModal` para subir CSV/Planilha).
- **Rodapé da Sidebar:**
  - Barra de progresso da cota freemium (ex: `18/30 artes restantes`) ou badge corporativo *"Marca sob controle"*.
  - Gatilho da Central de Suporte e perfil com avatar (CR / LM) e cargo ("Proprietário da Filial" / "Marketing da Matriz").

### 3.2. Topbar de Utilidades (65px)
- **Breadcrumb Limpo:** `Workspace / Estúdio de Campanhas`.
- **Status Operacional:** Ponto verde pulsante `● Sistema operacional` com micro-glow.
- **Ações Rápidas:** Botão circular de ajuda rápida e avatar do usuário.

### 3.3. Cabeçalho Editorial Hero
- Substitui cabeçalhos técnicos escuros por um manifesto de produto elegante:
  - Eyebrow: `A AGÊNCIA DE BOLSO DA SUA REDE`
  - Título H1: `Da matriz à ponta. / Sem perder a marca.` (com itálico sutil no complemento).
  - Badge flutuante `intro-note`: Bloco em verde profundo (`#1D3B2A`) com o selo *"Pronto em 3 segundos · Marca, formato e rodapé legal já no lugar"*.

### 3.4. Seletor de Módulos (O Antigo Tab Switcher)
- Transformado em **Pills Duplas em Grid**:
  - Cada aba tem ícone geométrico em badge própria (ex: `⌁` para Agro, `✳` para Urbano), título forte e microtexto de contexto (`5–50 filiais · compliance MAPA` ou `Feirinha · açougue · mercadinho`).
  - Check redondo de seleção ativo à direita.

### 3.5. O Formulário Inteligente (Passo 01 — Painel Esquerdo)
- **Badge do Passo:** Quadrado arredondado com número `01` em verde suave (`#EDF3E9`) e texto `CONFIGURE SUA CAMPANHA`.
- **Integração do Smart Paste:**
  - Campo no topo: *"Cole do WhatsApp ou busque por SKU/EAN"*, permitindo o autopreenchimento imediato mantendo o parsing de 10 segundos.
- **Inputs Compactos de Alta Densidade (35px de altura):**
  - Labels em caixa alta com micro-tracking (`#899185`, 8px).
  - Campos em fundo branco puro `#FDFEFC`, borda cinza-seda `#E7EAE4` e foco com halo botânico `rgba(107, 151, 82, 0.1)`.
- **Seleção de Mecânicas Comerciais (Pills Rápidas em 4 Colunas):**
  - Quatro botões quadrados:
    1. `R$` — Preço do dia
    2. `↓` — De / por
    3. `+` — Leve mais (combo progressivo)
    4. `!` — Queima de estoque (com campo de data de validade)
  - Quando selecionado, altera a cor para verde botânico suave com sombra interna.
- **Card Inline de Compliance Regulatório:**
  - Substitui alertas vermelhos gritantes por um card sóbrio:
    - Se houver trava MAPA: Fundo bege champanhe (`#FBFAF2`), ícone de escudo âmbar e aviso *"Guardrails ativos · publicação pendente da validação do RT"*.
    - Se estiver tudo em conformidade: Fundo menta suave (`#F5FAF5`), ícone de check e texto *"Rodapé fixo da matriz aplicado"*.
- **Botão Principal de Ação:**
  - Botão largo com cantos de 8px em verde escuro corporativo (`#23583A`), ícone de faísca, micro-spinner animado e indicador lateral de tempo `~ 3s`.

### 3.6. O Stage de Prévia e Exportação (Painel Direito)
- **Seletor de Formato em 4 Abas:**
  - `Stories (9:16)`, `Feed (1:1)`, `Cartaz A4 (A4)` e `Gôndola A5 (A5)`.
- **Interruptor de Modo Econômico (Toner Saver):**
  - Switch discreto de 33px de largura que zera fundos pretos chapados, mantendo 100% da legibilidade e do rodapé legal para impressão em impressoras jato de tinta ou laser de escritório.
- **O Quadro Criativo (Creative Frame):**
  - Envolvido em fundo canvas neutro pontilhado (`.stage-dots`).
  - **Cantoneiras de Guilhotina nos 4 Cantos:** Bordas em L de 12px que remetem a um ateliê gráfico profissional.
  - Sombra difusa profunda (`0 16px 34px rgba(41, 51, 38, 0.2)`).
- **Barra de Ações da Prévia:**
  - Indicador de sincronização: `● Prévia sincronizada com a oferta`.
  - Botões de ação rápida: Compartilhar (Web Share API), Imprimir direto (`window.print`) e botão de destaque `Exportar peça →`.

---

## 4. Tokens de Design Oficiais do Pulso (Guia Copiar & Colar)

### 4.1. Cores de Sistema (CSS Variables)

```css
:root {
  /* Bases e Fundos Neutros */
  --canvas: #f4f5f0;       /* O fundo cinza-papel suave da aplicação */
  --paper: #ffffff;        /* Cards, superfícies de edição e inputs */
  --line: #e8ebe3;         /* Linhas divisórias ultrafinas */
  --ink: #20291f;          /* Texto principal escuro (grafite natural) */
  --muted: #747d72;        /* Legendas, placeholders e rótulos auxiliares */

  /* Módulo Agro & Revendas */
  --agro-brand: #245d3e;   /* Verde floresta corporativo */
  --agro-dark: #173a29;    /* Verde escuro profundo */
  --agro-tint: #edf4e9;    /* Menta claríssimo para badges e fundos ativos */
  --agro-lime: #d7f36b;    /* Limão vibrante para kickers e pontos focais */

  /* Módulo Varejo Urbano */
  --urban-brand: #c86837;  /* Terracota elegante */
  --urban-dark: #4c2920;   /* Marrom quente profundo */
  --urban-tint: #fff2e6;   /* Pêssego claríssimo para badges */
  --urban-amber: #ffd377;  /* Dourado para destaques promocionais */

  /* Tipografia do Sistema */
  --font-ui: "Aptos", "Segoe UI", -apple-system, BlinkMacSystemFont, "Inter", sans-serif;
  --font-mono: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
}
```

### 4.2. Escala Tipográfica e Ritmo

| Elemento | Font Size | Font Weight | Letter Spacing | Cor |
| :--- | :--- | :--- | :--- | :--- |
| **H1 Hero Principal** | `clamp(35px, 4vw, 55px)` | `640` | `-2.6px` | `--ink` |
| **H2 Título de Seção** | `21px` | `660` | `-0.65px` | `#273329` |
| **Eyebrows / Chapéus** | `8px a 9px` | `790` | `+1.35px` | `--muted` (Uppercase) |
| **Labels de Formulário** | `8px` | `770` | `+0.65px` | `#899185` (Uppercase) |
| **Valores de Preço (Cartaz)** | `clamp(24px, 12cqw, 57px)` | `810` | `-0.07em` | `--agro-lime` ou Vermelho Alerta |
| **Micro Rodapé Forense/Legal** | `clamp(5px, 1.65cqw, 8px)` | `800` | `+0.45px` | Contrastado com fundo |

---

## 5. Como Implementar em 4 Passos na Aplicação Principal

### Passo 1: Adicionar a Folha de Tokens e Classes
Copie o arquivo de estilo [`src/ui/styles/pulso-luna-max.css`](file:///home/kaio/Projetos/saas-varejo/src/ui/styles/pulso-luna-max.css) para a pasta `src/ui/styles/` do projeto principal e importe-o no topo do `src/App.tsx`.

### Passo 2: Estruturar o App Shell
Substitua o contêiner externo escuro (`bg-slate-950 flex flex-col h-screen`) pelo layout grid padrão:
```tsx
<div className={`app-shell ${isRetail ? "app-shell--urban" : "app-shell--agro"}`}>
  <aside className="sidebar">
    {/* Marca, Workspace, Menu, Freemium e Perfil */}
  </aside>
  <main className="main-content">
    {/* Topbar + Page Wrap */}
  </main>
</div>
```

### Passo 3: Envelopar o Formulário de Entrada
Mova os inputs do operador para dentro do card com classe `.editor-card`. Mantenha as ligações com os métodos do seu `store.ts` (`currentOffer.productName`, `currentOffer.offerPriceCents`, etc.).

### Passo 4: Envelopar a Prévia no Frame com Cantoneiras
Coloque o canvas de renderização (`StorePosterA4Sheet` ou `SocialMediaCardCanvas`) dentro de `.preview-stage` com a classe `.creative-frame`:
```tsx
<div className="preview-stage">
  <div className="stage-dots" />
  <div className={`creative-frame frame--${format}`}>
    {/* O componente de cartaz/social existente renderiza aqui */}
    <div className="frame-corner frame-corner--tl" />
    <div className="frame-corner frame-corner--tr" />
    <div className="frame-corner frame-corner--bl" />
    <div className="frame-corner frame-corner--br" />
  </div>
</div>
```

---

## 6. O Que Evitar Rigidemente (Anti-Padrões de Interface)

1. **Evitar fundos 100% pretos de IA (`bg-slate-950` / `#020617`):** Ferramentas de impressão e varejo operam sob luz de loja e balcão. O fundo papel/canvas cinza-claro reduz a fadiga visual e aproxima a tela do material impresso.
2. **Evitar formulários infinitos sem blocos numerados:** O operador de loja não quer rolar uma página com 30 inputs. Agrupe em "01 Dados da Oferta" e forneça preenchimento automático via Smart Paste.
3. **Evitar alertas em vermelho piscante desnecessários:** Use o padrão Pulso de conformidade inline discreta (ícone de escudo + texto conciso de orientação).
4. **Evitar botões com gradientes violeta/azul neon:** Mantenha a sobriedade botânica e corporativa (verde escuro `#23583A` ou terracota `#BB6338`).

---
*Documento consolidado para direcionamento de UI — Alfa Pulso IA & Varejo Brand Studio.*
