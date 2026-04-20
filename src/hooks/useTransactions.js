import { useFinance } from '../context/FinanceContext.jsx'

export function useTransactions() {
  const {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    syncFromServer,
  } = useFinance()

  return {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    syncFromServer,
  }
}

