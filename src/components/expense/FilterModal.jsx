import React from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'

const FilterModal = ({ 
  isOpen, 
  onClose, 
  filters, 
  handleFilterChange, 
  resetFilters,
  expenseCategories,
  accounts 
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Filter Expenses"
    >
      <div className="p-4 space-y-4">
        <div>
          <label htmlFor="category" className="label">Category</label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="input"
          >
            <option value="">All Categories</option>
            {expenseCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="account" className="label">Account</label>
          <select
            id="account"
            name="account"
            value={filters.account}
            onChange={handleFilterChange}
            className="input"
          >
            <option value="">All Accounts</option>
            {accounts.map(account => (
              <option key={account.id} value={account.name}>{account.name}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="dateFrom" className="label">Date From</label>
            <input
              type="date"
              id="dateFrom"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleFilterChange}
              className="input"
            />
          </div>
          <div>
            <label htmlFor="dateTo" className="label">Date To</label>
            <input
              type="date"
              id="dateTo"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleFilterChange}
              className="input"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="amountMin" className="label">Min Amount ($)</label>
            <input
              type="number"
              id="amountMin"
              name="amountMin"
              value={filters.amountMin}
              onChange={handleFilterChange}
              className="input"
              step="0.01"
              min="0"
              placeholder="0.00"
            />
          </div>
          <div>
            <label htmlFor="amountMax" className="label">Max Amount ($)</label>
            <input
              type="number"
              id="amountMax"
              name="amountMax"
              value={filters.amountMax}
              onChange={handleFilterChange}
              className="input"
              step="0.01"
              min="0"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700 space-x-3">
        <Button
          variant="outline"
          onClick={resetFilters}
        >
          Reset
        </Button>
        <Button
          variant="primary"
          onClick={onClose}
        >
          Apply Filters
        </Button>
      </div>
    </Modal>
  )
}

export default FilterModal