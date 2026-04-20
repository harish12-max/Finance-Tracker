export default function TransactionFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  type,
  onTypeChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  sortBy,
  onSortByChange,
  clearFilters,
  categories,
  activeCount,
}) {
  return (
    <section className="rfFiltersPanel">
      <div className="rfFiltersPanel__top">
        <h3>Filters & Search</h3>
        <div className="rfRow">
          {activeCount > 0 ? (
            <span className="rfFilterBadge rfFilterBadge--active">
              {activeCount} active filter{activeCount > 1 ? 's' : ''}
            </span>
          ) : (
            <span className="rfFilterBadge">No active filters</span>
          )}
          <button type="button" className="rfBtn rfBtn--sm" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      </div>

      <div className="rfFiltersPanel__grid">
        <label className="rfField">
          <span className="rfLabel">Search title/notes</span>
          <input
            className="rfInput"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search transactions..."
          />
        </label>

        <label className="rfField">
          <span className="rfLabel">Category</span>
          <select
            className="rfSelect"
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <label className="rfField">
          <span className="rfLabel">Type</span>
          <select
            className="rfSelect"
            value={type}
            onChange={(event) => onTypeChange(event.target.value)}
          >
            <option value="">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>

        <label className="rfField">
          <span className="rfLabel">Sort by</span>
          <select
            className="rfSelect"
            value={sortBy}
            onChange={(event) => onSortByChange(event.target.value)}
          >
            <option value="date_desc">Date (Newest)</option>
            <option value="date_asc">Date (Oldest)</option>
            <option value="amount_desc">Amount (High to Low)</option>
            <option value="amount_asc">Amount (Low to High)</option>
            <option value="category_asc">Category (A-Z)</option>
            <option value="category_desc">Category (Z-A)</option>
          </select>
        </label>

        <label className="rfField">
          <span className="rfLabel">Date from</span>
          <input
            className="rfInput"
            type="date"
            value={dateFrom}
            onChange={(event) => onDateFromChange(event.target.value)}
          />
        </label>

        <label className="rfField">
          <span className="rfLabel">Date to</span>
          <input
            className="rfInput"
            type="date"
            value={dateTo}
            onChange={(event) => onDateToChange(event.target.value)}
          />
        </label>
      </div>
    </section>
  )
}
