import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'
import { LangProvider } from '@/context/LangContext.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <LangProvider>
      <App />
    </LangProvider>
  </BrowserRouter>,
)
