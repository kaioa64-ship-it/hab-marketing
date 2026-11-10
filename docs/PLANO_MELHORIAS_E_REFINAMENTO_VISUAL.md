# PLANO MESTRE DE MELHORIAS, REFINAMENTO VISUAL & REGRAS DE MÓDULOS — HUB COAGRO v3.4

**Responsável pelo Projeto & Curadoria:** Kaio Virgínio (Marketing Grupo Coagro)  
**Arquiteto Técnico:** Ciel (Antigravity)  
**Data:** 10 de Novembro de 2026  
**Diretório do Projeto:** `C:\RESOLVER\Hub Coagro`  

---

## 1. Visão Geral e Alinhamento Estratégico

Este documento consolida todas as melhorias de usabilidade, regras de negócio, hierarquia de cores e despoluição visual alinhadas na sessão de trabalho. A aplicação já possui sua arquitetura técnica completa e auditada (38 testes aprovados). O foco atual é a **lapidação estética, eliminação de ruídos na ponta e separação clara entre autonomia de loja e governança da marca**.

---

## 2. Mapa de Melhorias por Módulo e Arquivo

### 2.1. Cartazes de PDV (Motor Visual & Rodapé)
**Arquivos de Impacto:**  
- `src/engine/PosterAndSocialCanvas.tsx`
- `src/App.tsx`
- `src/core/businessRules.ts`

| Item | Situação Atual | Nova Diretriz Aprovada |
| :--- | :--- | :--- |
| **Código Obscuro no Rodapé** | Exibia strings forenses como `AP... L22` que geravam estranheza na loja e no cliente. | **Remover totalmente do visual visível do cartaz.** Manter a rastreabilidade apenas no log interno e no modal de protocolo `REQ-XXXX`. |
| **Frase de Atendimento** | *"Garanta na loja ou peça pelo WhatsApp"* (redundante, pois o cliente já está na loja). | **Remover a frase.** Focar exclusivamente no atendimento presencial da filial. |
| **Identidade no Rodapé** | Nome estático textual *"Grupo Coagro"*. | Substituir pela **Logo Oficial Vetorizada da Coagro**. |
| **Canal de Atendimento** | Faltava identificação visual do WhatsApp da loja. | Inserir **Ícone oficial do WhatsApp + Número formatado da filial ativa** (`activeStore.telefoneFormatado`). |
| **Permissão Balcão (`OPERATOR`)** | O botão de download estava condicionado apenas ao curador. | **Liberar download direto (PDF e PNG) para o operador de balcão** no modelo pré-definido, sem burocracia para ofertas regulares. |
| **Geração em Lote por Planilha** | Opção aparecia oculta ou confusa. | **Restrita ao Gerente de Loja (`STORE_MANAGER`) e Curador (`CURATOR_ADMIN`)** para evitar impressões descontroladas no balcão. |
| **Modelos de Campanha (Promo Simples)** | Faltavam variações para datas comerciais fortes. | Criar cabeçalhos dinâmicos pré-aprovados para: **Saldão Coagro, Black Friday, Sabadão do Produtor, Fecha Mês e Natal Coagro**. |

---

### 2.2. Identidade Visual & Inversão de Cores no Agro
**Arquivo de Impacto:** `src/core/coagroStores.ts` e `src/core/types.ts`

* **Nova Hierarquia de Cores (Agro):**
  * **Cor Primária Titular:** **Azul Oficial da Logotipo Coagro** (`#002B49`).
  * **Cor Secundária:** **Verde-Safra Institucional** (`#004d40`).
  * **Acentos & Preço:** **Dourado / Amarelo Ouro** (`#ffab00`).
* **Blindagem da Marca:** A paleta Coagro Pet (`#001C71` e `#4897D0`) continua estritamente isolada e só é ativada em unidades ou departamentos pet homologados.

---

### 2.3. Diretório de Unidades & Gestão de Filiais
**Arquivo de Impacto:** `src/core/coagroStores.ts`

| Unidade | Status | Ação no Sistema |
| :--- | :---: | :--- |
| **Coagro Catedral** | Desativada | **Removida da listagem ativa.** |
| **Coagro 15 de Novembro (Rua 15)** | Desativada | **Removida da listagem ativa.** |
| **Coagro Expedicionário** | Ativa | **Definida como a filial padrão de boot** em Arapiraca/AL. |
| **Lojas RB Agrícola** (Propriá, Coruripe, etc.) | Em transição | **Mantidas com flag `ativo: true/false`** para habilitar/desabilitar sem retrabalho de código. |
| **Cartão CNPJ & Dados Fiscais** | Novo Recurso | Adicionado card/botão de **"Copiar Dados Fiscais / CNPJ"** de cada loja para agilizar cotações com gráficas locais e compras de mídia. |
| **Flag de Departamento Pet** | Novo Recurso | Adicionada flag `hasPetDepartment`. Se a loja for 100% agro, o seletor PET fica oculto para não gerar poluição visual. |

---

### 2.4. Brand Hub & Media Library (Reestruturação Completa)
**Arquivo de Impacto:** `src/ui/BrandHubView.tsx`

* **Aba 1 (Destaque Principal):** **`'campaigns'`** (*"📦 Campanhas Oficiais & Media Library"*).
  * O Brand Hub abre diretamente nessa tela.
* **Painel Dinâmico por Campanha Ativa:**
  * Ao clicar em uma campanha (*ex: Saldão Coagro, Black Friday*), abre-se o pacote completo:
    1. **Stories:** visualização e download em 1080×1920.
    2. **Vídeos por Departamento:** separados por Nutrição Animal, Defensivos, Máquinas e Pet.
    3. **Spots de Rádio:** áudio pronto para download ou execução no som ambiente.
    4. **Botão "⚡ Gerar Cartaz Desta Campanha":** injeta a campanha, o cabeçalho e as cores no módulo de cartazes com 1 clique.
    5. **Botão "📱 Gerar Anúncio de Loja":** injeta a campanha no módulo de WhatsApp/Feed.
* **Galeria de Produtos Homologados:**
  * Catálogo de SKUs que já contam com fotos tratadas em PNG com fundo transparente prontas para carregar no estúdio.

---

### 2.5. Despoluição de Interface & Remoção de Redundâncias
**Arquivo de Impacto:** `src/App.tsx`

* **Unificação de Perfil de Usuário & Contato:**
  * O nome do usuário e o contato de suporte apareciam duplicados (no cabeçalho superior e no rodapé/menu inferior).
  * **Correção:** Manter apenas no cabeçalho superior unificado.
* **Atalho e Modal de Ajuda:**
  * Eliminar o botão redundante no rodapé, mantendo o acesso limpo via ícone superior e atalho de teclado `Alt + H`.

---

### 2.6. Spots da Rádio Coagro
**Arquivo de Impacto:** `src/ui/SpecialRequestsView.tsx`

* **Interruptor Simples de Filial:**
  * Em vez de exigir que o gerente selecione sua filial em uma lista longa, o formulário passa a ter um toggle direto:  
    `[ ] Mencionar o nome da minha loja no áudio?`
  * Se ativado, o script de 15s ou 30s insere automaticamente a frase com a unidade ativa (ex: *"Aqui na Coagro Expedicionário"*).

---

### 2.7. Comunicados de Mural / RH (`HR_NOTICE`)
**Arquivo de Impacto:** `src/engine/PosterAndSocialCanvas.tsx` e `src/App.tsx`

* **Regra de Preto e Branco:** A opção P&B (Toner Eco) fica restrita ao formato físico **A4**. Para outros formatos ou envios digitais, a peça é sempre renderizada na paleta colorida oficial.
* **Classificação por Canal:** Inclusão de seletor de finalidade:
  1. *Mural Físico de Loja (A4)*
  2. *Card para Rede Social Interna / WhatsApp*
  3. *Comunicado Formal da Diretoria*

---

## 3. Backlog de Peças a Criar pelo Marketing (Kaio)

Para alimentar a Media Library nos próximos dias:

- [ ] **Assets de Campanha — Saldão Coagro:** Header PNG para cartaz, 3 artes de stories e 1 spot padrão.
- [ ] **Assets de Campanha — Black Friday Coagro:** Header dark/gold institucional, selo % OFF Black e 3 vídeos curtos.
- [ ] **Assets de Campanha — Sabadão do Produtor & Fecha Mês:** Testeiras de cabeçalho padronizadas.
- [ ] **Vídeos Institucionais por Departamento:** Pastagem/Sementes, Nutrição Animal (Bovigold/Fosbovi), Defensivos e Pet.

---

## 4. Ordem Cirúrgica de Execução Técnica

1. **Sprint A:** Limpeza do rodapé dos cartazes (remoção do código `AP... L22`, inclusão da Logo Coagro e WhatsApp com ícone) + inversão de cor primária (Azul Oficial) e secundária (Verde-Safra).
2. **Sprint B:** Atualização do diretório de lojas (remoção de Catedral e 15 de Novembro; definição de Expedicionário como padrão; flag de PET condicional).
3. **Sprint C:** Reorganização do Brand Hub com foco prioritário na aba de Campanhas & Media Library, pacotes de criativos por campanha e botões de injeção direta nos módulos.
4. **Sprint D:** Despoluição da UI em `App.tsx` (remoção de duplicidades no rodapé, unificação do perfil e atalho de ajuda).
