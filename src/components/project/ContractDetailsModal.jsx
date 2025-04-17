import React from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { format } from 'date-fns'
import Badge from '../ui/Badge'

const ContractDetailsModal = ({ isOpen, onClose, project }) => {
  if (!project) return null

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'PKR',
      minimumFractionDigits: 2
    }).format(amount || 0)
  }

  // Helper function to get formatted payment terms
  const getPaymentTermsDisplay = (terms) => {
    const termMap = {
      'milestone': 'Milestone-based',
      'weekly': 'Weekly payments',
      'biweekly': 'Bi-weekly payments',
      'monthly': 'Monthly payments',
      'half-upfront': '50% upfront, 50% upon completion',
      'full-upfront': '100% upfront',
      'upon-completion': 'Payment upon completion'
    }
    return termMap[terms] || terms
  }

  // Get contract type specific details
  const getContractSpecificDetails = () => {
    if (project.contractType === 'hourly') {
      return (
        <div className="mt-2">
          <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Hourly Rate</span>
            <span className="font-medium">{formatCurrency(project.hourlyRate)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Hours Logged</span>
            <span className="font-medium">{project.hoursLogged || 0} hours</span>
          </div>
        </div>
      )
    } else if (project.contractType === 'monthly') {
      return (
        <div className="mt-2">
          <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Monthly Rate</span>
            <span className="font-medium">{formatCurrency(project.monthlyRate)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Contract Duration</span>
            <span className="font-medium">{project.contractDuration || 0} weeks</span>
          </div>
        </div>
      )
    }
    
    return (
      <div className="mt-2">
        <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
          <span className="text-gray-600 dark:text-gray-400">Fixed Price</span>
          <span className="font-medium">{formatCurrency(project.totalAmount)}</span>
        </div>
      </div>
    )
  }

  // Get contract type display text
  const getContractTypeDisplay = () => {
    if (project.contractType === 'hourly') {
      return 'Hourly Rate Contract'
    } else if (project.contractType === 'monthly') {
      return 'Monthly Rate Contract'
    } else {
      return 'Fixed Price Contract'
    }
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Contract Details"
      maxWidth="lg"
    >
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{project.name}</h3>
          <Badge variant={project.status === 'completed' ? 'success' : project.status === 'in-progress' ? 'info' : 'warning'}>
            {project.status === 'in-progress' ? 'In Progress' : 
             project.status === 'completed' ? 'Completed' : 'Pending'}
          </Badge>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h4 className="text-md font-medium mb-3">Contract Information</h4>
          
          <div className="space-y-4">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Contract Type</p>
              <p className="font-medium text-gray-900 dark:text-white">{getContractTypeDisplay()}</p>
            </div>
            
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Payment Terms</p>
              <p className="font-medium text-gray-900 dark:text-white">{getPaymentTermsDisplay(project.paymentTerms)}</p>
            </div>
            
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Contract Period</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {project.startDate ? format(new Date(project.startDate), 'MMM d, yyyy') : 'Not set'} - 
                {project.endDate ? format(new Date(project.endDate), ' MMM d, yyyy') : ' Not set'}
              </p>
            </div>
          </div>
          
          {getContractSpecificDetails()}
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h4 className="text-md font-medium mb-3">Financial Summary</h4>
          
          <div className="mt-2">
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Total Contract Value</span>
              <span className="font-medium">{formatCurrency(project.totalAmount)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Paid Amount</span>
              <span className="font-medium text-green-600 dark:text-green-400">{formatCurrency(project.paidAmount)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600 dark:text-gray-400">Remaining Balance</span>
              <span className="font-medium text-blue-600 dark:text-blue-400">{formatCurrency(project.totalAmount - project.paidAmount)}</span>
            </div>
          </div>
        </div>
        
        {project.payments && project.payments.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="text-md font-medium mb-3">Payment History</h4>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <th className="px-2 py-2">Date</th>
                    <th className="px-2 py-2">Description</th>
                    <th className="px-2 py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {project.payments.map(payment => (
                    <tr key={payment.id} className="text-gray-900 dark:text-white">
                      <td className="px-2 py-2 text-sm">{payment.date ? format(new Date(payment.date), 'MMM d, yyyy') : 'Not set'}</td>
                      <td className="px-2 py-2 text-sm">{payment.description}</td>
                      <td className="px-2 py-2 text-sm text-right text-green-600 dark:text-green-400">{formatCurrency(payment.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700">
        <Button onClick={onClose}>Close</Button>
      </div>
    </Modal>
  )
}

export default ContractDetailsModal