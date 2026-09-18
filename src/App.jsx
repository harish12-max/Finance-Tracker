import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import RootLayout from './components/Layout/RootLayout.jsx'

const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'))
const TransactionsPage = lazy(() => import('./pages/TransactionsPage.jsx'))
const TransactionsNewPage = lazy(() => import('./pages/TransactionsNewPage.jsx'))
const TransactionsEditPage = lazy(() => import('./pages/TransactionsEditPage.jsx'))
const BudgetPage = lazy(() => import('./pages/BudgetPage.jsx'))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage.jsx'))

function PageLoader() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      Loading...
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/transactions/new" element={<TransactionsNewPage />} />
          <Route path="/transactions/edit/:transactionId" element={<TransactionsEditPage />} />
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
