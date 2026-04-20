import { NavLink } from 'react-router-dom'
import './layout.css'

export default function Sidebar({ items, isOpen, onClose }) {
  return (
    <>
      <div
        className={`rfSidebarOverlay ${isOpen ? 'rfSidebarOverlay--open' : ''}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      <aside className={`rfSidebar ${isOpen ? 'rfSidebar--open' : ''}`}>
        <div className="rfSidebar__brand">
          <div className="rfSidebar__brandMark" aria-hidden="true" />
          <div className="rfSidebar__brandText">
            <div className="rfSidebar__brandTitle">
              Personal Finance
            </div>
            <div className="rfSidebar__brandSub">Expense Analytics App</div>
          </div>
        </div>

        <nav className="rfSidebar__nav" aria-label="Primary navigation">
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => onClose?.()}
              className={({ isActive }) =>
                `rfSideLink ${isActive ? 'rfSideLink--active' : ''}`
              }
            >
              <span className={`rfSideLink__dot rfSideLink__dot--${item.tone}`} />
              <span className="rfSideLink__label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="rfSidebar__footer">
          <div className="rfSidebar__footerCard">
            <div className="rfSidebar__footerTitle">Tip</div>
            <div className="rfSidebar__footerBody">
              Add transactions to see analytics update instantly.
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

