# Documentação Oficial — Gabarito Pro (Studio Varejo & Agro)

Bem-vindo ao centro de documentação e engenharia do **Gabarito Pro** (`v2.7.0`).

Aqui você encontra todos os manuais técnicos, relatórios de auditoria, estratégias de homologação e o plano de evolução arquitetural do produto.

---

## Índice de Documentos

### 1. Manuais Operacionais e Plano de Execução Atual
- [**Manual Completo de Funções, Auditoria de Produto e Plano de Execução (MANUAL_DE_FUNCOES_E_AUDITORIA_DE_PRODUTO.md)**](./MANUAL_DE_FUNCOES_E_AUDITORIA_DE_PRODUTO.md)  
  *Mapeamento 100% real vs. mock (`v2.7.0`), inventário botão a botão, diagnóstico técnico-visual dos 5 Templates Campeões, auditoria de segurança (Anti-XSS e Webhook) e Plano de Execução (`EXEC-01` a `EXEC-08`) para aprovação.*
- [**Pendências de Configuração da Agência Autônoma (PENDENCIAS_CONFIGURACAO_AGENCIA.md)**](./PENDENCIAS_CONFIGURACAO_AGENCIA.md)  
  *Checklist pós-instalação para n8n, Evolution API (WhatsApp), PostgreSQL, Cloudflared Tunnel, Ollama (RX 580) e variáveis de ambiente na Vercel.*

### 2. Auditorias e Diagnósticos Técnicos Históricos
- [**Auditoria Técnica & Arquitetural do Core (BACKEND_CORE_AUDIT.md)**](./BACKEND_CORE_AUDIT.md)  
  *Diagnóstico profundo de regras de negócio, performance de cálculo, conformidade com exigências do MAPA (Lei 14.785/2023), PROCON, NCMs fiscais, segurança de backups e resolução dos gargalos P0 a P4.*
- [**Auditoria Independente de Frontend, UX/UI e Arquitetura Visual (FRONTEND_UX_AUDIT.md)**](./FRONTEND_UX_AUDIT.md)  
  *Avaliação minuciosa de cada componente visual, notas de usabilidade (0 a 10), testes de estresse em telas reais e plano de simplificação do fluxo de trabalho.*

### 2. Planejamento & Evolução do Produto
- [**Direcionamento Visual Editorial Pulso — Luna Max (DIRECIONAMENTO_VISUAL_PULSO_LUNA_MAX.md)**](./DIRECIONAMENTO_VISUAL_PULSO_LUNA_MAX.md)  
  *Guia de arquitetura espacial, tokens de cor/tipografia e anatomia do layout editorial Pulso.*
- [**Plano Mestre de Despoluição Visual e Arquitetura de Perfis (DEBLOAT_AND_ROLES_PLAN.md)**](./DEBLOAT_AND_ROLES_PLAN.md)  
  *O roteiro para eliminar o "Painel de Avião": separação entre a tela diária do Operador de Balcão e a Central de Governança/Configurações da Loja.*
- [**Documentação Técnica do Facelift Pulso v2.3.0 (UI_FACELIFT_PULSO.md)**](./UI_FACELIFT_PULSO.md)  
  *Registro completo da implementação do App Shell Pulso, Central de Configurações em 6 abas, preferências de visibilidade e garantias de contratos DOM.*

### 3. Guias de Homologação e Go-To-Market
- [**Playbook de Go-To-Market & Varejo (GTM_PLAYBOOK.md)**](./GTM_PLAYBOOK.md)  
  *Estratégia de penetração via WhatsApp ("Cavalo de Troia"), precificação comercial e scripts de ativação para balcões do agro e varejo alimentar.*
- [**Guia de Homologação e Testes de Loja (TESTING_GUIDE.md)**](./TESTING_GUIDE.md)  
  *Roteiro prático para donos de loja e operadores testarem a geração em 10 segundos, impressão a laser toner P&B e leitura de códigos de barras.*

---

## Documentos na Raiz do Projeto
- [`PRODUCT_VISION.md`](../PRODUCT_VISION.md): Os 10 princípios invariáveis do produto e visão estratégica.
- [`CHANGELOG.md`](../CHANGELOG.md): Histórico cronológico detalhado de todas as versões e códigos rastreáveis (`v1.0.0` até `v2.1.0`).
- [`AGENTS.md`](../AGENTS.md): Protocolo de governança estrita e regras de execução para agentes de IA.
