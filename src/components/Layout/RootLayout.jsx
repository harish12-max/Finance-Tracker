import { useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { animate } from 'framer-motion'
import Sidebar from './Sidebar.jsx'
import Navbar from './Navbar.jsx'
import './layout.css'
import '../../styles/app.css'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', tone: 'primary' },
  { path: '/transactions', label: 'Transactions', tone: 'secondary' },
  { path: '/budget', label: 'Budget', tone: 'accent' },
  { path: '/analytics', label: 'Analytics', tone: 'primary' },
]

function resolvePageTitle(pathname) {
  if (pathname.startsWith('/transactions/new')) return 'New Transaction'
  if (pathname.startsWith('/transactions/edit')) return 'Edit Transaction'
  if (pathname.startsWith('/dashboard')) return 'Dashboard'
  if (pathname.startsWith('/transactions')) return 'Transactions'
  if (pathname.startsWith('/budget')) return 'Budget'
  if (pathname.startsWith('/analytics')) return 'Analytics'
  return 'Dashboard'
}

export default function RootLayout() {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSidebarOpen(false)
  }, [location.pathname])

  useEffect(() => {
    animate('.rfPage', { opacity: [0.92, 1], y: [4, 0] }, { duration: 0.2 })
  }, [location.pathname])

  const pageTitle = useMemo(
    () => resolvePageTitle(location.pathname),
    [location.pathname],
  )

  return (
    <div className="rfShell">
      <Sidebar
        items={navItems}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="rfMain">
        <Navbar title={pageTitle} onMenu={() => setSidebarOpen(true)} />

        <div className="rfMainContent">
          <div className="rfPage">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

