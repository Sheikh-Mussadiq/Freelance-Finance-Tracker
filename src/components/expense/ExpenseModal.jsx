import React from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { CloseIcon } from '../icons/Icons'

const ExpenseModal = ({ 
  isOpen, 
  onClose, 
  formData, 
  handleFormChange,
  handleSubmit,
  currentExpense,
  expenseCategories,
  accounts 
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={currentExpense ? 'Edit Expense' : 'Add New Expense'}
    >
      <form onSubmit={handleSubmit}>
        <div className="p-4 space-y-4">
          <div>
            <label htmlFor="name" className="label">Description</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              className="input"
              placeholder="e.g., Office Supplies"
              required
            />
          </div>
          <div>
            <label htmlFor="amount" className="label">Amount ($)</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleFormChange}
              className="input"
              step="0.01"
              min="0"
              placeholder="0.00"
              required
            />
          </div>
          <div>
            <label htmlFor="date" className="label">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleFormChange}
              className="input"
              required
            />
          </div>
          <div>
            <label htmlFor="category" className="label">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleFormChange}
              className="input"
              required
            >
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
              value={formData.account}
              onChange={handleFormChange}
              className="input"
              required
            >
              {accounts.map(account => (
                <option key={account.id} value={account.name}>{account.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700 space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
          >
            {currentExpense ? 'Update Expense' : 'Add Expense'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default ExpenseModal