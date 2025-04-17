import React, { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'

const HoursLogModal = ({ isOpen, onClose, project, onSubmit }) => {
  const [newHours, setNewHours] = useState(0)

  useEffect(() => {
    if (isOpen && project && project.contractType === 'hourly') {
      setNewHours(project.hoursLogged || 0)
    }
  }, [isOpen, project])

  const handleHoursChange = (e) => {
    setNewHours(parseFloat(e.target.value) || 0)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (project && project.contractType === 'hourly') {
      onSubmit(newHours)
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

  if (!project || project.contractType !== 'hourly') return null

  const totalValue = newHours * (project.hourlyRate || 0)

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Log Hours for ${project.name}`}
    >
      <form onSubmit={handleSubmit}>
        <div className="p-4 space-y-4">
          <div>
            <label htmlFor="hours" className="label">Total Hours Worked</label>
            <input
              type="number"
              id="hours"
              name="hours"
              value={newHours}
              onChange={handleHoursChange}
              className="input"
              min="0"
              step="0.5"
              required
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Enter the total hours worked on this project
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Hours Summary</p>
            <div className="flex justify-between mt-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">Hourly Rate</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {formatCurrency(project.hourlyRate || 0)}
              </p>
            </div>
            <div className="flex justify-between mt-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">Hours Logged</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {newHours} hours
              </p>
            </div>
            <div className="flex justify-between mt-1 pt-1 border-t border-gray-200 dark:border-gray-600">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Value</p>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {formatCurrency(totalValue)}
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
          >
            Update Hours
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default HoursLogModal