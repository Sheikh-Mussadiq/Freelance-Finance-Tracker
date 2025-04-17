import React from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import EmptyState from '../ui/EmptyState'
import { ExpensesEmptyIcon, SearchEmptyIcon } from '../icons/EmptyStateIcons'
import { EditIcon, DeleteIcon, RecurringIcon } from '../icons/Icons'
import Tooltip from '../ui/Tooltip'

const tableVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } }
}

const ExpenseList = ({ 
  expenses, 
  onEdit, 
  onDelete, 
  onRecurring,
  formatCurrency,
  openAddModal 
}) => {
  return (
    <motion.div 
      className="overflow-x-auto"
      variants={tableVariants}
      initial="hidden"
      animate="visible"
    >
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Description
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Date
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Category
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Account
            </th>
            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {expenses.length === 0 ? (
            <tr>
              <td colSpan="6">
                <EmptyState
                  icon={ExpensesEmptyIcon}
                  title="No expenses recorded"
                  description="Start tracking your business expenses by adding your first expense."
                  action={
                    <button
                      onClick={openAddModal}
                      className="btn-primary inline-flex items-center space-x-2"
                    >
                      <span>Add Expense</span>
                    </button>
                  }
                />
              </td>
            </tr>
          ) : expenses.length > 0 ? (
            expenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {expense.name}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {expense.date ? format(new Date(expense.date), 'MMM d, yyyy') : 'Not set'}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                    {expense.category}
                  </span>
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {expense.account}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-right font-medium text-red-600 dark:text-red-400">
                  {formatCurrency(expense.amount)}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Tooltip content="Edit Expense">
                      <button
                        onClick={() => onEdit(expense)}
                        className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <EditIcon />
                      </button>
                    </Tooltip>
                    <Tooltip content="Recurring Settings">
                      <button
                        onClick={() => onRecurring(expense)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 p-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                      </button>
                    </Tooltip>
                    <Tooltip content="Delete Expense">
                      <button
                        onClick={() => onDelete(expense.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900"
                      >
                        <DeleteIcon />
                      </button>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">
                <EmptyState
                  icon={SearchEmptyIcon}
                  title="No matching expenses"
                  description="Try adjusting your search terms or filters to find what you're looking for."
                  size="small"
                />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </motion.div>
  )
}

export default ExpenseList