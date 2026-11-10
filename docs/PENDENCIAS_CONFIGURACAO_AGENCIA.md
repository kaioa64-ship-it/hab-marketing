# Pendências de Configuração — Agência Autônoma Gabarito Pro

Documento de rastreio das configurações manuais ainda pendentes nas ferramentas da stack instalada via `setup-gabarito-agency.sh`. Nenhuma delas é executada automaticamente pelo script de instalação.

---

## 1. n8n (Orquestrador Central) — `http://localhost:5678`

| Item | Ação | Status |
|------|------|--------|
| Importar workflow | Abrir n8n → Workflows → Importar → selecionar `scripts/n8n-workflow-gabarito.json` | ⏳ Pendente |
| Ativar workflow | Após importar, alternar o toggle "Active" para ON | ⏳ Pendente |
| Credencial Evolution API | Criar credencial do tipo "Evolution API API" com `AUTHENTICATION_API_KEY` definida no `.env` | ⏳ Pendente |
| Webhook URL público | Anotar a URL gerada pelo Cloudflared Tunnel e configurar na Vercel como `VITE_N8N_WEBHOOK_URL` | ⏳ Pendente |
| Variáveis de ambiente | Confirmar `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` batendo com o `.env` | ⏳ Pendente |

---

## 2. Evolution API v2 + Redis (WhatsApp) — `http://localhost:8080`

| Item | Ação | Status |
|------|------|--------|
| Criar instância | Painel Evolution → Instances → Add Instance → nome `gabarito_whatsapp` | ⏳ Pendente |
| Conectar celular | Ler o QR Code gerado com o WhatsApp do lojista/consultor | ⏳ Pendente |
| Chave de autenticação | Usar a mesma `AUTHENTICATION_API_KEY` do `.env` nas chamadas | ⏳ Pendente |
| Redis cache | Confirmar que `redis://redis:6379/1` está acessível pelo container | ✅ Automático via Docker Compose |

---

## 3. PostgreSQL 16 (CRM & Cofre de Licenças)

| Item | Ação | Status |
|------|------|--------|
| Banco e usuário | Criados automaticamente pelo Docker Compose (`gabarito_crm`, `gabarito`) | ✅ Automático |
| Schema Evolution | O Evolution API cria o schema `evolution` automaticamente no primeiro uso | ✅ Automático |
| Backup | Agendar `pg_dump` periódico no NVMe (`~/gabarito-agency/postgres_data`) | ⏳ Pendente |

---

## 4. Cloudflared Tunnel (HTTPS público gratuito)

| Item | Ação | Status |
|------|------|--------|
| Subir container | `sudo docker run -d --name gabarito_tunnel --restart unless-stopped --network gabarito-agency_default --memory=60m cloudflare/cloudflared:latest tunnel --no-autoupdate --url http://gabarito_n8n:5678` | ⏳ Pendente |
| Capturar URL | `sudo docker logs gabarito_tunnel 2>&1 | grep -o 'https://[-a-z0-9.]*\.trycloudflare\.com'` | ⏳ Pendente |
| Variável Vercel | Definir `VITE_N8N_WEBHOOK_URL=<URL_DO_TUNNEL>/webhook/gabarito-lead-captured` na Vercel | ⏳ Pendente |

> O conector em `src/utils/leadWebhook.ts` já concatena o path `/webhook/gabarito-lead-captured` sobre a URL base informada.

---

## 5. Ollama (RX 580, 8GB VRAM) — porta 11434

| Item | Ação | Status |
|------|------|--------|
| Subir container | `sudo docker run -d --device /dev/kfd --device /dev/dri -v ~/gabarito-agency/ollama_models:/root/.ollama -e HSA_OVERRIDE_GFX_VERSION=8.0.3 -e HCC_AMDGPU_TARGET=gfx803 -p 11434:11434 --name gabarito_ollama_rx580 ollama/ollama:rocm` | ⏳ Pendente |
| Baixar modelo | `sudo docker exec -it gabarito_ollama_rx580 ollama pull qwen2.5:7b` | ⏳ Pendente |
| Testar modelo | `curl http://localhost:11434/api/tags` deve listar `qwen2.5:7b` | ⏳ Pendente |
| Ligar/desligar | `sudo docker stop gabarito_ollama_rx580` / `sudo docker start gabarito_ollama_rx580` | 🔧 Sob demanda |

---

## 6. Vercel (Frontend `pulso-pi-hazel.vercel.app`)

| Item | Ação | Status |
|------|------|--------|
| Variável de ambiente | `VITE_N8N_WEBHOOK_URL` com a URL do Cloudflared + `/webhook/gabarito-lead-captured` | ⏳ Pendente |
| Redeploy | Após definir a variável, fazer redeploy na Vercel | ⏳ Pendente |
| Teste de lead | Capturar um lead no estúdio e verificar se chega no webhook do n8n | ⏳ Pendente |

---

## 7. Validação End-to-End (Checklist de Aceite)

- [ ] n8n acessível em `http://localhost:5678` com workflow ativo
- [ ] Evolution API acessível em `http://localhost:8080` com instância conectada
- [ ] Cloudflared entregando HTTPS público estável
- [ ] `VITE_N8N_WEBHOOK_URL` configurada na Vercel
- [ ] Teste de captura de lead: estúdio → evento `gabarito:lead_captured` → n8n recebe → WhatsApp de boas-vindas enviado
- [ ] Teste de pagamento: webhook `gabarito:pagamento-confirmado` → chave `GABARITO-PRO-XXXXX` gerada → WhatsApp + e-mail entregues
- [ ] Ollama respondendo na RX 580 (opcional, apenas se IA local for usada)

---

## Comandos de controle rápidos

```bash
# Status da stack
sudo docker compose -f ~/gabarito-agency/docker-compose.yml ps

# Logs n8n
sudo docker logs -f gabarito_n8n

# Logs Evolution
sudo docker logs -f gabarito_whatsapp

# Logs tunnel
sudo docker logs -f gabarito_tunnel

# Reiniciar Ollama (liberar VRAM para codar)
sudo docker stop gabarito_ollama_rx580
sudo docker start gabarito_ollama_rx580

# Parar toda a agência
sudo docker compose -f ~/gabarito-agency/docker-compose.yml stop
```

---

*Documento gerado após a entrega da FEAT-33 (conector n8n + workflow JSON) e FEAT-34/35/36 (templates geométricos). Mantenha este arquivo atualizado conforme as configurações forem concluídas.*
