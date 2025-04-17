import { useState, useEffect } from 'react'
import { differenceInWeeks, addWeeks } from 'date-fns'

/**
 * Custom hook for handling contract calculations
 * 
 * @param {Object} initialValues - Initial contract values
 * @returns {Object} Contract calculations and utility functions
 */
const useContractCalculations = (initialValues = {}) => {
  const [contract, setContract] = useState({
    contractType: 'fixed',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    contractDuration: '',
    hourlyRate: '',
    hoursLogged: 0,
    monthlyRate: '',
    totalAmount: '',
    ...initialValues
  })

  // Update contract value
  const updateContractValue = (field, value) => {
    let updates = { [field]: value }
    
    // Special handling for contract type changes
    if (field === 'contractType') {
      if (value === 'fixed') {
        updates = {
          ...updates,
          hourlyRate: '',
          monthlyRate: ''
        }
      } else if (value === 'hourly') {
        updates = {
          ...updates,
          monthlyRate: ''
        }
      } else if (value === 'monthly') {
        updates = {
          ...updates,
          hourlyRate: ''
        }
      }
    }
    // Calculate end date when start date or duration changes
    else if (field === 'startDate' && contract.contractDuration) {
      const startDate = new Date(value)
      const endDate = addWeeks(startDate, parseInt(contract.contractDuration, 10))
      updates.endDate = endDate.toISOString().split('T')[0]
    }
    else if (field === 'contractDuration' && contract.startDate) {
      const startDate = new Date(contract.startDate)
      const endDate = addWeeks(startDate, parseInt(value, 10))
      updates.endDate = endDate.toISOString().split('T')[0]
    }
    // Calculate duration when end date changes
    else if (field === 'endDate' && contract.startDate) {
      const startDate = new Date(contract.startDate)
      const endDate = new Date(value)
      const duration = differenceInWeeks(endDate, startDate)
      updates.contractDuration = duration > 0 ? duration : ''
    }
    
    setContract(prev => ({ ...prev, ...updates }))
  }

  // Calculate total contract value
  useEffect(() => {
    let totalValue = contract.totalAmount
    
    if (contract.contractType === 'hourly' && contract.hourlyRate && contract.hoursLogged) {
      totalValue = parseFloat(contract.hourlyRate) * parseFloat(contract.hoursLogged)
    } 
    else if (contract.contractType === 'monthly' && contract.monthlyRate && contract.contractDuration) {
      // Approximate months based on weeks
      const durationInMonths = parseFloat(contract.contractDuration) / 4
      totalValue = parseFloat(contract.monthlyRate) * durationInMonths
    }
    
    if (totalValue !== contract.totalAmount) {
      setContract(prev => ({ ...prev, totalAmount: totalValue }))
    }
  }, [
    contract.contractType, 
    contract.hourlyRate, 
    contract.hoursLogged,
    contract.monthlyRate,
    contract.contractDuration
  ])

  return {
    contract,
    updateContractValue,
    setContract
  }
}

export default useContractCalculations