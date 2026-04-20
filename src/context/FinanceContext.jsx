/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import api from '../api/axiosInstance'
import { fetchExchangeRates } from '../api/currencyApi.js'

const FinanceContext = createContext(null)
const STORAGE_KEYS = {
  transactions: 'finance_tracker_transactions',
  budgets: 'finance_tracker_budgets',
  monthlyBudget: 'finance_tracker_monthly_budget',
  baseCurrency: 'finance_tracker_base_currency',
  displayCurrency: 'finance_tracker_display_currency',
}

// Start completely empty (no demo data).
const initialTransactions = []
const initialBudgets = []

function readStorageJSON(key, fallback) {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

function safeId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `tx_${Date.now()}_${Math.random().toString(16).slice(2)}`
}

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useState(() =>
    readStorageJSON(STORAGE_KEYS.transactions, initialTransactions),
  )
  const [budgets, setBudgets] = useState(() =>
    readStorageJSON(STORAGE_KEYS.budgets, initialBudgets),
  )
  const [monthlyBudget, setMonthlyBudget] = useState(() =>
    Number(readStorageJSON(STORAGE_KEYS.monthlyBudget, 0) || 0),
  )
  const [baseCurrency, setBaseCurrency] = useState(() =>
    readStorageJSON(STORAGE_KEYS.baseCurrency, 'INR'),
  )
  const [displayCurrency, setDisplayCurrency] = useState(() =>
    readStorageJSON(STORAGE_KEYS.displayCurrency, 'INR'),
  )
  const [exchangeRates, setExchangeRates] = useState({})
  const [currencyLoading, setCurrencyLoading] = useState(false)

  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const addTransaction = useCallback((tx) => {
    setTransactions((prev) => [
      {
        ...tx,
        id: safeId(),
        isRecurring: Boolean(tx.isRecurring),
        recurrence: tx.recurrence || 'monthly',
      },
      ...prev,
    ])
  }, [])

  const updateTransaction = useCallback((transactionId, updates) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === transactionId
          ? {
              ...t,
              ...updates,
              isRecurring:
                updates.isRecurring === undefined
                  ? Boolean(t.isRecurring)
                  : Boolean(updates.isRecurring),
              recurrence: updates.recurrence || t.recurrence || 'monthly',
            }
          : t,
      ),
    )
  }, [])

  const deleteTransaction = useCallback((transactionId) => {
    setTransactions((prev) => prev.filter((t) => t.id !== transactionId))
  }, [])

  const setBudgetForCategory = useCallback((category, limit) => {
    if (!category) return
    const cleanCategory = String(category).trim()
    if (!cleanCategory) return

    setBudgets((prev) => {
      const existing = prev.find((b) => b.category === cleanCategory)
      if (existing) {
        return prev.map((b) =>
          b.category === cleanCategory ? { ...b, limit: Number(limit || 0) } : b,
        )
      }
      return [...prev, { id: safeId(), category: cleanCategory, limit: Number(limit || 0) }]
    })
  }, [])

  const removeBudget = useCallback((budgetId) => {
    setBudgets((prev) => prev.filter((b) => b.id !== budgetId))
  }, [])

  const refreshExchangeRates = useCallback(async () => {
    setCurrencyLoading(true)
    try {
      const rates = await fetchExchangeRates(baseCurrency)
      setExchangeRates(rates)
    } catch {
      // Keep rates unchanged if provider is unavailable.
    } finally {
      setCurrencyLoading(false)
    }
  }, [baseCurrency])

  const syncFromServer = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const [txRes, budgetRes] = await Promise.all([
        api.get('/transactions'),
        api.get('/budgets'),
      ])

      const nextTransactions = Array.isArray(
        txRes?.data?.transactions ?? txRes?.data,
      )
        ? txRes.data.transactions ?? txRes.data
        : []
      const nextBudgets = Array.isArray(
        budgetRes?.data?.budgets ?? budgetRes?.data,
      )
        ? budgetRes.data.budgets ?? budgetRes.data
        : []

      setTransactions(nextTransactions)
      setBudgets(nextBudgets)
    } catch (e) {
      setError(
        (e && typeof e === 'object' && 'message' in e && e.message) ||
          'Could not load data from server.',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshExchangeRates()
  }, [refreshExchangeRates])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEYS.budgets, JSON.stringify(budgets))
  }, [budgets])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEYS.monthlyBudget, JSON.stringify(monthlyBudget))
  }, [monthlyBudget])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEYS.baseCurrency, JSON.stringify(baseCurrency))
  }, [baseCurrency])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(
      STORAGE_KEYS.displayCurrency,
      JSON.stringify(displayCurrency),
    )
  }, [displayCurrency])

  const summaries = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0)
    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0)

    const net = income - expenses
    const savingsRate = income > 0 ? (net / income) * 100 : 0

    const spendingByCategory = transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => {
        const key = t.category || 'Uncategorized'
        acc[key] = (acc[key] || 0) + Number(t.amount || 0)
        return acc
      }, {})

    const byMonth = transactions.reduce((acc, tx) => {
      const month = String(tx.date || '').slice(0, 7)
      if (!month) return acc
      if (!acc[month]) {
        acc[month] = { month, income: 0, expense: 0 }
      }
      if (tx.type === 'income') acc[month].income += Number(tx.amount || 0)
      if (tx.type === 'expense') acc[month].expense += Number(tx.amount || 0)
      return acc
    }, {})
    const monthlySeries = Object.values(byMonth).sort((a, b) =>
      String(a.month).localeCompare(String(b.month)),
    )

    return {
      income,
      expenses,
      net,
      savingsRate,
      spendingByCategory,
      monthlySeries,
    }
  }, [transactions])

  const budgetUtilization = useMemo(() => {
    const spendingByCategory = summaries.spendingByCategory
    return budgets.map((b) => {
      const spent = Number(spendingByCategory[b.category] || 0)
      const limit = Number(b.limit || 0)
      const utilization = limit > 0 ? (spent / limit) * 100 : 0
      return { ...b, spent, limit, utilization }
    })
  }, [budgets, summaries.spendingByCategory])

  const budgetOverview = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7)
    const totalSpending = transactions
      .filter(
        (t) => t.type === 'expense' && String(t.date || '').slice(0, 7) === currentMonth,
      )
      .reduce((sum, t) => sum + Number(t.amount || 0), 0)
    const remainingBudget = Number(monthlyBudget || 0) - totalSpending
    const percentageUsed =
      Number(monthlyBudget || 0) > 0
        ? (totalSpending / Number(monthlyBudget || 0)) * 100
        : 0
    return {
      month: currentMonth,
      totalSpending,
      remainingBudget,
      percentageUsed,
    }
  }, [transactions, monthlyBudget])

  const convertAmount = useCallback(
    (amount) => {
      const numeric = Number(amount || 0)
      if (displayCurrency === baseCurrency) return numeric
      const rate = Number(exchangeRates?.[displayCurrency] || 0)
      return rate > 0 ? numeric * rate : numeric
    },
    [baseCurrency, displayCurrency, exchangeRates],
  )

  const value = useMemo(
    () => ({
      transactions,
      budgets,
      loading,
      error,
      currencyLoading,
      summaries,
      budgetUtilization,
      budgetOverview,
      monthlyBudget,
      baseCurrency,
      displayCurrency,
      exchangeRates,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      setBudgetForCategory,
      removeBudget,
      setMonthlyBudget,
      setBaseCurrency,
      setDisplayCurrency,
      refreshExchangeRates,
      convertAmount,
      syncFromServer,
    }),
    [
      transactions,
      budgets,
      loading,
      error,
      currencyLoading,
      summaries,
      budgetUtilization,
      budgetOverview,
      monthlyBudget,
      baseCurrency,
      displayCurrency,
      exchangeRates,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      setBudgetForCategory,
      removeBudget,
      setMonthlyBudget,
      refreshExchangeRates,
      convertAmount,
      syncFromServer,
    ],
  )

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}

export function useFinance() {
  const ctx = useContext(FinanceContext)
  if (!ctx) throw new Error('useFinance must be used within FinanceProvider')
  return ctx
}

