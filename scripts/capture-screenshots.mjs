// scripts/capture-screenshots.mjs
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const SCREENSHOTS_DIR = path.join(ROOT_DIR, 'screenshots');
const AUTH_DIR = path.join(ROOT_DIR, '.playwright-auth');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const VIEWPORT = { width: 1440, height: 900 };

// Assegura diretórios de saída
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}
if (!fs.existsSync(AUTH_DIR)) {
  fs.mkdirSync(AUTH_DIR, { recursive: true });
}

// Localiza binário do Chrome se disponível no sistema
function getChromeExecutable() {
  const candidates = [
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return undefined;
}

// Seed padrão para sessão autenticada com Lead e Tenant ativo
const SEED_STORAGE = {
  gabarito_lead_profile_v1: JSON.stringify({
    name: 'Carlos Oliveira',
    storeName: 'Agro & Pet Santa Helena',
    whatsappOrEmail: 'carlos@agrohelena.com.br',
    branchCount: '2 a 4 lojas',
    authProvider: 'google',
    capturedAt: new Date().toISOString(),
  }),
  gabarito_ui_prefs_v1: JSON.stringify({
    workMode: 'OPERATOR',
    moduleVisibility: {},
  }),
};

async function waitPageReady(page) {
  try {
    await page.waitForLoadState('networkidle', { timeout: 10000 });
  } catch {
    // Networkidle timeout é tolerado se houver polling em background
  }
  // Garante que todas as fontes foram descarregadas
  await page.evaluate(() => document.fonts.ready);
  // Respiro para renderização de SVG/Canvas/CSS transitórios
  await page.waitForTimeout(600);
}

async function run() {
  console.log('====================================================');
  console.log('📸 GABARITO PRO — QA VISUAL AUTOMATION (PLAYWRIGHT)');
  console.log(`🌐 Base URL: ${BASE_URL}`);
  console.log(`📁 Destino:  ${SCREENSHOTS_DIR}`);
  console.log('====================================================\n');

  const executablePath = getChromeExecutable();
  console.log(`[Browser] Iniciando Chromium via: ${executablePath || 'Playwright Bundled'}`);

  const browser = await chromium.launch({
    headless: true,
    executablePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  // ETAPA 1: Setup da Sessão Autenticada / Mock State
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2, // HiDPI para auditoria visual nítida
  });

  // Injeta estado inicial da sessão (Lead salvo) no localStorage
  await context.addInitScript((seeds) => {
    for (const [key, val] of Object.entries(seeds)) {
      localStorage.setItem(key, val);
    }
  }, SEED_STORAGE);

  const page = await context.newPage();

  // Teste de conexão inicial
  console.log(`[Setup] Acessando ${BASE_URL}...`);
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  await waitPageReady(page);

  // Salva o estado da sessão em disco para reuso
  const authStatePath = path.join(AUTH_DIR, 'session-state.json');
  await context.storageState({ path: authStatePath });
  console.log(`[Auth] Sessão autenticada armazenada em: ${authStatePath}\n`);

  // Matriz de telas e estados a capturar
  const tasks = [
    // 1. ESTÚDIO — MÓDULO CARTAZES (MODO BALCÃO)
    {
      name: '01-estudio-cartaz-balcao',
      description: 'Estúdio: Cartaz de Loja A4 (Modo Balcão - 3 Passos)',
      action: async () => {
        await page.goto(`${BASE_URL}/#/estudio`);
        await page.evaluate(() => {
          localStorage.setItem('gabarito_ui_prefs_v1', JSON.stringify({ workMode: 'OPERATOR' }));
        });
        await page.reload();
        await waitPageReady(page);
        // Clica no módulo de Cartazes
        const posterBtn = page.locator('.side-nav button:has-text("Cartazes de loja")').first();
        if (await posterBtn.count()) await posterBtn.click();
        await page.waitForTimeout(400);
      },
    },

    // 2. ESTÚDIO — MÓDULO CARTAZES (MODO GERENTE)
    {
      name: '02-estudio-cartaz-gerente',
      description: 'Estúdio: Cartaz de Loja (Modo Gerente - Governança Completa)',
      action: async () => {
        await page.evaluate(() => {
          localStorage.setItem('gabarito_ui_prefs_v1', JSON.stringify({ workMode: 'MANAGER' }));
        });
        await page.reload();
        await waitPageReady(page);
        // Garante que o switch do gerente esteja ativo
        const managerBtn = page.locator('button:has-text("Modo Gerente")').first();
        if (await managerBtn.count()) await managerBtn.click();
        await page.waitForTimeout(400);
      },
    },

    // 3. ESTÚDIO — CARTAZES EM LOTE (ERP/CSV)
    {
      name: '03-estudio-cartaz-lote',
      description: 'Estúdio: Importação de Cartazes em Lote (Modo ERP / Tabela)',
      action: async () => {
        const batchBtn = page.locator('button:has-text("Lote Auditável")').first();
        if (await batchBtn.count()) {
          await batchBtn.click();
          await page.waitForTimeout(500);
        }
      },
    },

    // 4. ESTÚDIO — REDES SOCIAIS (STORIES / FEED)
    {
      name: '04-estudio-redes-sociais',
      description: 'Estúdio: Gerador de Artes para Redes Sociais (Story/Feed)',
      action: async () => {
        const socialBtn = page.locator('.side-nav button:has-text("Redes sociais")').first();
        if (await socialBtn.count()) {
          await socialBtn.click();
          await waitPageReady(page);
        }
      },
    },

    // 5. ESTÚDIO — CARROSSÉIS
    {
      name: '05-estudio-carrossel',
      description: 'Estúdio: Construtor de Carrossel de Ofertas 4:5',
      action: async () => {
        const carouselBtn = page.locator('.side-nav button:has-text("Carrosséis")').first();
        if (await carouselBtn.count()) {
          await carouselBtn.click();
          await waitPageReady(page);
        }
      },
    },

    // 6. ESTÚDIO — RH & COMUNICADOS INTERNOS
    {
      name: '06-estudio-rh-comunicados',
      description: 'Estúdio: Murais de RH, Vagas e Comunicados de Segurança',
      action: async () => {
        const hrBtn = page.locator('.side-nav button:has-text("RH & comunicados")').first();
        if (await hrBtn.count()) {
          await hrBtn.click();
          await waitPageReady(page);
        }
      },
    },

    // 7. CONFIGURAÇÕES — IDENTIDADE DA MARCA (WHITE-LABEL)
    {
      name: '07-configuracoes-identidade',
      description: 'Configurações: Identidade da Marca (Logo, Cores, Departamentos)',
      action: async () => {
        await page.goto(`${BASE_URL}/#/configuracoes/identidade`);
        await waitPageReady(page);
      },
    },

    // 8. CONFIGURAÇÕES — REGRAS COMERCIAIS
    {
      name: '08-configuracoes-regras',
      description: 'Configurações: Regras Comerciais (Preços, Validade, CDC)',
      action: async () => {
        await page.goto(`${BASE_URL}/#/configuracoes/regras`);
        await waitPageReady(page);
      },
    },

    // 9. CONFIGURAÇÕES — CARTAZES DE LOJA
    {
      name: '09-configuracoes-cartazes',
      description: 'Configurações: Cartazes de Loja (Padrões de Impressão e Tema)',
      action: async () => {
        await page.goto(`${BASE_URL}/#/configuracoes/cartazes`);
        await waitPageReady(page);
      },
    },

    // 10. CONFIGURAÇÕES — REDES SOCIAIS
    {
      name: '10-configuracoes-social',
      description: 'Configurações: Redes Sociais (Proporção e Zonas Seguras)',
      action: async () => {
        await page.goto(`${BASE_URL}/#/configuracoes/social`);
        await waitPageReady(page);
      },
    },

    // 11. CONFIGURAÇÕES — BASE ERP
    {
      name: '11-configuracoes-erp',
      description: 'Configurações: Base ERP (Catálogo e Sincronização)',
      action: async () => {
        await page.goto(`${BASE_URL}/#/configuracoes/erp`);
        await waitPageReady(page);
      },
    },

    // 12. CONFIGURAÇÕES — ACESSO & INTERFACE
    {
      name: '12-configuracoes-acesso',
      description: 'Configurações: Acesso e Interface (Visibilidade de Campos)',
      action: async () => {
        await page.goto(`${BASE_URL}/#/configuracoes/acesso`);
        await waitPageReady(page);
      },
    },

    // 13. MODAL DE AJUDA & ATALHOS
    {
      name: '13-modal-ajuda-atalhos',
      description: 'Modal: Painel de Atalhos de Teclado e Ajuda Rápida (Alt+H)',
      action: async () => {
        await page.goto(`${BASE_URL}/#/estudio`);
        await waitPageReady(page);
        const helpBtn = page.locator('button[title*="Ajuda"]').first();
        if (await helpBtn.count()) {
          await helpBtn.click();
          await page.waitForTimeout(500);
        }
      },
    },

    // 14. MODAL — CAPTURA DE LEAD (95% DO FLUXO)
    {
      name: '14-modal-captura-lead',
      description: 'Modal: Captura de Lead para Liberação do Download Gratuito',
      action: async () => {
        // Limpa lead para simular novo lojista no portão de 95%
        await page.evaluate(() => {
          localStorage.removeItem('gabarito_lead_profile_v1');
          localStorage.removeItem('alfa_pulso_lead_contact');
          localStorage.removeItem('alfa_pulso_lead_email');
          localStorage.removeItem('alfa_pulso_lead_whatsapp');
        });
        await page.reload();
        await waitPageReady(page);
        // Clica no botão de ação de download no estúdio para abrir o modal de lead
        const directActionBtn = page.locator('button:has-text("IMPRIMIR CARTAZ AGORA"), button:has-text("BAIXAR ARTE SOCIAL")').first();
        if (await directActionBtn.count()) {
          await directActionBtn.click();
          await page.waitForTimeout(600);
        }
      },
    },

    // 15. MODAL — PLANOS E UPGRADE PRO (SELF-SERVICE)
    {
      name: '15-modal-planos-upgrade',
      description: 'Modal: Autovenda e Planos Pro (Balcão R$97 vs Governança R$197)',
      action: async () => {
        // Clica no link de planos dentro do modal de lead ou na sidebar
        const seePlansBtn = page.locator('button:has-text("Já tem chave de licença PRO ou quer ver os planos?")').first();
        if (await seePlansBtn.count()) {
          await seePlansBtn.click();
          await page.waitForTimeout(600);
        } else {
          const upgradeBtn = page.locator('.upgrade-link').first();
          if (await upgradeBtn.count()) {
            await upgradeBtn.click();
            await page.waitForTimeout(600);
          }
        }
      },
    },

    // 16. APRESENTAÇÃO COMERCIAL / LANDING PAGE
    {
      name: '16-landing-page-apresentacao',
      description: 'Landing Page: Apresentação Comercial do Gabarito Pro (#/apresentacao)',
      action: async () => {
        // Fecha qualquer modal aberto antes de navegar
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
        await page.goto(`${BASE_URL}/#/apresentacao`);
        await waitPageReady(page);
      },
    },
  ];

  // Execução de Capturas
  const results = [];
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const filename = `${task.name}.png`;
    const filepath = path.join(SCREENSHOTS_DIR, filename);

    console.log(`[${i + 1}/${tasks.length}] Capturando: ${task.description}...`);
    try {
      await task.action();
      await page.screenshot({ path: filepath, fullPage: true });
      const stats = fs.statSync(filepath);
      const kb = (stats.size / 1024).toFixed(1);
      console.log(`   ✅ Salvo: ./screenshots/${filename} (${kb} KB)`);
      results.push({ ...task, filename, filepath, sizeKb: kb, status: 'OK' });
    } catch (err) {
      console.error(`   ❌ Falha ao capturar ${task.name}:`, err.message);
      results.push({ ...task, filename, filepath, status: 'ERROR', error: err.message });
    }
  }

  await browser.close();

  // Escreve manifesto com metadata das capturas
  const manifestPath = path.join(SCREENSHOTS_DIR, 'manifest.json');
  fs.writeFileSync(
    manifestPath,
    JSON.stringify(
      {
        baseUrl: BASE_URL,
        capturedAt: new Date().toISOString(),
        total: results.length,
        successful: results.filter((r) => r.status === 'OK').length,
        items: results,
      },
      null,
      2
    )
  );

  console.log('\n====================================================');
  console.log(`🎉 Captura concluída! ${results.filter((r) => r.status === 'OK').length}/${results.length} imagens geradas.`);
  console.log(`📑 Manifesto salvo em: ${manifestPath}`);
  console.log('====================================================\n');
}

run().catch((err) => {
  console.error('Fatal crawler error:', err);
  process.exit(1);
});
