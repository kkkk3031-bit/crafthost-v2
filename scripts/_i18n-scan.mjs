// Lists visible English text left on pages rendered in Arabic.
//   BASE=http://localhost:4098 node scripts/_i18n-scan.mjs /index.html /pricing.html
import { chromium } from 'playwright';
const BASE = process.env.BASE;
// Brand / technical tokens that stay Latin in Arabic UI.
const ALLOW = new Set(('CraftHost CRAFTHOST Minecraft Java Bedrock Paper Purpur Fabric Forge NeoForge Spigot Vanilla Modrinth CurseForge ' +
  'JAR JARs RAM CPU GB MB TB NVMe DDoS TPS MOTD RCON API EN AR KWD USD Discord GitHub KhaledQ84Ever Geyser Floodgate playit gg ' +
  'Mojang AB LuckPerms EssentialsX WorldEdit ViaVersion CoreProtect squaremap Kuwait x64 IPv4 IPv6 SSL HTTPS ms Pro Free').split(' '));
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
await ctx.addInitScript(() => localStorage.setItem('crafthost.lang', 'ar'));
for (const p of process.argv.slice(2)) {
  const page = await ctx.newPage();
  await page.goto(BASE + p); await page.waitForTimeout(2500);
  const texts = await page.evaluate(() => {
    const out = [];
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (w.nextNode()) {
      const n = w.currentNode, el = n.parentElement;
      if (!el || el.closest('script,style,code,pre,.msr,[aria-hidden="true"],.no-i18n')) continue;
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || !el.getClientRects().length) continue;
      const t = n.textContent.trim();
      if (t) out.push(t);
    }
    return out;
  });
  const bad = [...new Set(texts.filter(t => (t.match(/[A-Za-z]{3,}/g) || []).some(w => !ALLOW.has(w))))];
  console.log(`\n${p}: ${bad.length} English strings`);
  for (const b of bad.slice(0, 60)) console.log('   ', JSON.stringify(b.slice(0, 90)));
  await page.close();
}
await browser.close();
