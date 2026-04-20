import { Navigate, Route, Routes } from 'react-router-dom'
import RootLayout from './components/Layout/RootLayout.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import TransactionsPage from './pages/TransactionsPage.jsx'
import TransactionsNewPage from './pages/TransactionsNewPage.jsx'
import TransactionsEditPage from './pages/TransactionsEditPage.jsx'
import BudgetPage from './pages/BudgetPage.jsx'
import AnalyticsPage from './pages/AnalyticsPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route
          path="/transactions/new"
          element={<TransactionsNewPage />}
        />
        <Route
          path="/transactions/edit/:transactionId"
          element={<TransactionsEditPage />}
        />
        <Route path="/budget" element={<BudgetPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}
