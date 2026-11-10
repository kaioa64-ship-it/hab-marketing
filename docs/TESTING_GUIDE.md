# GUIA DE HOMOLOGAÇÃO & TESTES DE ESTRESSE — ALFA PULSO IA (v1.2.0)

> **MANUAL DO OPERADOR & TESTER**
> Utilize este roteiro para estressar os **4 Modelos White-Label de Cartazes**, os **Pares Tipográficos e Presets de Segmento**, o **Hub Universal de Base ERP (Bling, Tiny, TOTVS, Sankhya, CSV, JSON e EAN-13)**, o Smart Paste do WhatsApp e as travas de conformidade jurídica.

---

## 1. Bateria de Testes: Smart Paste do WhatsApp (Entradas Reais)

Copie cada bloco de texto abaixo e cole diretamente no campo **"Smart Paste (Cole aqui o Zap/ERP)"** no topo do formulário.

### Teste 1.1 — Agro / Adubo com Fórmula NPK e Peso Decimal (Anti-Falso Positivo)
```text
Adubo Fertilizante NPK 10-10-10 saco de 10.1kg De: 120,00 Por: 89,90 cada
```
- **Critério de Aceitação:**
  - `Nome do Produto:` Deve ficar limpo como `Adubo Fertilizante NPK 10-10-10`.
  - O sistema **não pode** ler `10-10-10` ou `10.1` como preço.
  - `Preço DE:` R$ 120,00 | `Preço POR:` R$ 89,90.
  - `Unidade:` Extrair `KG` e volume `10.1`.
  - `Modelo de Cartaz Sugerido:` `01. Promoção De/Por` (`PROMO_CLASSIC_V`).

---

### Teste 1.2 — Açougue / Padaria com Fracionamento por Quilo
```text
Coxa e Sobrecoxa de Frango Resfriada kg De: 18,99 Por: 12,90 o quilo
```
- **Critério de Aceitação:**
  - `Nome:` `Coxa e Sobrecoxa de Frango Resfriada`.
  - `Unidade:` `KG`.
  - `Preço DE:` R$ 18,99 | `Preço POR:` R$ 12,90.
  - `No Cartaz:` Preço com `/KG` claro e sem cortes no rodapé.

---

### Teste 1.3 — Mecânica "Leve X Pague Y" com Diluição por KG (CDC / Decreto 5.903)
```text
Sabão Líquido Omo Lavagem Perfeita 3L leve 3 pague 2 por 39,90 a unidade
```
- **Critério de Aceitação:**
  - `Mecânica Comercial:` Muda automaticamente para `Leve X Pague Y`.
  - `Modelo de Cartaz:` Muda automaticamente para `04. Destaque Condição` (`CONDITION_ADVANTAGE`).
  - `Leve:` 3 | `Pague:` 2.
  - `No Cartaz:` 
    - Banner central gigante: `LEVE 3 PAGUE 2`.
    - Subtexto obrigatório pelo CDC: *"Nesta oferta cada LT sai por R$ 26,60 • R$ 8,87/Litro"*.

---

### Teste 1.4 — Validade Próxima (Urgência Anti-Prejuízo)
```text
Iogurte Grego Danone Tradicional 400g vence em 2 dias de 8,50 por 3,99
```
- **Critério de Aceitação:**
  - `Mecânica Comercial:` Muda automaticamente para `Validade Próxima`.
  - `Bucket de dias:` 2 dias.
  - `No Cartaz:` Tarja de urgência no rodapé com aviso de consumo imediato.

---

### Teste 1.5 — Insumo Veterinário / Restrição MAPA & CRMV
```text
Vermífugo Canino Plus 4 comprimidos de 45,00 por 32,90 uso sob prescrição veterinária
```
- **Critério de Aceitação:**
  - `Categoria Regulatória:` `VET_PRESCRIPTION`.
  - `No Cartaz:` Rodapé legal inamovível: *"Venda e aplicação sob orientação do médico veterinário"*.

---

### Teste 1.6 — Texto Sujo de ERP com Siglas e Códigos
```text
CX C/ 12 UN CONDICIONADOR SEDA CERAMIDAS 325ML - 14,90
```
- **Critério de Aceitação:**
  - Limpador de siglas remove `CX C/ 12 UN`.
  - Título limpo: `Condicionador Seda Ceramidas`.
  - Volume extraído: `325ml`.
  - Preço: R$ 14,90.

---

### Teste 1.7 — Maquinário Agrícola Parcelado Sem Juros (Destaque na Parcela)
```text
Triturador Forrageiro TRF 400 Bivolt em 10x sem juros de 189,90
```
- **Critério de Aceitação:**
  - `Mecânica Comercial:` Muda automaticamente para `Parcelado / Maquinário` (`INSTALLMENT_FINANCING`).
  - `Modelo de Cartaz:` Muda automaticamente para `03. Maquinário / Parcelado` (`MACHINERY_INSTALLMENT`).
  - `Parcelamento:` `10x` sem juros de `R$ 189,90` em destaque monumental e `PREÇO À VISTA: R$ 1.899,00` logo abaixo (conformidade Lei Federal 10.962/04).
  - O código `400` do modelo `TRF 400` **não** é confundido com preço.

---

### Teste 1.8 — Compre & Ganhe / Compre 2 pelo Preço de 1 (Destaque na Condição)
```text
Ração Tutticanis 10.1kg por 49,90 compre 1 e ganhe balde dosador
```
- **Critério de Aceitação:**
  - `Mecânica Comercial:` Muda para `Compre & Ganhe` (`BUY_WIN_GIFT`).
  - `Modelo de Cartaz:` Muda para `04. Destaque Condição` (`CONDITION_ADVANTAGE`).
  - `Banner Central:` Exibe em destaque `COMPRE 1 E GANHE BALDE DOSADOR` acima do preço `R$ 49,90`.

---

### Teste 1.9 — Busca Rápida por Código SKU do ERP (Integração Universal)
- No campo **Cód. Interno / SKU**, digite `201` (ou clique no botão rápido `#201`) e pressione `Enter` ou clique em `🔍 Buscar ERP`:
  - Deve carregar instantaneamente o `Triturador Forrageiro TRF 400 2CV BIVOLT`, Preço DE `R$ 2.190,00`, Preço POR `R$ 1.899,00`, Custo `R$ 1.380,00`, Mecânica `10x Sem Juros` e Modelo `03. Maquinário / Parcelado`.
- Digite `301` (ou clique em `#301`):
  - Deve carregar o `Suplemento Mineral Bovinos 30KG` com condição `COMPRE 5 SACOS E GANHE COCHO COLETOR` e Modelo `04. Destaque Condição`.

---

## 2. Bateria de Testes: Retromudanças (Troca de Mecânicas em Cascata)

Execute os passos abaixo sequencialmente sem recarregar a página para testar se há lixo de estado residual:

1. **Preço Direto Simples:** Preencha DE: R$ 100,00 | POR: R$ 79,90.
   - *Verifique:* Cartaz exibe DE R$ 100,00 riscado e POR R$ 79,90 em destaque.
2. **Troca para Leve X Pague Y:** Clique em `Leve X Pague Y` (coloque Leve 3, Pague 2).
   - *Verifique:* Campos de quantidade surgem. Preço monumental e subtexto unitário atualizam na hora.
3. **Troca para 2ª Unidade % OFF:** Clique em `2ª Unidade % OFF` (defina 50%).
   - *Verifique:* Campos de Leve X somem. Subtexto atualiza para *"2ª UNIDADE POR R$ 39,95 (SAI R$ 59,92 CADA)"*.
4. **Troca para Clube Fidelidade / CPF:** Clique em `Clube Fidelidade`.
   - *Verifique:* Badge exclusivo do Clube surge sobre o preço monumental.
5. **Teste da Trava Anti-Prejuízo (Guardrail):** Altere o preço POR para `R$ 150,00` (maior que o DE).
   - *Verifique:* O botão de exportação e impressão trava instantaneamente com alerta de governança: *"Preço promocional não pode ser maior ou igual ao original"*.

---

## 3. Diagnóstico e Comportamento dos Formatos de Impressão

| Formato | Orientação Física | Proporção | Comportamento Atual no Motor |
| :--- | :--- | :--- | :--- |
| **A4 1x (1 por folha)** | Retrato (Vertical) | `1:1.414` (210 x 297 mm) | Padrão ouro. Preço monumental e cabeçalho perfeitos. |
| **A5 2x (2 por folha)** | Paisagem (Horizontal) | `1.414:1` (210 x 148.5 mm) | Resolvido com `isA5Half`. Fontes e paddings ajustados horizontalmente sem vazar folha. |
| **Gôndola 2x2 (4 por folha)** | Grade 2x2 | `1:1.414` (105 x 148.5 mm) | **Resolvido com `isGondola` (v1.0.1):** Paddings compactos, tipografia de preço (`18.5cqw` a `27.5cqw`) e linha de corte central única (`✂`) sem espremer rodapé MAPA. |

---

## 4. Bateria de Testes: Operação 100% Sem Mouse (Modo Caixa / Balcão)

1. Pressione **`Alt + V`**: O foco deve ir imediatamente para a barra **Colar do WhatsApp**.
2. Pressione **`Ctrl + V`** colando uma frase de oferta: O sistema deve extrair e preencher todos os dados automaticamente no ato da colagem (`onPaste`), sem exigir clique em botão.
3. Pressione **`Alt + 1`**, **`Alt + 2`**, **`Alt + 3`** e **`Alt + 4`**: Deve alternar instantaneamente entre **Redes Sociais**, **Cartazes de Loja**, **Carrossel Guiado** e **RH & Comunicados**.
4. Pressione **`Alt + L`**: Deve acionar o limpador de siglas e corretor ortográfico (`racao` → `Ração`, `glifozato` → `Glifosato`).
5. Pressione **`Alt + M`** e **`Alt + E`** (e depois **`Esc`**): Deve abrir e fechar os modais de Marca White-Label e Base ERP.
6. Navegue com **`Tab`** até qualquer ícone `?`: O balão de explicação contextual deve abrir via foco de teclado.

---

## 5. Teste dos Módulos 3 e 4 (`v2.0.0` — Carrossel Guiado & RH/Comunicados)

1. **Módulo 3 (`🎠 Carrossel Guiado` — `Alt+3`):**
   - Clique em **`⚡ Gerar da Base ERP`**: O sistema deve criar automaticamente Slide 1 (Capa da Semana), Slides 2..4 (Produtos da Base ERP com preço/condição e `CÓD`) e Slide Final (CTA WhatsApp da Loja).
   - Navegue entre os slides (`⬅ Slide Anterior` / `Próximo Slide ➡`) e exporte em PNG 1080p.
2. **Módulo 4 (`📢 RH & Comunicados` — `Alt+4`):**
   - Clique nos 3 modelos rápidos: `💼 Vaga / RH` ("Estamos Contratando"), `📋 Comunicado` ("Horário Especial") e `🦺 Segurança / EPI` ("Uso Obrigatório de EPI NR-06").
   - Alterne o formato entre `🖨️ Cartaz Mural A4` e `📱 Card Redes Sociais (Feed 4:5)` e verifique que o `CÓD`, a marca/logo White-Label e o `#AP-...` permanecem presentes.

---

## 6. Teste de Persistência Local, Backup `.JSON` e API Headless (`v2.0.0`)

1. Abra **`⚙ Marca`** (`Alt+M`), clique em **`💾 Exportar JSON`** para baixar o backup completo da loja e teste **`📂 Restaurar JSON`**.
2. Abra **`🔌 Base ERP`** (`Alt+E`) e confira a seção **4. Contrato API Headless Enterprise (`POST /api/v1/render`)** exibindo o JSON canônico determinístico em tempo real.
3. Pressione **F5** (Recarregar): Todos os campos do formulário e o estado do preview devem permanecer intactos (`retail_studio_saas_state_v1` em `schemaVersion: 4`).

---

## 7. Inspeção do Contrato Semântico (`data-*`)

No navegador, inspecione o DOM do cartaz/card e do rodapé:
- `data-sheet`: `a4-full`, `a5-half`, `gondola`, `a4-hr-notice` ou `social-hr-notice`.
- `data-slots`: `1`, `2` ou `4`.
- `data-poster-archetype`: `PROMO_CLASSIC_V`, `CLEAN_DIRECT_PRICE`, `MACHINERY_INSTALLMENT` ou `CONDITION_ADVANTAGE`.
- `data-carousel-slide-type`: `HOOK_COVER`, `PRODUCT_OR_CONTENT` ou `FINAL_CTA`.
- `data-hr-archetype`: `JOB_VACANCY`, `INTERNAL_NOTICE` ou `SAFETY_COMPLIANCE`.
- `data-sku-code`, `data-brand-name`, `data-font-heading`, `data-font-body`: Governança White-Label e Código Core.
- `data-price-integer`: O valor inteiro do preço POR.
- `data-price-cents`: Os centavos do preço POR.
- `data-guardrail-status`: `ok`, `warn`, `approval` ou `block`.
- `data-effective-price`: O preço final unitário calculado.
- `data-price-per-measure`: Texto de diluição por KG ou Litro (quando aplicável).
- `data-freemium-tier`, `data-freemium-used`, `data-freemium-limit`: Estado comercial do rodapé Freemium/PRO.
