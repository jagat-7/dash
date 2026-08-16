// Verifies: theme toggle, right-edge drawer (vertical-only drag), topbar
// module search, select2 filters, launcher scaling — in light and dark.
import { mkdirSync } from 'node:fs'
import puppeteer from 'puppeteer-core'

const BASE = process.argv[2] ?? 'http://localhost:5188'
const OUT = 'shots'
mkdirSync(OUT, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  defaultViewport: { width: 1500, height: 950 },
  args: ['--no-sandbox'],
})
const page = await browser.newPage()
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const shot = async (n) => { await wait(380); await page.screenshot({ path: `${OUT}/${n}.png` }); console.log('saved', n) }

await page.goto(`${BASE}/login`, { waitUntil: 'networkidle0' })
await page.click('button[type="submit"]')
await page.waitForFunction(() => location.pathname === '/', { timeout: 8000 })
await wait(400)
console.log('modules on launcher:', await page.$$eval('ul li.group', (n) => n.length))
await shot('T1-launcher-light')

// Compact density
await page.evaluate(() => {
  const b = [...document.querySelectorAll('[role="tab"]')].find((x) => x.textContent.trim() === 'Compact')
  b?.click()
})
await shot('T2-launcher-compact')

// Launcher filter
await page.type('input[aria-label="Filter modules"]', 'blood')
await wait(350)
console.log('after filtering "blood":', await page.$$eval('ul li.group', (n) => n.length))
await shot('T3-launcher-filtered')

/* ---- theme toggle ---- */
await page.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle0' })
await shot('T4-dashboard-light')
await page.click('button[aria-label^="Switch to dark"]')
await wait(400)
const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'))
console.log('data-theme after toggle:', theme)
await shot('T5-dashboard-dark')

// persisted?
await page.reload({ waitUntil: 'networkidle0' })
console.log('theme after reload:', await page.evaluate(() => document.documentElement.getAttribute('data-theme')))

/* ---- topbar module search ---- */
await page.click('input[aria-label="Search modules, menus and patients"]')
await page.type('input[aria-label="Search modules, menus and patients"]', 'blood')
await wait(350)
console.log('search results:', await page.$$eval('#module-search-results [role="option"]', (n) => n.length))
await shot('T6-module-search-dark')

/* ---- right-edge drawer, vertical only ---- */
await page.keyboard.press('Escape')
await page.goto(`${BASE}/reports`, { waitUntil: 'networkidle0' })
const handleSel = 'button[aria-label*="shortcuts"]'
const h0 = await (await page.$(handleSel)).boundingBox()
console.log(`handle start x=${Math.round(h0.x)} y=${Math.round(h0.y)} (viewport w=1500)`)
console.log('pinned to right edge:', h0.x + h0.width >= 1495 ? 'YES' : 'NO')

// Try to drag diagonally — x must not change.
await page.mouse.move(h0.x + h0.width / 2, h0.y + h0.height / 2)
await page.mouse.down()
await page.mouse.move(500, 200, { steps: 18 })
await page.mouse.up()
await wait(350)
const h1 = await (await page.$(handleSel)).boundingBox()
console.log(`after diagonal drag x=${Math.round(h1.x)} y=${Math.round(h1.y)}`)
console.log(`x unchanged: ${Math.abs(h1.x - h0.x) < 2 ? 'YES' : 'NO'} · y moved: ${Math.abs(h1.y - h0.y) > 100 ? 'YES' : 'NO'}`)
await shot('T7-handle-moved-dark')

// Open the drawer
await page.click(handleSel)
await wait(450)
await shot('T8-drawer-open-dark')

/* ---- filters + select2 on patients ---- */
await page.evaluate(() => document.querySelector('button[aria-label="Close shortcuts"]')?.click())
await page.goto(`${BASE}/patients`, { waitUntil: 'networkidle0' })
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim().startsWith('Filters'))
  b?.click()
})
await wait(350)
await shot('T9-filters-dark')

// Open the multi-select and pick a value
await page.evaluate(() => {
  const inputs = [...document.querySelectorAll('input[role="combobox"]')]
  inputs[0]?.click()
})
await wait(350)
await shot('T10-multiselect-dark')

// Back to light for the gallery
await page.goto(`${BASE}/design`, { waitUntil: 'networkidle0' })
await page.evaluate(() => {
  const b = [...document.querySelectorAll('[role="radio"]')].find((x) => x.textContent.trim() === 'Light')
  b?.click()
})
await wait(400)
await page.setViewport({ width: 1500, height: 1500 })
for (const id of ['forms', 'data']) {
  await page.evaluate((s) => document.getElementById(s)?.scrollIntoView(), id)
  await shot(`T11-gallery-${id}`)
}

await browser.close()
console.log(errors.length ? `\nERRORS:\n${[...new Set(errors)].join('\n')}` : '\nNo console errors.')
