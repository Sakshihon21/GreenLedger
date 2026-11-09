import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Ensure dark mode is completely removed from document and storage
try {
  document.documentElement.classList.remove('dark');
  document.body.classList.remove('dark');
  document.documentElement.removeAttribute('data-theme');
  localStorage.removeItem('greenledger_theme');
} catch (e) {
  // ignore
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
