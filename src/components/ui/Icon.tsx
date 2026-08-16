import type { SVGProps } from 'react'
import { cn } from '@/lib/cn'

/**
 * A single inline icon set — no icon package, no network request, and the
 * glyphs match the source prototype exactly. All artwork is drawn on a
 * 24x24 grid with a 2px round stroke so sizes stay optically consistent.
 */
const glyphs = {
  logo: <path d="M12 6v12M6 12h12" />,
  home: <path d="M3 11l9-8 9 8m-16 2v8h5v-5h4v5h5v-8" />,
  dashboard: <path d="M3 13h8V3H3v10zm10 8h8V11h-8v10zM3 21h8v-6H3v6zm10-18v6h8V3h-8z" />,
  patients: (
    <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-6 9c0-3.3 2.7-5 6-5s6 1.7 6 5M17 3.5a4 4 0 0 1 0 7.4M23 20c0-2.8-2-4.3-4.5-4.8" />
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  ipd: <path d="M3 7v11m0-4h18m0 4V9a2 2 0 0 0-2-2h-8v6" />,
  billing: <path d="M4 3h16v18l-3-2-3 2-2-2-2 2-3-2-3 2V3zm4 6h8m-8 4h5" />,
  pharmacy: <path d="M12 8v8m-4-4h8M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />,
  lab: <path d="M9 3v6L4 18a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-5-9V3M8 3h8" />,
  reports: <path d="M4 20V10m6 10V4m6 16v-7m4 7H2" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M16.5 16.5L21 21" />
    </>
  ),
  bell: (
    <>
      <path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6z" />
      <path d="M10 20a2.4 2.4 0 0 0 4 0" />
    </>
  ),
  alert: <path d="M12 9v4m0 4h.01M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />,
  check: <path d="M5 13l4 4L19 7" />,
  close: <path d="M18 6L6 18M6 6l12 12" />,
  x: <path d="M18 6L6 18M6 6l12 12" />,
  trash: (
    <>
      <path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M10 11v6m4-6v6" />
    </>
  ),
  chevronDown: <path d="M6 9l6 6 6-6" />,
  chevronRight: <path d="M9 6l6 6-6 6" />,
  chevronLeft: <path d="M15 6l-6 6 6 6" />,
  arrowUp: <path d="M12 19V5M5 12l7-7 7 7" />,
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowLeft: <path d="M19 12H5M11 6l-6 6 6 6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  filter: <path d="M3 5h18l-7 8v5l-4 2v-7L3 5z" />,
  download: <path d="M12 4v11m0 0l-4-4m4 4l4-4M4 19h16" />,
  printer: (
    <>
      <path d="M7 8V3h10v5" />
      <path d="M5 8h14a2 2 0 0 1 2 2v6h-4v5H7v-5H3v-6a2 2 0 0 1 2-2z" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4m8-4v4M3 11h18" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  logout: <path d="M15 17l5-5-5-5M20 12H9M12 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" />,
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.2A1.6 1.6 0 0 0 7 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 3 15a2 2 0 0 1-1-1.7v-.6A2 2 0 0 1 3 11a1.6 1.6 0 0 0 1-1.5 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 9 4.6a2 2 0 0 1 1.7-1h.6a2 2 0 0 1 1.7 1 1.6 1.6 0 0 0 2.7 1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1 2.7h.2a2 2 0 1 1 0 4h-.2a1.6 1.6 0 0 0-1.1 1z" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.2 9a3 3 0 0 1 5.8 1c0 2-3 2.5-3 4M12 17.5h.01" />
    </>
  ),
  vitals: <path d="M3 12h4l2.5-7 4 14L16 12h5" />,
  pill: (
    <>
      <path d="M10.5 20.5a5 5 0 0 1-7-7l6-6a5 5 0 0 1 7 7z" />
      <path d="M8.5 8.5l7 7" />
    </>
  ),
  notes: (
    <>
      <path d="M15 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h6M8 13h8M8 17h5" />
    </>
  ),
  clipboard: (
    <>
      <path d="M9 3h6v3H9z" />
      <path d="M15 4.5h2A2 2 0 0 1 19 6.5V20a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6.5a2 2 0 0 1 2-2h2" />
    </>
  ),
  timeline: (
    <>
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="6" cy="18" r="2.5" />
      <path d="M6 8.5v7M11 6h9M11 18h9" />
    </>
  ),
  bed: <path d="M3 7v11m0-4h18m0 4V9a2 2 0 0 0-2-2h-8v6" />,
  transfer: <path d="M4 8h13l-3-3m3 3l-3 3M20 16H7l3-3m-3 3l3 3" />,
  shield: <path d="M12 3l8 3v6c0 4.5-3.2 8.3-8 9-4.8-.7-8-4.5-8-9V6z" />,
  phone: <path d="M5 3h4l2 5-2.5 1.5a12 12 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2.2 2A17 17 0 0 1 3 5.2 2 2 0 0 1 5 3z" />,
  refresh: <path d="M20 11A8 8 0 0 0 6.3 6.3L4 8.5m0 0V4m0 4.5h4.5M4 13a8 8 0 0 0 13.7 4.7L20 15.5m0 0V20m0-4.5h-4.5" />,
  inbox: <path d="M3 13h5l1.5 3h5L16 13h5M3 13l3-8h12l3 8v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  spark: <path d="M13 2L4.5 13.5H11L10 22l8.5-11.5H12z" />,
  droplet: <path d="M12 3s6 6.5 6 10.5a6 6 0 0 1-12 0C6 9.5 12 3 12 3z" />,
  scan: (
    <>
      <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" />
      <path d="M3 12h18" />
    </>
  ),
  box: <path d="M3 8l9-5 9 5v8l-9 5-9-5V8zm9 5l9-5m-9 5v9m0-9L3 8" />,
  activity: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  badge: (
    <>
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M9 3h6v4H9zM9 12h6M9 16h4" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2v2.2M12 19.8V22M4.2 12H2M22 12h-2.2M5.6 5.6 4 4M20 20l-1.6-1.6M18.4 5.6 20 4M4 20l1.6-1.6" />
    </>
  ),
  moon: <path d="M20.5 14.3A8.6 8.6 0 0 1 9.7 3.5a8.6 8.6 0 1 0 10.8 10.8z" />,
  sliders: (
    <>
      <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h10M18 18h2" />
      <circle cx="16" cy="6" r="2" />
      <circle cx="10" cy="12" r="2" />
      <circle cx="16" cy="18" r="2" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeOff: <path d="M10.6 5.2A9.6 9.6 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4M6.3 6.4A17 17 0 0 0 2 12s3.6 7 10 7a9.7 9.7 0 0 0 4.2-.9M3 3l18 18M9.9 9.9a3 3 0 0 0 4.2 4.2" />,
  dragVertical: (
    <>
      <circle cx="9" cy="6" r="1.4" />
      <circle cx="15" cy="6" r="1.4" />
      <circle cx="9" cy="12" r="1.4" />
      <circle cx="15" cy="12" r="1.4" />
      <circle cx="9" cy="18" r="1.4" />
      <circle cx="15" cy="18" r="1.4" />
    </>
  ),
  scissors: (
    <>
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="6" cy="18" r="2.5" />
      <path d="M20 4L8.5 16.5M8.5 7.5L20 20" />
    </>
  ),

  /* ------------------------------------------------------------- clinical */
  stethoscope: (
    <>
      <path d="M6 3v6a4 4 0 0 0 8 0V3M4 3h3M13 3h3" />
      <path d="M10 13v3a4 4 0 0 0 8 0v-1" />
      <circle cx="18" cy="11" r="2" />
    </>
  ),
  heart: <path d="M12 20s-7-4.4-7-9.2A4.2 4.2 0 0 1 12 8a4.2 4.2 0 0 1 7 2.8C19 15.6 12 20 12 20z" />,
  lungs: (
    <>
      <path d="M12 3v9" />
      <path d="M9 8c0 4-1 5-2.5 7.5C5.4 17.2 4 18.6 4 16V12c0-2.5 1.5-4.5 3-4.5S9 8 9 8z" />
      <path d="M15 8c0 4 1 5 2.5 7.5C18.6 17.2 20 18.6 20 16V12c0-2.5-1.5-4.5-3-4.5S15 8 15 8z" />
    </>
  ),
  thermometer: (
    <>
      <path d="M13 14V4a2 2 0 0 0-4 0v10a4 4 0 1 0 4 0z" />
      <path d="M11 8h3M11 11h3" />
    </>
  ),
  syringe: (
    <>
      <path d="M18 3l3 3M17 6l1-1M19.5 4.5 15 9M6 21l-3-1 1-3 8-8 3 3-9 9z" />
      <path d="M12 9l3 3" />
    </>
  ),
  microscope: (
    <>
      <path d="M6 20h12M9 20a5 5 0 0 0 5-8" />
      <path d="M9 4h4l1 5H8l1-5zM11 9v3" />
      <path d="M4 20a8 8 0 0 1 5-7.5" />
    </>
  ),
  ambulance: (
    <>
      <path d="M2 16V7h11v9M13 10h4l3 3.5V16M2 16h2m6 0h6m2 0h1" />
      <circle cx="6.5" cy="18" r="2" />
      <circle cx="17.5" cy="18" r="2" />
      <path d="M6.5 9.5v3M5 11h3" />
    </>
  ),
  wheelchair: (
    <>
      <circle cx="10" cy="17" r="4.5" />
      <path d="M14 4.5a1 1 0 1 0 0-.1M13 8v5h4l2 4M13 10h4" />
    </>
  ),
  dna: (
    <>
      <path d="M6 3c0 5 12 6 12 11M18 3c0 5-12 6-12 11M6 21c0-2 12-2 12-4M18 21c0-2-12-2-12-4" />
      <path d="M8 6h8M8 18h8" />
    </>
  ),
  mask: (
    <>
      <path d="M3 8v4a5 5 0 0 0 3 4.6l3 1.3a6 6 0 0 0 6 0l3-1.3A5 5 0 0 0 21 12V8l-4-2-5 1.5L7 6 3 8z" />
      <path d="M7 11h10M7 14h10" />
    </>
  ),

  /* ------------------------------------------------------------- CRM & ERP */
  briefcase: (
    <>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <path d="M12 12v.01M2 12h20" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  deal: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M9 13h6M9 17h4" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </>
  ),
  truck: (
    <>
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </>
  ),
  warehouse: (
    <>
      <path d="M3 21V9l9-6 9 6v12" />
      <path d="M9 21v-7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v7" />
    </>
  ),
  receipt: (
    <>
      <path d="M4 2v20l3-2 3 2 3-2 3 2 4-2V2l-4 2-3-2-3 2-3-2z" />
      <path d="M8 8h8M8 12h6M8 16h4" />
    </>
  ),
  chartBar: (
    <>
      <path d="M18 20V10M12 20V4M6 20v-6" />
    </>
  ),
  building: (
    <>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" />
    </>
  ),
  userCheck: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <polyline points="17 11 19 13 23 9" />
    </>
  ),
  coins: (
    <>
      <circle cx="8" cy="8" r="6" />
      <path d="M18.09 10.37A6 6 0 1 1 10.34 18M7 6h2M7 10h2" />
    </>
  ),
  layers: (
    <>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </>
  ),
  zap: (
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  ),
  cart: (
    <>
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </>
  ),
  calculator: (
    <>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <line x1="16" y1="14" x2="16" y2="14.01" />
      <line x1="12" y1="14" x2="12" y2="14.01" />
      <line x1="8" y1="14" x2="8" y2="14.01" />
      <line x1="16" y1="18" x2="16" y2="18.01" />
      <line x1="12" y1="18" x2="12" y2="18.01" />
      <line x1="8" y1="18" x2="8" y2="18.01" />
      <line x1="16" y1="10" x2="16" y2="10.01" />
      <line x1="12" y1="10" x2="12" y2="10.01" />
      <line x1="8" y1="10" x2="8" y2="10.01" />
    </>
  ),
  gift: (
    <>
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect x="2" y="7" width="20" height="5" />
      <line x1="12" y1="22" x2="12" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </>
  ),
  book: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </>
  ),
  creditCard: (
    <>
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </>
  ),
  cash: (
    <>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="3" />
      <path d="M6 12h.01M18 12h.01" />
    </>
  ),
  master: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M12 8v8M8 12l4-4 4 4" />
    </>
  ),
  pencil: (
    <>
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </>
  ),
  edit: (
    <>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </>
  ),
  device: (
    <>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M9 11h6M9 15h4" />
      <circle cx="7" cy="11" r=".7" fill="currentColor" />
      <circle cx="7" cy="15" r=".7" fill="currentColor" />
    </>
  ),
  leadVia: (
    <>
      <path d="M3 4h18l-7 8v6l-4 2v-8L3 4z" />
      <path d="M19 13v6M16 16h6" />
    </>
  ),
  location: (
    <>
      <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </>
  ),
  terms: (
    <>
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <circle cx="4" cy="6" r="1.5" />
      <circle cx="4" cy="12" r="1.5" />
      <circle cx="4" cy="18" r="1.5" />
    </>
  ),
  hireMethod: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  voucherNumbering: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8.5 13h1v5M7.5 18h3M12.5 13h2.5a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-2.5v2h3.5" />
    </>
  ),
  companySettings: (
    <>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" />
      <circle cx="12" cy="14" r="2" />
    </>
  ),
  palette: (
    <>
      <circle cx="13.5" cy="6.5" r=".75" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".75" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".75" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".75" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.6-.7 1.6-1.6 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.9.7-1.6 1.6-1.6H16c3.3 0 6-2.7 6-6 0-5.5-4.5-10-10-10z" />
    </>
  ),
  trophy: (
    <>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.45 1-1 1H8v4h8v-4h-1c-.55 0-1-.45-1-1v-2.34M18 4H6v7a6 6 0 0 0 12 0V4z" />
    </>
  ),
  cube: (
    <>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </>
  ),
  map: (
    <>
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </>
  ),
  wallet: (
    <>
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4M3 5v14a2 2 0 0 0 2 2h16v-5M18 12a2 2 0 0 0 0 4h3v-4h-3z" />
    </>
  ),
  userGroup: (
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  trendingUp: (
    <>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </>
  ),
  trendingDown: (
    <>
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </>
  ),
  declined: (
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </>
  ),
  business: (
    <>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <path d="M12 12v.01M2 12h20" />
    </>
  ),
} as const

export type IconName = keyof typeof glyphs
export const iconNames = Object.keys(glyphs) as IconName[]

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName
  /** Rendered pixel box; icons are square. */
  size?: number
  strokeWidth?: number
  /** Set when the icon is the only content of a control. */
  title?: string
}

export function Icon({ name, size = 16, strokeWidth = 2, className, title, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('shrink-0', className)}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {glyphs[name]}
    </svg>
  )
}
