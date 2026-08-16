// Drives the running dev server through the main screens and saves screenshots.
// Usage: node scripts/shots.mjs [baseUrl]
import { mkdirSync } from 'node:fs'
import puppeteer from 'puppeteer-core'

const BASE = process.argv[2] ?? 'http://localhost:5188'
const OUT = 'shots'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'

mkdirSync(OUT, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1 },
  args: ['--no-sandbox', '--font-render-hinting=none'],
})

const page = await browser.newPage()
const errors = []
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text())
})
page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`))

const shot = async (name) => {
  await new Promise((r) => setTimeout(r, 450))
  await page.screenshot({ path: `${OUT}/${name}.png` })
  console.log(`saved ${name}.png`)
}

// 1. Login
await page.goto(`${BASE}/login`, { waitUntil: 'networkidle0' })
await shot('01-login')

// 2. Sign in -> launcher
await page.click('button[type="submit"]')
await page.waitForFunction(() => location.pathname === '/', { timeout: 8000 })
await new Promise((r) => setTimeout(r, 400))
await shot('02-launcher')

// 3. Launcher card hover (reveals the sub-links)
await page.hover('ul li button')
await shot('03-launcher-hover')

const visit = async (path, name, after) => {
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle0' })
  if (after) await after()
  await shot(name)
}

await visit('/dashboard', '04-dashboard')
await visit('/patients', '05-patients')
await visit('/opd', '06-opd')
await visit('/ipd', '07-ipd', async () => {
  // Select a bed so the detail panel is in frame.
  const beds = await page.$$('button[aria-label^="Bed"]')
  if (beds[1]) await beds[1].click()
})
await visit('/lab', '08-lab')
await visit('/pharmacy', '09-pharmacy')
await visit('/billing', '10-billing', async () => {
  const rows = await page.$$('[role="row"][tabindex="0"]')
  if (rows[1]) await rows[1].click()
})
await visit('/reports', '11-reports')
await visit('/patients/PT-2026-04417', '12-emr-overview')

// EMR tab switch
for (const label of ['Prescriptions', 'Orders', 'Notes']) {
  await page.evaluate((text) => {
    const tab = [...document.querySelectorAll('[role="tab"]')].find((el) =>
      el.textContent.trim().startsWith(text),
    )
    tab?.click()
  }, label)
  await shot(`13-emr-${label.toLowerCase()}`)
}

// Quick-action modal
await page.evaluate(() => {
  const fab = [...document.querySelectorAll('button')].find((el) =>
    el.textContent.trim() === 'New patient',
  )
  fab?.click()
})
await shot('14-registration-modal')

// Collapsed vs pinned rail, and a narrow viewport
await page.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle0' })
await page.click('button[aria-label="Pin navigation open"]')
await shot('15-rail-pinned')

await page.setViewport({ width: 430, height: 900 })
await page.goto(`${BASE}/patients`, { waitUntil: 'networkidle0' })
await shot('16-mobile-patients')
await page.click('button[aria-label="Open navigation"]')
await shot('17-mobile-nav')

await browser.close()

if (errors.length) {
  console.log('\nCONSOLE ERRORS:')
  for (const e of new Set(errors)) console.log(' -', e)
  process.exitCode = 1
} else {
  console.log('\nNo console errors.')
}
