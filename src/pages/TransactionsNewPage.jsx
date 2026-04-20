import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useTransactions } from '../hooks/useTransactions.js'
import TransactionForm from '../components/transactions/TransactionForm.jsx'

export default function TransactionsNewPage() {
  const navigate = useNavigate()
  const { addTransaction } = useTransactions()

  return (
    <TransactionForm
      mode="create"
      submitLabel="Add Transaction"
      onSubmit={(values) => {
        addTransaction({
          title: values.title,
          amount: Number(values.amount),
          category: values.category,
          date: values.date,
          type: values.type,
          notes: values.notes || '',
          isRecurring: Boolean(values.isRecurring),
          recurrence: values.recurrence || 'monthly',
        })
        toast.success('Transaction added')
        navigate('/transactions')
      }}
    />
  )
}

