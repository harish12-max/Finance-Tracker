import Card from '../components/ui/Card.jsx'
import { useFinance } from '../context/FinanceContext.jsx'
import { formatCurrency } from '../utils/format.js'
import BudgetForm from '../components/budget/BudgetForm.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import { toast } from 'react-toastify'

export default function BudgetPage() {
  const {
    budgetUtilization,
    budgetOverview,
    monthlyBudget,
    setMonthlyBudget,
    setBudgetForCategory,
    removeBudget,
  } = useFinance()

  return (
    <div className="rfPage">
      <div className="rfPageHeader">
        <div className="rfPageHeader__titles">
          <h2>Budget</h2>
          <p>Category limits with utilization and remaining amounts.</p>
        </div>
      </div>

      <div className="rfCardsGrid">
        <div className="rfCol-4">
          <Card
            tone="accent"
            title={`Monthly Budget (${budgetOverview.month})`}
            value={formatCurrency(monthlyBudget)}
          />
        </div>
        <div className="rfCol-4">
          <Card
            tone="primary"
            title="Total Spending"
            value={formatCurrency(budgetOverview.totalSpending)}
          />
        </div>
        <div className="rfCol-4">
          <Card
            tone={budgetOverview.remainingBudget >= 0 ? 'secondary' : 'accent'}
            title="Remaining Budget"
            value={formatCurrency(budgetOverview.remainingBudget)}
            subtitle={`${budgetOverview.percentageUsed.toFixed(1)}% used`}
          />
        </div>
      </div>

      <Card title="Set Monthly Budget" subtitle="Track current month usage">
        <div className="rfBudgetForm">
          <label className="rfField">
            <span className="rfLabel">Monthly limit</span>
            <input
              className="rfInput"
              type="number"
              min="0"
              step="0.01"
              value={monthlyBudget}
              onChange={(event) => setMonthlyBudget(Number(event.target.value || 0))}
            />
          </label>
          <button
            type="button"
            className="rfBtn rfBtn--primary"
            onClick={() => toast.success('Monthly budget updated')}
          >
            Save Monthly Budget
          </button>
        </div>
      </Card>

      <Card title="Category Budget Limits" subtitle="Create or update category budgets">
        <BudgetForm
          onSave={(category, limit) => {
            setBudgetForCategory(category, limit)
            toast.success('Category budget saved')
          }}
        />
      </Card>

      <div className="rfCardsGrid">
        {budgetUtilization.map((b) => {
          const pct = Math.max(0, Math.min(100, b.utilization || 0))
          const remaining = (Number(b.limit || 0) - Number(b.spent || 0)) || 0
          return (
            <div key={b.id} className="rfCol-4">
              <Card
                tone={pct <= 60 ? 'secondary' : pct <= 90 ? 'primary' : 'accent'}
                title={b.category}
                value={`${formatCurrency(b.spent)}`}
                subtitle={`Limit: ${formatCurrency(b.limit)} • Remaining: ${formatCurrency(remaining)}`}
              >
                <div className="rfProgressWrap">
                  <div className="rfProgressBar" aria-label={`Utilization ${pct.toFixed(0)}%`}>
                    <div
                      className="rfProgressFill"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, gap: 10 }}>
                    <div className="rfBarLabel">{pct.toFixed(0)}%</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        type="button"
                        className="rfBtn rfBtn--danger rfBtn--sm"
                        onClick={() => {
                          removeBudget(b.id)
                          toast.success('Category budget removed')
                        }}
                      >
                        Remove
                      </button>
                      <div style={{ color: 'var(--muted)', fontWeight: 850, fontSize: 13 }}>
                        Used
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )
        })}

        {budgetUtilization.length === 0 ? (
          <div style={{ gridColumn: 'span 12' }}>
            <EmptyState title="No budgets configured" description="Add one to start tracking." />
          </div>
        ) : null}
      </div>
    </div>
  )
}

