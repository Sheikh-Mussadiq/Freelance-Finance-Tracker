import React from 'react'
import { motion } from 'framer-motion'

const BudgetProgressBar = ({ spent, budget, showLabels = true }) => {
  const percentage = Math.min((spent / budget) * 100, 100)
  const remaining = Math.max(budget - spent, 0)

  // Determine color based on percentage
  const getColor = () => {
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="space-y-2">
      {showLabels && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Spent: {formatCurrency(spent)}
          </span>
          <span className="text-gray-600 dark:text-gray-400">
            Remaining: {formatCurrency(remaining)}
          </span>
        </div>
      )}
      
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${getColor()}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      
      {showLabels && (
        <div className="flex justify-end">
          <span className={`text-sm font-medium ${
            percentage >= 90 ? 'text-red-600 dark:text-red-400' :
            percentage >= 75 ? 'text-yellow-600 dark:text-yellow-400' :
            'text-green-600 dark:text-green-400'
          }`}>
            {Math.round(percentage)}% used
          </span>
        </div>
      )}
    </div>
  )
}

export default BudgetProgressBar