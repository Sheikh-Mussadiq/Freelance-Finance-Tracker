// Contract Type Options
export const CONTRACT_TYPES = [
  { value: 'fixed', label: 'Fixed Price' },
  { value: 'hourly', label: 'Hourly Rate' },
  { value: 'monthly', label: 'Monthly Rate' }
]

// Payment Terms Options
export const PAYMENT_TERMS = [
  { value: 'milestone', label: 'Milestone-based' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'half-upfront', label: '50% Upfront' },
  { value: 'full-upfront', label: '100% Upfront' },
  { value: 'upon-completion', label: 'Upon Completion' }
]

// Project Status Options
export const PROJECT_STATUS = [
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' }
]

// Helper function for payment terms display
export const getPaymentTermsDisplay = (termValue) => {
  const term = PAYMENT_TERMS.find(term => term.value === termValue)
  return term ? term.label : termValue
}

// Helper function for contract type display
export const getContractTypeDisplay = (typeValue, hourlyRate, monthlyRate) => {
  if (typeValue === 'hourly' && hourlyRate) {
    return `Hourly (${formatCurrency(hourlyRate)}/hr)`
  } else if (typeValue === 'monthly' && monthlyRate) {
    return `Monthly (${formatCurrency(monthlyRate)}/mo)`
  } else {
    return 'Fixed Price'
  }
}

// Format currency helper
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount || 0)
}