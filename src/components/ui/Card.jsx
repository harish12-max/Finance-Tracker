import './card.css'

export default function Card({
  title,
  value,
  subtitle,
  tone = 'primary',
  children,
}) {
  return (
    <section className={`uiCard uiCard--${tone}`}>
      {(title || subtitle) && (
        <header className="uiCard__header">
          {title && <h2 className="uiCard__title">{title}</h2>}
          {subtitle && <p className="uiCard__subtitle">{subtitle}</p>}
        </header>
      )}

      {value !== undefined && value !== null && (
        <div className="uiCard__value">{value}</div>
      )}

      {children && <div className="uiCard__body">{children}</div>}
    </section>
  )
}

