import Card from '../components/ui/Card.jsx'
import { useFinance } from '../context/FinanceContext.jsx'
import { formatCurrency } from '../utils/format.js'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import EmptyState from '../components/ui/EmptyState.jsx'

export default function AnalyticsPage() {
  const { summaries, displayCurrency, convertAmount } = useFinance()

  const spendingEntries = Object.entries(summaries.spendingByCategory)
    .map(([category, amount]) => ({
      category,
      amount: Number(amount || 0),
    }))
    .sort((a, b) => b.amount - a.amount)

  const maxSpending = spendingEntries[0]?.amount || 0

  const months = summaries.monthlySeries.map((m) => ({
    ...m,
    net: m.income - m.expense,
    incomeConverted: convertAmount(m.income),
    expenseConverted: convertAmount(m.expense),
  }))

  return (
    <div className="rfPage">
      <div className="rfPageHeader">
        <div className="rfPageHeader__titles">
          <h2>Analytics</h2>
          <p>Expense insights and budget trends (demo analytics from transactions).</p>
        </div>
      </div>

      <div className="rfSectionGrid">
        <div className="rfCol-6">
          <Card title="Spending by Category" subtitle="Expenses grouped and ranked">
            {spendingEntries.length === 0 ? (
              <EmptyState title="No expense transactions yet" description="Add expenses for chart insights." />
            ) : (
              <div className="rfBars">
                {spendingEntries.slice(0, 8).map((c) => {
                  const pct = maxSpending > 0 ? (c.amount / maxSpending) * 100 : 0
                  return (
                    <div key={c.category} className="rfBarRow">
                      <div className="rfBarLabel">{c.category}</div>
                      <div className="rfBarTrack" aria-hidden="true">
                        <div
                          className="rfBarFill"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="rfBarValue">
                        {formatCurrency(convertAmount(c.amount), displayCurrency)}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
        </div>

        <div className="rfCol-6">
          <Card title="Monthly Trend" subtitle="Income, expense and net over time">
            {months.length ? (
              <div className="rfChartWrap">
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={months}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="incomeConverted" name="Income" stroke="#22c55e" />
                    <Line type="monotone" dataKey="expenseConverted" name="Expense" stroke="#ef4444" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState title="Not enough data to plot" description="Add transactions across months." />
            )}
          </Card>
        </div>
      </div>

      <div className="rfSectionGrid" style={{ marginTop: 16 }}>
        <div className="rfCol-12">
          <Card title="Income vs Expense" subtitle="Monthly comparison">
            {months.length === 0 ? (
              <EmptyState title="No monthly data" description="Charts will appear after transactions." />
            ) : (
              <div className="rfChartWrap">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={months}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="incomeConverted" name="Income" fill="#22c55e" />
                    <Bar dataKey="expenseConverted" name="Expense" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

