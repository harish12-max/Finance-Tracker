import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'
import App from './App.jsx'
import { FinanceProvider } from './context/FinanceContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FinanceProvider>
      <BrowserRouter>
        <App />
        <ToastContainer position="top-right" autoClose={2200} />
      </BrowserRouter>
    </FinanceProvider>
  </StrictMode>,
)
