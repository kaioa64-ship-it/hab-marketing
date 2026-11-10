# INSTRUÇÕES DE SISTEMA PARA AGENTES DE IA (ALFA PULSO IA)

Você está atuando em um repositório sob governança estrita. Siga este checklist em TODAS as interações:

---

## 1. O Prompt Rápido Universal (Snippet de Cabeçalho)

> **Dica para o Usuário:** Copie e cole este bloco no início de qualquer nova sessão ou prompt com IA:

```markdown
### PROTOCOLO OBRIGATÓRIO DE EXECUÇÃO (LEIA ANTES DE AGIR)

1. **Leitura de Contexto:** Antes de propor ou editar qualquer código, leia integralmente os arquivos `PRODUCT_VISION.md` e `CHANGELOG.md` na raiz do projeto.
2. **Respeito às Travas:**
   - Obedeça estritamente aos princípios do `PRODUCT_VISION.md` (estado único, cálculos determinísticos concentrados em `src/core/businessRules.ts` e `src/core/resolve.ts`, escala em `cqw` e Feature Freeze do MVP).
   - Não remova atributos semânticos de teste (`data-sheet`, `data-slots`, `data-price-integer`, `data-price-cents`, `data-effective-price`, `data-price-per-measure`, `data-guardrail-status`).
3. **Validação Real (Proibido Simular Terminal):**
   - Após aplicar as alterações, execute de verdade `npx tsc --noEmit` e `npx vite build`.
   - Nunca invente saídas de terminal. Se houver erro de compilação, corrija antes de encerrar.
4. **Documentação Obrigatória no `CHANGELOG.md`:**
   - Nenhuma tarefa está concluída até ser registrada no topo do arquivo `CHANGELOG.md`.
   - Mantenha o padrão Keep a Changelog (`### Adicionado`, `### Corrigido`, `### Alterado`) com códigos rastreáveis (ex: `FEAT-XX`, `BUG-VIS-XX`, `CALC-XX`) detalhando o arquivo alterado e a regra aplicada.

---
**MINHA DEMANDA ATUAL:**
[ESCREVA AQUI O QUE VOCÊ QUER QUE A IA FAÇA]
```

---

## 2. Checklist Obrigatório de Execução (Regras para os Agentes)

### 1. Antes de escrever código
- Leia `PRODUCT_VISION.md` para entender a arquitetura (`src/core/` puro vs `src/engine/` e `src/App.tsx`) e o limite de escopo atual (Feature Freeze).
- Leia `CHANGELOG.md` para conhecer o estado mais recente do sistema e evitar regressões em bugs já corrigidos.

### 2. Durante a implementação
- **Proibido lógica solta na UI:** Cálculos de preço, descontos, vigência PROCON e travas do MAPA vivem exclusivamente em `src/core/businessRules.ts` e `src/core/resolve.ts`.
- **Contratos DOM intocáveis:** Preserve todos os atributos `data-*` existentes nos componentes de renderização para não quebrar a auditoria automatizada.
- **Zero dependências desnecessárias:** Não instale pacotes npm sem autorização explícita.

### 3. Antes de finalizar sua resposta (Definition of Done)
1. Rode `npx tsc --noEmit` no terminal e garanta 0 erros.
2. Atualize o arquivo `CHANGELOG.md` seguindo estritamente o formato [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/) já utilizado no arquivo:
   - Agrupe em `### Adicionado` ou `### Corrigido`.
   - Use identificadores claros (ex: `FEAT-01`, `BUG-VIS-04`, `CALC-03`) seguidos da explicação técnica objetiva dos arquivos e funções modificados.
