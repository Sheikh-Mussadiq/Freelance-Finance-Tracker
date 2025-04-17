import React, { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'

const BudgetModal = ({ isOpen, onClose, budget, onSubmit, categories }) => {
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    period: 'monthly',
    startDate: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    if (budget) {
      setFormData({
        category: budget.category,
        amount: budget.amount,
        period: budget.period,
        startDate: budget.startDate
      })
    } else {
      setFormData({
        category: categories[0],
        amount: '',
        period: 'monthly',
        startDate: new Date().toISOString().split('T')[0]
      })
    }
  }, [budget, categories])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || '' : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={budget ? 'Edit Budget' : 'Add Budget'}
    >
      <form onSubmit={handleSubmit}>
        <div className="p-4 space-y-4">
          <div>
            <label htmlFor="category" className="label">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="input"
              required
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="amount" className="label">Budget Amount ($)</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              className="input"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <label htmlFor="period" className="label">Budget Period</label>
            <select
              id="period"
              name="period"
              value={formData.period}
              onChange={handleInputChange}
              className="input"
              required
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div>
            <label htmlFor="startDate" className="label">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="input"
              required
            />
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
            {budget ? 'Update Budget' : 'Add Budget'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default BudgetModal