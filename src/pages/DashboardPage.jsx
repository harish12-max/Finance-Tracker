import { Link } from 'react-router-dom'
import Card from '../components/ui/Card.jsx'
import { useFinance } from '../context/FinanceContext.jsx'
import { formatCurrency } from '../utils/format.js'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import EmptyState from '../components/ui/EmptyState.jsx'

function sortByDateDesc(a, b) {
  return String(b.date).localeCompare(String(a.date))
}

export default function DashboardPage() {
  const {
    transactions,
    summaries,
    budgetUtilization,
    displayCurrency,
    setDisplayCurrency,
    convertAmount,
  } = useFinance()

  const recentTransactions = [...transactions]
    .sort(sortByDateDesc)
    .slice(0, 5)

  const avgUtil =
    budgetUtilization.length > 0
      ? budgetUtilization.reduce((sum, b) => sum + (b.utilization || 0), 0) /
        budgetUtilization.length
      : 0

  const utilTone =
    avgUtil <= 60 ? 'secondary' : avgUtil <= 90 ? 'primary' : 'accent'
  const pieData = Object.entries(summaries.spendingByCategory).map(([name, amount]) => ({
    name,
    value: Number(amount || 0),
  }))
  const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#14b8a6', '#8b5cf6', '#f43f5e']

  return (
    <div>
      <div className="rfPageHeader">
        <div className="rfPageHeader__titles">
          <h2>Dashboard</h2>
          <p>Snapshot of your income, spending, and budget health.</p>
        </div>

        <div className="rfRow">
          <select
            className="rfSelect"
            value={displayCurrency}
            onChange={(event) => setDisplayCurrency(event.target.value)}
            aria-label="Display currency"
          >
            <option value="INR">INR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="JPY">JPY</option>
          </select>
          <Link className="rfBtn rfBtn--primary" to="/transactions/new">
            Add Transaction
          </Link>
        </div>
      </div>

      <div className="rfCardsGrid">
        <div className="rfCol-3">
          <Card
            tone="primary"
            title="Total Balance"
            value={formatCurrency(convertAmount(summaries.net), displayCurrency)}
            subtitle={`Savings rate: ${summaries.savingsRate.toFixed(1)}%`}
          />
        </div>
        <div className="rfCol-3">
          <Card
            tone="secondary"
            title="Total Income"
            value={formatCurrency(convertAmount(summaries.income), displayCurrency)}
          />
        </div>
        <div className="rfCol-3">
          <Card
            tone="accent"
            title="Total Expenses"
            value={formatCurrency(convertAmount(summaries.expenses), displayCurrency)}
          />
        </div>
        <div className="rfCol-3">
          <Card
            tone={utilTone}
            title="Budget Health"
            value={`${avgUtil.toFixed(0)}%`}
            subtitle="Average category utilization"
          />
        </div>
      </div>

      <div className="rfSectionGrid" style={{ marginTop: 10 }}>
        <div className="rfCol-6">
          <Card title="Recent Transactions" subtitle="Latest activity">
            <table className="rfTable" aria-label="Recent transactions">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((t) => (
                  <tr key={t.id}>
                    <td>{t.date}</td>
                    <td>{t.title || 'Untitled'}</td>
                    <td>{t.category || 'Uncategorized'}</td>
                    <td>
                      {t.type === 'income' ? (
                        <span style={{ color: 'var(--secondary)' }}>
                          +{formatCurrency(convertAmount(t.amount), displayCurrency)}
                        </span>
                      ) : (
                        <span style={{ color: '#ef4444' }}>
                          -{formatCurrency(convertAmount(t.amount), displayCurrency)}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {recentTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ color: 'var(--muted)' }}>
                      No transactions yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
            <div style={{ marginTop: 12 }}>
              <Link className="rfBtn" to="/transactions">
                View all transactions
              </Link>
            </div>
          </Card>
        </div>

        <div className="rfCol-6">
          <Card title="Category-wise Spending" subtitle="Expense split by category">
            {pieData.length === 0 ? (
              <EmptyState title="No expense data yet" description="Add expenses to render charts." />
            ) : (
              <div className="rfChartWrap">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={92} label>
                      {pieData.map((entry, index) => (
                        <Cell key={entry.name} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

