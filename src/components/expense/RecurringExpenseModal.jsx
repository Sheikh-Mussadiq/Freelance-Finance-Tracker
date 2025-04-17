import React, { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { format, addDays, addWeeks, addMonths, addYears } from 'date-fns'

const RecurringExpenseModal = ({ isOpen, onClose, expense, onSubmit }) => {
  const [formData, setFormData] = useState({
    isRecurring: false,
    recurrencePattern: 'monthly',
    recurrenceEndDate: ''
  })

  useEffect(() => {
    if (expense) {
      setFormData({
        isRecurring: expense.isRecurring || false,
        recurrencePattern: expense.recurrencePattern || 'monthly',
        recurrenceEndDate: expense.recurrenceEndDate || ''
      })
    }
  }, [expense])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const getNextOccurrence = (date, pattern) => {
    const baseDate = new Date(date)
    switch (pattern) {
      case 'daily':
        return format(addDays(baseDate, 1), 'MMM d, yyyy')
      case 'weekly':
        return format(addWeeks(baseDate, 1), 'MMM d, yyyy')
      case 'monthly':
        return format(addMonths(baseDate, 1), 'MMM d, yyyy')
      case 'yearly':
        return format(addYears(baseDate, 1), 'MMM d, yyyy')
      default:
        return 'Not recurring'
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Recurring Expense Settings"
    >
      <form onSubmit={handleSubmit}>
        <div className="p-4 space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isRecurring"
              name="isRecurring"
              checked={formData.isRecurring}
              onChange={handleInputChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="isRecurring" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Make this a recurring expense
            </label>
          </div>

          {formData.isRecurring && (
            <>
              <div>
                <label htmlFor="recurrencePattern" className="label">Recurrence Pattern</label>
                <select
                  id="recurrencePattern"
                  name="recurrencePattern"
                  value={formData.recurrencePattern}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div>
                <label htmlFor="recurrenceEndDate" className="label">End Date (Optional)</label>
                <input
                  type="date"
                  id="recurrenceEndDate"
                  name="recurrenceEndDate"
                  value={formData.recurrenceEndDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="input"
                />
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Recurrence Preview
                </h4>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>Next occurrence: {getNextOccurrence(expense?.date || new Date(), formData.recurrencePattern)}</p>
                  <p>Pattern: {formData.recurrencePattern}</p>
                  {formData.recurrenceEndDate && (
                    <p>Ends on: {format(new Date(formData.recurrenceEndDate), 'MMM d, yyyy')}</p>
                  )}
                </div>
              </div>
            </>
          )}
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
            Save Settings
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default RecurringExpenseModal