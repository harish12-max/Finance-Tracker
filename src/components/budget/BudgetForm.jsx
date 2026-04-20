import { useState } from 'react'

export default function BudgetForm({ onSave }) {
  const [category, setCategory] = useState('')
  const [limit, setLimit] = useState('')

  const submit = (event) => {
    event.preventDefault()
    onSave(category, Number(limit || 0))
    setCategory('')
    setLimit('')
  }

  return (
    <form className="rfBudgetForm" onSubmit={submit}>
      <label className="rfField">
        <span className="rfLabel">Category</span>
        <input
          className="rfInput"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          placeholder="e.g. Groceries"
          required
        />
      </label>
      <label className="rfField">
        <span className="rfLabel">Limit</span>
        <input
          className="rfInput"
          type="number"
          min="0"
          step="0.01"
          value={limit}
          onChange={(event) => setLimit(event.target.value)}
          placeholder="0.00"
          required
        />
      </label>
      <button type="submit" className="rfBtn rfBtn--primary">
        Save Budget
      </button>
    </form>
  )
}
