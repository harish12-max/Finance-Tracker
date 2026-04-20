import { useFinance } from '../../context/FinanceContext.jsx'
import { toast } from 'react-toastify'

export default function Navbar({ title, onMenu }) {
  const { loading, error, syncFromServer } = useFinance()

  const handleSync = async () => {
    // syncFromServer already handles loading/error states.
    await syncFromServer()
    if (!error) toast.success('Data synced')
  }

  return (
    <header className="rfNavbar">
      <div className="rfNavbar__left">
        <button
          type="button"
          className="rfIconBtn rfHamburger"
          onClick={onMenu}
          aria-label="Open navigation menu"
        >
          <span aria-hidden="true">Menu</span>
        </button>

        <div className="rfNavbar__titleWrap">
          <h1 className="rfNavbar__title">{title}</h1>
          <p className="rfNavbar__subtitle">
            Personal Finance & Expense Analytics App
          </p>
        </div>
      </div>

      <div className="rfNavbar__right">
        {error ? (
          <span className="rfNavbar__error" role="status">
            {error}
          </span>
        ) : null}

        <button
          type="button"
          className="rfIconBtn"
          onClick={handleSync}
          disabled={loading}
        >
          {loading ? 'Syncing...' : 'Sync'}
        </button>
      </div>
    </header>
  )
}

