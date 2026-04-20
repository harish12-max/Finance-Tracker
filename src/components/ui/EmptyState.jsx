export default function EmptyState({ title, description }) {
  return (
    <div className="rfEmptyState">
      <div className="rfEmptyState__title">{title}</div>
      {description ? <div className="rfEmptyState__description">{description}</div> : null}
    </div>
  )
}
