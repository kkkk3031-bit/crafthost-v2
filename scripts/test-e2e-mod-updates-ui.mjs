#!/usr/bin/env node
// Browser e2e of the plugin/mod update modal and the startup-commands
// setting, driven through the dashboard like a user. No JVM boot; installs a
// small old Chunky build from Modrinth, so it needs the network:
//
//   scripts/run-isolated.sh node scripts/test-e2e-mod-updates-ui.mjs

import crypto from "node:crypto";
import { chromium } from "playwright";

const BASE = process.env.BASE || "http://localhost:4099";
const PAPER_OLD = "B0xkCkk4"; // Chunky 1.3.92 (paper, 1.20.1)

let pass = 0, fail = 0;
const G = (s) => `\x1b[32m${s}\x1b[0m`, R = (s) => `\x1b[31m${s}\x1b[0m`;
function check(cond, msg) {
  if (cond) { console.log(`  ${G("✓")} ${msg}`); pass++; }
  else { console.log(`  ${R("✗")} ${msg}`); fail++; }
}
const H = (t) => ({ "Content-Type": "application/json", ...(t ? { Authorization: `Bearer ${t}` } : {}) });
async function api(token, p, method = "GET", body) {
  const r = await fetch(BASE + p, { method, headers: H(token), body: body === undefined ? undefined : JSON.stringify(body) });
  return { status: r.status, body: await r.json().catch(() => null) };
}

console.log(`\nMod updates + startup commands UI test against ${BASE}\n`);
const suffix = crypto.randomBytes(4).toString("hex");
const reg = await api("", "/api/auth/register", "POST", { username: `ui_${suffix}`, email: `ui+${suffix}@test.io`, password: "Pw_" + crypto.randomBytes(8).toString("hex") });
const token = reg.body?.token;
check(!!token, "register");
if (!token) process.exit(1);
const cr = await api(token, "/api/servers", "POST", { name: "UI Mods", type: "paper", version: "1.20.1", plan: "free", skipAutoStart: true });
const sid = cr.body?.server?.id || cr.body?.id;
check(!!sid, "create paper 1.20.1");
const inst = await api(token, `/api/servers/${sid}/plugins/install`, "POST", { version_id: PAPER_OLD });
check(inst.status === 200, `install old Chunky (HTTP ${inst.status})`);

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
await ctx.addCookies([{ name: "token", value: token, url: BASE }]);
await ctx.addInitScript((t) => localStorage.setItem("token", t), token);
const page = await ctx.newPage();
const jsErrors = [];
page.on("pageerror", (e) => jsErrors.push(e.message));
page.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource/.test(m.text())) jsErrors.push(m.text()); });

const toastText = () => page.evaluate(() => [...document.querySelectorAll(".toast, #toast, [class*=toast]")].map((e) => e.textContent).join(" | "));
async function openMenuItem(label) {
  await page.click(`.server-card[data-id="${sid}"] .sc-menu-btn`);
  await page.waitForTimeout(250);
  await page.locator(`#sc-menu-${sid} button[role="menuitem"]`, { hasText: label }).first().click();
}

try {
  await page.goto(`${BASE}/dashboard.html`, { waitUntil: "networkidle" });
  await page.waitForSelector(`.server-card[data-id="${sid}"]`, { timeout: 20000 });

  // ── Update modal ────────────────────────────────────────────────────────
  await openMenuItem("Update plugins/mods");
  await page.waitForSelector("#modUpdatesModal.show", { timeout: 5000 });
  await page.waitForSelector('#muBody .mu-row[data-status="update"]', { timeout: 30000 }).catch(() => {});
  const rowText = await page.locator("#muBody .mu-row").first().textContent().catch(() => "");
  check(/Chunky-1\.3\.92\.jar/.test(rowText) && /1\.3\.92\s*→\s*1\.3\.\d+/.test(rowText), `row shows Chunky 1.3.92 → newer (${rowText.replace(/\s+/g, " ").trim().slice(0, 80)})`);
  const applyText = (await page.textContent("#muApply")).trim();
  check(applyText === "Update all (1)" && !(await page.isDisabled("#muApply")), `"${applyText}" enabled`);
  await page.click("#muApply");
  await page.waitForSelector('#muBody .mu-row[data-status="current"]', { timeout: 60000 }).catch(() => {});
  const after = await page.locator("#muBody .mu-row").first().getAttribute("data-status").catch(() => null);
  check(after === "current", `after update the row is current (${after})`);
  check(await page.isDisabled("#muApply"), "Update all disabled when nothing is left");
  check(/Updated 1/.test(await toastText()), "toast confirms the update");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  check(!(await page.isVisible("#modUpdatesModal.show")), "Escape closes the modal");

  // ── Startup commands in Settings ────────────────────────────────────────
  await openMenuItem("Settings");
  await page.waitForSelector("#set_startup_cmds", { state: "visible", timeout: 8000 });
  await page.uncheck("#set_restart").catch(() => {});
  await page.fill("#set_startup_cmds", "stop");
  await page.click("#set_save");
  await page.waitForTimeout(800);
  check(/can't be a startup command/.test(await toastText()) && (await page.isVisible("#settingsModal.show")), '"stop" refused with a readable error; modal stays open');
  await page.fill("#set_startup_cmds", "/say hello\ngamerule keepInventory true");
  await page.click("#set_save");
  await page.waitForTimeout(1200);
  const row = (await api(token, "/api/servers")).body?.servers?.find((s) => s.id === sid);
  check(row?.startup_commands === "say hello\ngamerule keepInventory true", `saved through the UI (${JSON.stringify(row?.startup_commands)})`);
  await page.waitForTimeout(1500); // dashboard reloads its list
  await openMenuItem("Settings");
  await page.waitForSelector("#set_startup_cmds", { state: "visible", timeout: 8000 });
  await page.waitForTimeout(500);
  check((await page.inputValue("#set_startup_cmds")) === "say hello\ngamerule keepInventory true", "reopening Settings shows the saved commands");
  await page.keyboard.press("Escape");

  // ── Arabic ──────────────────────────────────────────────────────────────
  await page.evaluate(() => localStorage.setItem("crafthost.lang", "ar"));
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForSelector(`.server-card[data-id="${sid}"]`);
  await page.click(`.server-card[data-id="${sid}"] .sc-menu-btn`);
  await page.waitForTimeout(250);
  const menuAr = await page.locator(`#sc-menu-${sid}`).textContent();
  check(menuAr.includes("تحديث الإضافات/المودات"), "Arabic menu item");
  await page.locator(`#sc-menu-${sid} button[role="menuitem"]`, { hasText: "تحديث الإضافات/المودات" }).click();
  await page.waitForSelector('#muBody .mu-row', { timeout: 30000 }).catch(() => {});
  const modalAr = await page.textContent("#modUpdatesModal");
  check(modalAr.includes("تحديث الإضافات والمودات") && modalAr.includes("محدَّث"), "Arabic modal title and status");
  await page.keyboard.press("Escape");
  await page.locator(`.server-card[data-id="${sid}"] .sc-menu-btn`).click();
  await page.locator(`#sc-menu-${sid} button[role="menuitem"]`).filter({ hasText: /الإعدادات|Settings/ }).first().click();
  await page.waitForSelector("#set_startup_cmds", { state: "visible", timeout: 8000 });
  check((await page.textContent("#settingsModal")).includes("أوامر بدء التشغيل"), "Arabic startup-commands label");

  check(jsErrors.length === 0, `no page JS errors${jsErrors.length ? ": " + jsErrors.slice(0, 3).join(" / ") : ""}`);
} finally {
  await browser.close();
  await api(token, `/api/servers/${sid}`, "DELETE");
}

console.log(`\nChecks: ${pass} pass / ${fail} fail`);
process.exit(fail ? 1 : 0);
