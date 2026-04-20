import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import TransactionForm from '../components/transactions/TransactionForm.jsx'
import { useFinance } from '../context/FinanceContext.jsx'

export default function TransactionsEditPage() {
  const navigate = useNavigate()
  const { transactionId } = useParams()
  const { transactions, updateTransaction } = useFinance()

  const transaction = useMemo(() => {
    return transactions.find((t) => t.id === transactionId)
  }, [transactions, transactionId])

  if (!transaction) {
    return (
      <div className="rfPage">
        <div className="rfPageHeader">
          <div className="rfPageHeader__titles">
            <h2>Edit Transaction</h2>
            <p>Transaction not found.</p>
          </div>
        </div>
        <Link className="rfBtn rfBtn--primary" to="/transactions">
          Back to Transactions
        </Link>
      </div>
    )
  }

  return (
    <TransactionForm
      mode="edit"
      submitLabel="Save Changes"
      initialValues={{
        title: transaction.title || '',
        amount: transaction.amount ?? '',
        category: transaction.category || '',
        date: transaction.date || '',
        type: transaction.type || 'expense',
        notes: transaction.notes || '',
        isRecurring: Boolean(transaction.isRecurring),
        recurrence: transaction.recurrence || 'monthly',
      }}
      onSubmit={(values) => {
        updateTransaction(transaction.id, {
          title: values.title,
          amount: Number(values.amount),
          category: values.category,
          date: values.date,
          type: values.type,
          notes: values.notes || '',
          isRecurring: Boolean(values.isRecurring),
          recurrence: values.recurrence || 'monthly',
        })
        toast.success('Transaction updated')
        navigate('/transactions')
      }}
      onCancel={() => navigate('/transactions')}
    />
  )
}

