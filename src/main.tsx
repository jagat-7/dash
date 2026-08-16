import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { ToastProvider } from '@/components/ui'
import { useApplyTheme } from '@/store/useTheme'
import './index.css'

/** Stamps `data-theme` on <html> before anything paints. */
function Root() {
  useApplyTheme()
  return (
    <ToastProvider>
      <App />
    </ToastProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Root />
    </BrowserRouter>
  </StrictMode>,
)
