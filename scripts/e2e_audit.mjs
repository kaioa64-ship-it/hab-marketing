import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const SCREENSHOT_DIR = '/home/kaio/.gemini/antigravity-ide/brain/f670dd76-baf7-4cf2-90c5-55690241e900/screenshots';
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

async function runAudit() {
  console.log('🚀 Starting Chrome audit...');
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    defaultViewport: { width: 1440, height: 900 }
  });

  const auditReport = {
    original: {
      url: 'http://localhost:5173',
      errors: [],
      warnings: [],
      metrics: {}
    },
    copia: {
      url: 'http://localhost:5174',
      errors: [],
      warnings: [],
      metrics: {}
    }
  };

  // --- 1. Audit Original (5173) ---
  console.log('--- Auditing Original (localhost:5173) ---');
  const pageOrig = await browser.newPage();
  pageOrig.on('pageerror', err => {
    console.error('[Orig PageError]', err.message);
    auditReport.original.errors.push(err.message);
  });
  pageOrig.on('console', msg => {
    if (msg.type() === 'error') auditReport.original.errors.push(msg.text());
    if (msg.type() === 'warning') auditReport.original.warnings.push(msg.text());
  });

  await pageOrig.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await pageOrig.screenshot({ path: path.join(SCREENSHOT_DIR, 'orig_01_initial.png') });

  // Test Switch to Redes Sociais
  try {
    await pageOrig.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const b = btns.find(el => el.textContent.includes('Redes Sociais') || el.textContent.includes('Social'));
      if (b) b.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await pageOrig.screenshot({ path: path.join(SCREENSHOT_DIR, 'orig_02_social.png') });
  } catch (e) {
    console.error('Orig social switch err', e);
  }

  // Test Switch to Carrossel
  try {
    await pageOrig.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const b = btns.find(el => el.textContent.includes('Carrossel'));
      if (b) b.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await pageOrig.screenshot({ path: path.join(SCREENSHOT_DIR, 'orig_03_carousel.png') });
  } catch (e) {
    console.error('Orig carousel switch err', e);
  }

  // Test Switch to Mural RH
  try {
    await pageOrig.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const b = btns.find(el => el.textContent.includes('RH') || el.textContent.includes('Mural'));
      if (b) b.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await pageOrig.screenshot({ path: path.join(SCREENSHOT_DIR, 'orig_04_rh.png') });
  } catch (e) {
    console.error('Orig RH switch err', e);
  }

  // Switch back to Cartazes de Loja
  try {
    await pageOrig.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const b = btns.find(el => el.textContent.includes('Cartazes'));
      if (b) b.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await pageOrig.screenshot({ path: path.join(SCREENSHOT_DIR, 'orig_05_cartazes.png') });
  } catch (e) {
    console.error('Orig cartazes switch err', e);
  }

  // Open BrandKit Modal in Original
  try {
    await pageOrig.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const b = btns.find(el => el.textContent.includes('Marca') || el.textContent.includes('Brand'));
      if (b) b.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await pageOrig.screenshot({ path: path.join(SCREENSHOT_DIR, 'orig_06_brandkit_modal.png') });
    await pageOrig.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 400));
  } catch (e) {
    console.error('Orig BrandKit modal err', e);
  }

  // Open ERP Modal in Original
  try {
    await pageOrig.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const b = btns.find(el => el.textContent.includes('Base ERP'));
      if (b) b.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await pageOrig.screenshot({ path: path.join(SCREENSHOT_DIR, 'orig_07_erp_modal.png') });
    await pageOrig.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 400));
  } catch (e) {
    console.error('Orig ERP modal err', e);
  }

  // Test Smart Paste in Original
  try {
    await pageOrig.evaluate(() => {
      const input = document.querySelector('input[placeholder*="Ex: Ração"]');
      if (input) {
        input.value = 'Ração Golden Duo Salmão 15kg de 189,90 por 149,90 em 3x de 49,97';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
      const btns = Array.from(document.querySelectorAll('button'));
      const fillBtn = btns.find(el => el.textContent.includes('Preencher'));
      if (fillBtn) fillBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await pageOrig.screenshot({ path: path.join(SCREENSHOT_DIR, 'orig_09_smart_paste_result.png') });
  } catch (e) {
    console.error('Orig Smart paste test err', e);
  }

  // DOM stats for Original
  auditReport.original.metrics = await pageOrig.evaluate(() => {
    return {
      totalElements: document.querySelectorAll('*').length,
      buttonsCount: document.querySelectorAll('button').length,
      inputsCount: document.querySelectorAll('input, select, textarea').length,
      bodyHeight: document.body.scrollHeight,
      viewportHeight: window.innerHeight
    };
  });

  await pageOrig.close();

  // --- 2. Audit Copia (5174) ---
  console.log('--- Auditing Copia (localhost:5174) ---');
  const pageCopia = await browser.newPage();
  pageCopia.on('pageerror', err => {
    console.error('[Copia PageError]', err.message);
    auditReport.copia.errors.push(err.message);
  });
  pageCopia.on('console', msg => {
    if (msg.type() === 'error') auditReport.copia.errors.push(msg.text());
    if (msg.type() === 'warning') auditReport.copia.warnings.push(msg.text());
  });

  await pageCopia.goto('http://localhost:5174', { waitUntil: 'networkidle0' });
  await pageCopia.screenshot({ path: path.join(SCREENSHOT_DIR, 'copia_01_social.png') });

  // Click on 'Cartazes de loja' in Sidebar
  try {
    await pageCopia.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.sidebar-nav-item, button, a'));
      const b = items.find(el => el.textContent.includes('Cartazes de loja'));
      if (b) b.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await pageCopia.screenshot({ path: path.join(SCREENSHOT_DIR, 'copia_02_cartazes.png') });
  } catch (e) {
    console.error('Copia cartazes click err', e);
  }

  // Click on 'Carrosséis' in Sidebar
  try {
    await pageCopia.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.sidebar-nav-item, button, a'));
      const b = items.find(el => el.textContent.includes('Carrosséis'));
      if (b) b.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await pageCopia.screenshot({ path: path.join(SCREENSHOT_DIR, 'copia_03_carousel.png') });
  } catch (e) {
    console.error('Copia carousel click err', e);
  }

  // Click on 'RH & comunicados' in Sidebar
  try {
    await pageCopia.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.sidebar-nav-item, button, a'));
      const b = items.find(el => el.textContent.includes('RH & comunicados'));
      if (b) b.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await pageCopia.screenshot({ path: path.join(SCREENSHOT_DIR, 'copia_04_rh.png') });
  } catch (e) {
    console.error('Copia RH click err', e);
  }

  // Click on 'Configurações gerais' in Sidebar
  try {
    await pageCopia.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.sidebar-nav-item, button, a'));
      const b = items.find(el => el.textContent.includes('Configurações gerais'));
      if (b) b.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await pageCopia.screenshot({ path: path.join(SCREENSHOT_DIR, 'copia_05_settings_identidade.png') });
  } catch (e) {
    console.error('Copia settings click err', e);
  }

  // Test navigating settings tabs precisely via .settings-nav button
  const tabsToTest = [
    { id: 'regras', label: 'Regras' },
    { id: 'cartazes', label: 'Cartazes' },
    { id: 'social', label: 'Redes' },
    { id: 'erp', label: 'ERP' },
    { id: 'acesso', label: 'Acesso' }
  ];

  for (const t of tabsToTest) {
    try {
      await pageCopia.evaluate((tabData) => {
        const navBtns = Array.from(document.querySelectorAll('.settings-nav button'));
        const target = navBtns.find(el => el.textContent.toLowerCase().includes(tabData.id) || el.textContent.includes(tabData.label));
        if (target) target.click();
      }, t);
      await new Promise(r => setTimeout(r, 500));
      await pageCopia.screenshot({ path: path.join(SCREENSHOT_DIR, `copia_06_settings_${t.id}.png`) });
    } catch (e) {
      console.error(`Copia settings ${t.id} err`, e);
    }
  }

  // Go back to Cartazes and test Smart Paste
  try {
    await pageCopia.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.sidebar-nav-item, button, a'));
      const b = items.find(el => el.textContent.includes('Cartazes de loja'));
      if (b) b.click();
    });
    await new Promise(r => setTimeout(r, 600));

    await pageCopia.evaluate(() => {
      const input = document.querySelector('input[placeholder*="Ex: Ração"]');
      if (input) {
        input.value = 'Ração Golden Duo Salmão 15kg de 189,90 por 149,90 em 3x de 49,97';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
      const btns = Array.from(document.querySelectorAll('button'));
      const fillBtn = btns.find(el => el.textContent.includes('Preencher'));
      if (fillBtn) fillBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await pageCopia.screenshot({ path: path.join(SCREENSHOT_DIR, 'copia_10_smart_paste_result.png') });
  } catch (e) {
    console.error('Copia smart paste test err', e);
  }

  // Test toggling workMode in sidebar
  try {
    await pageCopia.evaluate(() => {
      const btn = document.querySelector('.work-mode-toggle');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 500));
    await pageCopia.screenshot({ path: path.join(SCREENSHOT_DIR, 'copia_07_workmode_toggled.png') });
  } catch (e) {
    console.error('Copia workmode toggle err', e);
  }

  // Test Paywall Modal
  try {
    await pageCopia.evaluate(() => {
      const btn = document.querySelector('.freemium-upgrade-btn, button[title*="Liberar"]');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await pageCopia.screenshot({ path: path.join(SCREENSHOT_DIR, 'copia_11_paywall_modal.png') });
    await pageCopia.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 400));
  } catch (e) {
    console.error('Copia paywall err', e);
  }

  // Test toggling workMode in sidebar
  try {
    await pageCopia.evaluate(() => {
      const items = Array.from(document.querySelectorAll('button, a'));
      const b = items.find(el => el.textContent.includes('Redes sociais'));
      if (b) b.click();
    });
    await new Promise(r => setTimeout(r, 500));
    await pageCopia.evaluate(() => {
      const btn = document.querySelector('.work-mode-toggle, button[title*="Modo"]');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 500));
    await pageCopia.screenshot({ path: path.join(SCREENSHOT_DIR, 'copia_07_workmode_toggled.png') });
  } catch (e) {
    console.error('Copia workmode toggle err', e);
  }

  // Test Mobile Viewport (390x844) on Copia
  await pageCopia.setViewport({ width: 390, height: 844, isMobile: true });
  await new Promise(r => setTimeout(r, 500));
  await pageCopia.screenshot({ path: path.join(SCREENSHOT_DIR, 'copia_08_mobile.png') });

  // Open mobile drawer
  try {
    await pageCopia.evaluate(() => {
      const b = document.querySelector('.topbar-hamburger, button[aria-label="Abrir menu"]');
      if (b) b.click();
    });
    await new Promise(r => setTimeout(r, 500));
    await pageCopia.screenshot({ path: path.join(SCREENSHOT_DIR, 'copia_09_mobile_drawer.png') });
  } catch (e) {
    console.error('Copia mobile drawer err', e);
  }

  // DOM stats for Copia
  auditReport.copia.metrics = await pageCopia.evaluate(() => {
    return {
      totalElements: document.querySelectorAll('*').length,
      buttonsCount: document.querySelectorAll('button').length,
      inputsCount: document.querySelectorAll('input, select, textarea').length,
      bodyHeight: document.body.scrollHeight,
      viewportHeight: window.innerHeight
    };
  });

  // Also test Mobile Viewport on Original for comparison
  const pageOrigMob = await browser.newPage();
  await pageOrigMob.setViewport({ width: 390, height: 844, isMobile: true });
  await pageOrigMob.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await pageOrigMob.screenshot({ path: path.join(SCREENSHOT_DIR, 'orig_08_mobile.png') });
  await pageOrigMob.close();

  await pageCopia.close();
  await browser.close();

  fs.writeFileSync(
    path.join(SCREENSHOT_DIR, 'audit_summary.json'),
    JSON.stringify(auditReport, null, 2)
  );
  console.log('✅ Audit script completed successfully! Screenshots saved to', SCREENSHOT_DIR);
}

runAudit().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
