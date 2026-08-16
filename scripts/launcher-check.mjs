// Verifies the launcher: module count, hover-opens-dropdown, and that opening
// a dropdown does not move any other module card.
import { mkdirSync } from 'node:fs'
import puppeteer from 'puppeteer-core'

const BASE = process.argv[2] ?? 'http://localhost:5188'
const OUT = 'shots'
mkdirSync(OUT, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  defaultViewport: { width: 1440, height: 1000 },
  args: ['--no-sandbox'],
})
const page = await browser.newPage()
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))

await page.goto(`${BASE}/login`, { waitUntil: 'networkidle0' })
await page.click('button[type="submit"]')
await page.waitForFunction(() => location.pathname === '/', { timeout: 8000 })
await new Promise((r) => setTimeout(r, 400))

const cardBoxes = () =>
  page.$$eval('ul > li.group', (nodes) =>
    nodes.map((n) => {
      const r = n.getBoundingClientRect()
      return { label: n.querySelector('span.font-semibold')?.textContent, x: Math.round(r.x), y: Math.round(r.y) }
    }),
  )

const count = (await cardBoxes()).length
console.log(`modules rendered: ${count}`)

const before = await cardBoxes()
await page.screenshot({ path: `${OUT}/L1-launcher.png` })

// Hover the 2nd card (mouse only — no click on any chevron).
const target = await page.$$('ul > li.group')
await target[1].hover()
await new Promise((r) => setTimeout(r, 350))

const dropdownVisible = await page.evaluate(() => {
  const li = document.querySelectorAll('ul > li.group')[1]
  // The animated wrapper holds the opacity; the <ul> inside it is the panel.
  const panel = li.querySelector(':scope > div')
  return panel ? Number(getComputedStyle(panel).opacity) : -1
})
console.log(`dropdown opacity on hover: ${dropdownVisible}`)

const after = await cardBoxes()
const moved = before.filter((b, i) => b.x !== after[i].x || b.y !== after[i].y)
console.log(`cards that moved while dropdown open: ${moved.length}`)
if (moved.length) console.log(JSON.stringify(moved.slice(0, 5)))

await page.screenshot({ path: `${OUT}/L2-launcher-hover.png` })

// A placeholder module route should render, not 404.
await page.goto(`${BASE}/blood-bank`, { waitUntil: 'networkidle0' })
await page.screenshot({ path: `${OUT}/L3-placeholder.png` })

await browser.close()
console.log(errors.length ? `\nERRORS:\n${[...new Set(errors)].join('\n')}` : '\nNo console errors.')
