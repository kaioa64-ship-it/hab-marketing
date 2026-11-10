# Gabarito Pro

> **Precificação em 10s & Governança Visual para Varejo Físico e Agronegócio.**

Aplicação construída em React 18, Vite e Vanilla CSS com tokens técnicos, otimizada para operação em balcões de lojas agropecuárias, cooperativas, supermercados, pet shops e lojas de materiais de construção.

---

## ⚡ Diferenciais do Motor
- **Modo Balcão em 3 Passos (10 Segundos):** Digite apenas o código SKU ou cole a oferta do WhatsApp — o motor limpa o título, ajusta centavos atômicos, calcula preço por quilo/litro e formata a arte pronta para imprimir.
- **Skins Geométricas Homologadas:** Presets visuais `Retail Pop` (varejo urbano), `Agro Brutalist` (defensivos e máquinas com chanfros 45°) e `Minimal Boutique` (pet shop e especialidades).
- **Conformidade Automática:** Advertências obrigatórias para defensivos agrícolas (Lei 14.785/2023 / MAPA), medicamentos veterinários (CRMV) e bebidas alcoólicas (+18) injetadas automaticamente por código NCM e princípio ativo.
- **Impressão Vetorial 300 DPI sem Dependências:** Saída nativa para impressoras laser toner P&B (`BW_ECO_TONER`) e coloridas em folha inteira A4 (1x), meia-folha A5 (2x) e etiquetas de gôndola (4x).
- **Portão de Autovenda e Leads nos 95%:** Liberação instantânea de artes 300 DPI com captura leve de lead para webhook (n8n/CRM) e planos comerciais sem atrito (Balcão Pro R$97 e Governança R$197).
- **Landing Page Integrada:** Apresentação comercial de alta conversão com calculadora interativa de ROI e teste instantâneo da oferta.
- **100% White-Label:** Personalização instantânea de logotipos, paletas de cores com validação de contraste WCAG 2.1 e pares tipográficos homologados (Montserrat, Oswald, Poppins, etc.).
- **Módulos Prontos:** Cartazes de Loja A4, Cards de Redes Sociais (Story 9:16 e Feed 4:5), Carrossel Guiado de Ofertas e Mural de RH/Comunicados.

---

## 📚 Documentação do Projeto

Toda a documentação técnica, manuais e planos de engenharia estão organizados na pasta [`docs/`](./docs/README.md):

- [📖 **Índice da Documentação (`docs/README.md`)**](./docs/README.md)
- [🛠️ **Auditoria Técnica do Core (`docs/BACKEND_CORE_AUDIT.md`)**](./docs/BACKEND_CORE_AUDIT.md)
- [🎨 **Auditoria de Frontend e UX/UI (`docs/FRONTEND_UX_AUDIT.md`)**](./docs/FRONTEND_UX_AUDIT.md)
- [🚀 **Plano de Despoluição Visual e Perfis (`docs/DEBLOAT_AND_ROLES_PLAN.md`)**](./docs/DEBLOAT_AND_ROLES_PLAN.md)
- [💼 **Playbook de Go-To-Market (`docs/GTM_PLAYBOOK.md`)**](./docs/GTM_PLAYBOOK.md)
- [🧪 **Guia de Homologação em Loja (`docs/TESTING_GUIDE.md`)**](./docs/TESTING_GUIDE.md)

### Documentos de Governança
- [`PRODUCT_VISION.md`](./PRODUCT_VISION.md): Visão de produto, princípios invariáveis e feature freeze do MVP.
- [`CHANGELOG.md`](./CHANGELOG.md): Histórico completo de versões (`v1.0.0` a `v2.1.0`).
- [`AGENTS.md`](./AGENTS.md): Diretrizes de governança e validação técnica para agentes de IA.

---

## 💻 Como Rodar Localmente

```bash
# 1. Instalar dependências
npm install

# 2. Rodar suíte de testes de regressão (18/18 testes)
npm test

# 3. Validar tipagem TypeScript
npm run typecheck

# 4. Iniciar servidor de desenvolvimento
npm run dev

# 5. Compilar para produção
npm run build
```
