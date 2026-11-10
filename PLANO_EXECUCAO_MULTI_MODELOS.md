# PLANO MESTRE DE EXECUÇÃO & AUDITORIA ARQUITETURAL — HUB COAGRO v3.3
**Diretório Oficial do Projeto:** `C:\RESOLVER\Hub Coagro`  
**Arquiteto Auditor:** Ciel (Grupo Coagro) + Kaio Virgínio  
**Status Atual:** **SPRINTS 1 A 8 100% CONCLUÍDAS E AUDITADAS (38/38 testes)** • **PRONTO PARA GO-LIVE**  

---

## 1. Status Consolidado do Projeto (Sprints 1 a 8 Operacionais)

Toda a base do Hub Coagro está 100% testada e blindada, com **38/38 testes passando** em `scripts/audit.mjs` e **0 erros de TypeScript**:

1. **Sprint 1 (CloudSync REST Supabase / PostgreSQL)**: ✅ `TEST-31` aprovado.
2. **Sprint 2 (Ponte Rádio Coagro :8790 Spotifast)**: ✅ `TEST-32` aprovado.
3. **Sprint 3 (Campanhas Globais & Media Library)**: ✅ `TEST-33` aprovado.
4. **Sprint 4 (Modo Balcão Despoluído & Modal de Protocolo)**: ✅ `TEST-34` aprovado.
5. **Sprint 5 (SQL Status Constraint 'NEEDS_REVISION' & Auto-Sync no Boot)**: ✅ `TEST-35` aprovado.
6. **Sprint 6 (Player de Pré-Escuta MP3 & approvedFileUrl no Spotifast)**: ✅ `TEST-36` aprovado.
7. **Sprint 7 (Modal Global de Protocolo & Bloqueio de Formato no Balcão)**: ✅ `TEST-37` aprovado.
8. **Sprint 8 (Cadastro de Produtos Homologados com Foto PNG & Exportação CSV da Curadoria)**: ✅ `TEST-38` aprovado.

---

## 2. Checklist de Go-Live (Implantação na Rede Local / Vercel + Supabase)

O projeto está pronto para homologação e publicação:

1. **Banco de Dados (Supabase / Neon)**:
   - Executar o script `supabase_migration_hub_coagro.sql` no SQL Editor do projeto Supabase.
   - Criar o arquivo `.env.local` na raiz de `C:\RESOLVER\Hub Coagro`:
     ```env
     VITE_SUPABASE_URL=https://seu-projeto.supabase.co
     VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica
     VITE_SPOTIFAST_SERVER_URL=http://localhost:8790
     ```
2. **Servidor Local nas Lojas (Regra LAN `0.0.0.0`)**:
   - Iniciar com `npm.cmd run dev -- --host 0.0.0.0 --port 3000` (ou servir o `dist/` gerado via Nginx/PM2) para acesso via navegador nos terminais das vendedoras e gerentes sem precisar instalar nada nas máquinas físicas das filiais.
