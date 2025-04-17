import React, { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'

const PaymentModal = ({ isOpen, onClose, project, onSubmit }) => {
  const [newPayment, setNewPayment] = useState({
    amount: '',
    date: '',
    description: ''
  })

  useEffect(() => {
    if (isOpen && project) {
      setNewPayment({
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
      })
    }
  }, [isOpen, project])

  const handlePaymentChange = (e) => {
    const { name, value } = e.target
    setNewPayment({
      ...newPayment,
      [name]: name === 'amount' ? parseFloat(value) || '' : value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (project && newPayment.amount > 0) {
      onSubmit(newPayment)
    }
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'PKR',
      minimumFractionDigits: 2
    }).format(amount)
  }

  if (!project) return null

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Add Payment for ${project.name}`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit}>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="amount" className="label">Amount ($)</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={newPayment.amount}
                onChange={handlePaymentChange}
                className="input"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label htmlFor="date" className="label">Payment Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={newPayment.date}
                onChange={handlePaymentChange}
                className="input"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="description" className="label">Description</label>
            <input
              type="text"
              id="description"
              name="description"
              value={newPayment.description}
              onChange={handlePaymentChange}
              className="input"
              placeholder="e.g., Milestone payment, Deposit, etc."
              required
            />
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Project Balance</p>
            <div className="flex justify-between mt-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {formatCurrency(project.totalAmount)}
              </p>
            </div>
            <div className="flex justify-between mt-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">Already Paid</p>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                {formatCurrency(project.paidAmount)}
              </p>
            </div>
            <div className="flex justify-between mt-1 pt-1 border-t border-gray-200 dark:border-gray-600">
              <p className="text-sm text-gray-500 dark:text-gray-400">Remaining</p>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {formatCurrency(project.totalAmount - project.paidAmount)}
              </p>
            </div>
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
            disabled={!newPayment.amount || !newPayment.date}
          >
            Record Payment
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default PaymentModal