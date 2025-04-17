// Currency formatter
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 2
  }).format(amount || 0)
}

// Date formatter
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Format percentage
export const formatPercentage = (value) => {
  return `${Math.round(value * 100)}%`
}

// Format large numbers with K, M, etc.
export const formatCompactNumber = (number) => {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(number)
}