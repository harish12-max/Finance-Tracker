import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Card from '../components/ui/Card.jsx'
import { formatCurrency } from '../utils/format.js'
import { useFinance } from '../context/FinanceContext.jsx'
import { useTransactions } from '../hooks/useTransactions.js'
import { useDebounce } from '../hooks/useDebounce.js'
import TransactionFilters from '../components/transactions/TransactionFilters.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import LoadingState from '../components/ui/LoadingState.jsx'

function IncomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2v20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M6 8l6-6 6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ExpenseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 22V2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M6 16l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function TransactionsPage() {
  const navigate = useNavigate()
  const { summaries, displayCurrency, convertAmount } = useFinance()
  const { transactions, deleteTransaction, loading } = useTransactions()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [type, setType] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [sortBy, setSortBy] = useState('date_desc')
  const debouncedSearch = useDebounce(search)

  const categories = useMemo(() => {
    return [...new Set(transactions.map((tx) => tx.category).filter(Boolean))].sort((a, b) =>
      String(a).localeCompare(String(b)),
    )
  }, [transactions])

  const activeFilterCount = useMemo(() => {
    return [debouncedSearch, category, type, dateFrom, dateTo].filter(Boolean).length
  }, [debouncedSearch, category, type, dateFrom, dateTo])

  const sorted = useMemo(() => {
    const filtered = transactions.filter((tx) => {
      const text = `${tx.title || ''} ${tx.notes || ''}`.toLowerCase()
      const matchesSearch = debouncedSearch
        ? text.includes(debouncedSearch.toLowerCase())
        : true
      const matchesCategory = category ? tx.category === category : true
      const matchesType = type ? tx.type === type : true
      const matchesDateFrom = dateFrom ? String(tx.date || '') >= dateFrom : true
      const matchesDateTo = dateTo ? String(tx.date || '') <= dateTo : true
      return (
        matchesSearch &&
        matchesCategory &&
        matchesType &&
        matchesDateFrom &&
        matchesDateTo
      )
    })

    return filtered.sort((a, b) => {
      if (sortBy === 'date_asc') return String(a.date).localeCompare(String(b.date))
      if (sortBy === 'date_desc') return String(b.date).localeCompare(String(a.date))
      if (sortBy === 'amount_asc') return Number(a.amount || 0) - Number(b.amount || 0)
      if (sortBy === 'amount_desc') return Number(b.amount || 0) - Number(a.amount || 0)
      if (sortBy === 'category_asc') return String(a.category).localeCompare(String(b.category))
      if (sortBy === 'category_desc') return String(b.category).localeCompare(String(a.category))
      return 0
    })
  }, [transactions, debouncedSearch, category, type, dateFrom, dateTo, sortBy])

  const clearFilters = () => {
    setSearch('')
    setCategory('')
    setType('')
    setDateFrom('')
    setDateTo('')
    setSortBy('date_desc')
  }

  const onDelete = (id) => {
    const ok = window.confirm('Delete this transaction?')
    if (!ok) return
    deleteTransaction(id)
    toast.success('Transaction deleted')
  }

  return (
    <div className="rfPage">
      <div className="rfPageHeader">
        <div className="rfPageHeader__titles">
          <h2>Transactions</h2>
          <p>Track every income and expense item.</p>
        </div>
        <div className="rfRow" style={{ justifyContent: 'flex-end' }}>
          <Link className="rfBtn rfBtn--primary" to="/transactions/new">
            Add Transaction
          </Link>
        </div>
      </div>

      <div className="rfCardsGrid">
        <div className="rfCol-3">
          <Card tone="primary" title="Net (Income - Expenses)" value={formatCurrency(summaries.net)} />
        </div>
        <div className="rfCol-3">
          <Card tone="secondary" title="Income" value={formatCurrency(summaries.income)} />
        </div>
        <div className="rfCol-3">
          <Card tone="accent" title="Expenses" value={formatCurrency(summaries.expenses)} />
        </div>
        <div className="rfCol-3">
          <Card
            tone="primary"
            title="Count"
            value={String(transactions.length)}
            subtitle="Total transactions"
          />
        </div>
      </div>

      <Card
        title="All Transactions"
        subtitle="Edit or delete transactions anytime."
      >
        <TransactionFilters
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          type={type}
          onTypeChange={setType}
          dateFrom={dateFrom}
          onDateFromChange={setDateFrom}
          dateTo={dateTo}
          onDateToChange={setDateTo}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          clearFilters={clearFilters}
          categories={categories}
          activeCount={activeFilterCount}
        />

        {loading ? <LoadingState label="Loading transactions..." /> : null}
        {!loading && sorted.length === 0 ? (
          <EmptyState
            title="No transactions match your criteria"
            description="Try changing filters or add a new transaction."
          />
        ) : null}
        {!loading && sorted.length > 0 ? (
          <div className="rfTxGrid" aria-label="Transaction list">
            {sorted.map((t) => {
              const isIncome = t.type === 'income'
              const color = isIncome ? 'var(--secondary)' : '#ef4444'
              const amountSign = isIncome ? '+' : '-'
              const Icon = isIncome ? <IncomeIcon /> : <ExpenseIcon />
              const notesPreview = (t.notes || '').trim()

              return (
                <article key={t.id} className="rfTxCard">
                  <div className="rfTxCard__left">
                    <div className="rfTxCard__icon" style={{ color }}>
                      {Icon}
                    </div>
                    <div className="rfTxCard__meta">
                      <div className="rfTxCard__title">{t.title || 'Untitled'}</div>
                      <div className="rfTxCard__sub">
                        <span>{t.category || 'Category'}</span>
                        <span aria-hidden="true">•</span>
                        <span>{t.date}</span>
                      </div>
                      {notesPreview ? (
                        <div className="rfTxCard__notes">{notesPreview}</div>
                      ) : null}
                      {t.isRecurring ? (
                        <div className="rfTxCard__tagRecurring">
                          Recurring ({t.recurrence || 'monthly'})
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="rfTxCard__right">
                    <div className="rfTxCard__amount" style={{ color }}>
                      {amountSign}
                      {formatCurrency(convertAmount(t.amount), displayCurrency)}
                    </div>
                    <div className="rfTxCard__actions">
                      <button
                        type="button"
                        className="rfBtn rfBtn--primary rfBtn--sm"
                        onClick={() =>
                          navigate(`/transactions/edit/${encodeURIComponent(t.id)}`)
                        }
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="rfBtn rfBtn--danger rfBtn--sm"
                        onClick={() => onDelete(t.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : null}
      </Card>
    </div>
  )
}

