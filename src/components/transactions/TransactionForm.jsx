import { yupResolver } from '@hookform/resolvers/yup'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { formatCurrency, formatDate } from '../../utils/format.js'

function IncomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2v20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
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
      <path
        d="M12 22V2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
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

const schema = yup.object({
  title: yup.string().trim().min(1, 'Title is required').max(80).required('Title is required'),
  amount: yup
    .number()
    .typeError('Amount is required')
    .positive('Amount must be greater than 0')
    .required('Amount is required'),
  category: yup.string().trim().min(1, 'Category is required').max(60).required('Category is required'),
  date: yup
    .string()
    .required('Date is required')
    .test('valid-date', 'Invalid date', (value) => {
      if (!value) return false
      const d = new Date(value)
      return !Number.isNaN(d.getTime())
    }),
  type: yup.string().oneOf(['income', 'expense']).required('Type is required'),
  notes: yup.string().trim().max(500, 'Notes are too long').optional().default(''),
  isRecurring: yup.boolean().default(false),
  recurrence: yup
    .string()
    .oneOf(['weekly', 'monthly', 'yearly'])
    .default('monthly'),
})

export default function TransactionForm({
  mode = 'create',
  initialValues,
  onSubmit,
  submitLabel = 'Save Transaction',
  onCancel,
}) {
  const navigate = useNavigate()

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), [])

  const defaultValues = useMemo(
    () => ({
      title: initialValues?.title || '',
      amount: initialValues?.amount ?? '',
      category: initialValues?.category || '',
      date: initialValues?.date || todayStr,
      type: initialValues?.type || 'expense',
      notes: initialValues?.notes || '',
      isRecurring: Boolean(initialValues?.isRecurring),
      recurrence: initialValues?.recurrence || 'monthly',
    }),
    [initialValues, todayStr],
  )

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues,
  })

  const watchType = watch('type')
  const watchAmount = watch('amount')
  const watchTitle = watch('title')
  const watchCategory = watch('category')
  const watchDate = watch('date')
  const watchRecurring = watch('isRecurring')

  const previewColor = watchType === 'income' ? 'var(--secondary)' : '#ef4444'
  const previewIcon = watchType === 'income' ? <IncomeIcon /> : <ExpenseIcon />

  const sign = watchType === 'income' ? '+' : '-'
  const amountOk = Number.isFinite(Number(watchAmount)) && Number(watchAmount) > 0
  const formattedAmount = amountOk ? formatCurrency(watchAmount) : '—'
  const previewAmountText = amountOk ? `${sign} ${formattedAmount}` : '—'

  const cancel = () => {
    if (onCancel) onCancel()
    else navigate('/transactions')
  }

  const submit = (values) => {
    onSubmit(values)
  }

  return (
    <>
      <div className="rfPageHeader">
        <div className="rfPageHeader__titles">
          <h2>{mode === 'edit' ? 'Edit Transaction' : 'New Transaction'}</h2>
          <p>
            {mode === 'edit'
              ? 'Update fields to keep analytics accurate.'
              : 'Add income or expenses and see analytics update instantly.'}
          </p>
        </div>
      </div>

      <form className="rfForm" onSubmit={handleSubmit(submit)}>
        <div className="rfField rfField--full">
          <div
            className="rfTxPreview"
            style={{
              borderColor: previewColor,
            }}
          >
            <div className="rfTxPreview__left">
              <div className="rfTxPreview__icon" style={{ color: previewColor }}>
                {previewIcon}
              </div>
              <div>
                <div className="rfTxPreview__title">
                  <span style={{ color: previewColor, fontWeight: 950 }}>
                    {previewAmountText}
                  </span>
                </div>
                <div className="rfTxPreview__meta">
                  <span>{watchTitle?.trim() ? watchTitle : 'Untitled'}</span>
                  <span>•</span>
                  <span>{watchCategory?.trim() ? watchCategory : 'Category'}</span>
                  <span>•</span>
                  <span>{formatDate(watchDate) || watchDate}</span>
                </div>
              </div>
            </div>
            {watchType === 'expense' ? (
              <div className="rfTxPreview__tag rfTxPreview__tag--expense">Expense</div>
            ) : (
              <div className="rfTxPreview__tag rfTxPreview__tag--income">Income</div>
            )}
            {watchRecurring ? (
              <div className="rfTxPreview__tag rfTxPreview__tag--recurring">Recurring</div>
            ) : null}
          </div>
        </div>

        <div className="rfField">
          <label className="rfLabel" htmlFor="txTitle">
            Title
          </label>
          <input id="txTitle" className="rfInput" {...register('title')} />
          {errors.title ? (
            <div className="rfFieldError" role="alert">
              {errors.title.message}
            </div>
          ) : null}
        </div>

        <div className="rfField">
          <label className="rfLabel" htmlFor="txAmount">
            Amount (INR)
          </label>
          <input
            id="txAmount"
            className="rfInput"
            type="number"
            step="0.01"
            inputMode="decimal"
            placeholder="0.00"
            {...register('amount')}
          />
          {errors.amount ? (
            <div className="rfFieldError" role="alert">
              {errors.amount.message}
            </div>
          ) : null}
        </div>

        <div className="rfField">
          <label className="rfLabel" htmlFor="txCategory">
            Category
          </label>
          <input id="txCategory" className="rfInput" {...register('category')} />
          {errors.category ? (
            <div className="rfFieldError" role="alert">
              {errors.category.message}
            </div>
          ) : null}
        </div>

        <div className="rfField">
          <label className="rfLabel" htmlFor="txDate">
            Date
          </label>
          <input id="txDate" className="rfInput" type="date" {...register('date')} />
          {errors.date ? (
            <div className="rfFieldError" role="alert">
              {errors.date.message}
            </div>
          ) : null}
        </div>

        <div className="rfField">
          <label className="rfLabel" htmlFor="txType">
            Type
          </label>
          <select id="txType" className="rfSelect" {...register('type')}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          {errors.type ? (
            <div className="rfFieldError" role="alert">
              {errors.type.message}
            </div>
          ) : null}
        </div>

        <div className="rfField rfField--full">
          <label className="rfLabel" htmlFor="txNotes">
            Notes (optional)
          </label>
          <textarea id="txNotes" className="rfTextarea" {...register('notes')} />
          {errors.notes ? (
            <div className="rfFieldError" role="alert">
              {errors.notes.message}
            </div>
          ) : null}
        </div>

        <div className="rfField">
          <label className="rfLabel" htmlFor="txRecurring">
            Recurring transaction
          </label>
          <input id="txRecurring" type="checkbox" {...register('isRecurring')} />
        </div>

        <div className="rfField">
          <label className="rfLabel" htmlFor="txRecurrence">
            Recurring frequency
          </label>
          <select
            id="txRecurrence"
            className="rfSelect"
            {...register('recurrence')}
            disabled={!watchRecurring}
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div
          className="rfField rfField--full"
          style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}
        >
          <button className="rfBtn" type="button" onClick={cancel} disabled={isSubmitting}>
            Cancel
          </button>
          <button
            className="rfBtn rfBtn--primary"
            type="submit"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? 'Saving...' : submitLabel}
          </button>
        </div>
      </form>
    </>
  )
}

