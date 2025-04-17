import React from 'react'

const PasswordStrengthIndicator = ({ password }) => {
  const getStrength = (password) => {
    let strength = 0
    
    // Length check
    if (password.length >= 8) strength++
    
    // Uppercase check
    if (/[A-Z]/.test(password)) strength++
    
    // Lowercase check
    if (/[a-z]/.test(password)) strength++
    
    // Numbers check
    if (/[0-9]/.test(password)) strength++
    
    // Special characters check
    if (/[^A-Za-z0-9]/.test(password)) strength++
    
    return strength
  }

  const strength = getStrength(password)
  
  const getColor = () => {
    switch (strength) {
      case 0: return 'bg-red-500'
      case 1: return 'bg-red-400'
      case 2: return 'bg-yellow-500'
      case 3: return 'bg-yellow-400'
      case 4: return 'bg-green-500'
      case 5: return 'bg-green-400'
      default: return 'bg-gray-200'
    }
  }

  const getMessage = () => {
    switch (strength) {
      case 0: return 'Very Weak'
      case 1: return 'Weak'
      case 2: return 'Fair'
      case 3: return 'Good'
      case 4: return 'Strong'
      case 5: return 'Very Strong'
      default: return ''
    }
  }

  return (
    <div className="mt-2">
      <div className="flex items-center space-x-2">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full ${getColor()} transition-all duration-300`}
            style={{ width: `${(strength / 5) * 100}%` }}
          />
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[80px]">
          {getMessage()}
        </span>
      </div>
      
      <ul className="mt-2 text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <li className={password.length >= 8 ? 'text-green-500' : ''}>
          • At least 8 characters
        </li>
        <li className={/[A-Z]/.test(password) ? 'text-green-500' : ''}>
          • At least one uppercase letter
        </li>
        <li className={/[a-z]/.test(password) ? 'text-green-500' : ''}>
          • At least one lowercase letter
        </li>
        <li className={/[0-9]/.test(password) ? 'text-green-500' : ''}>
          • At least one number
        </li>
        <li className={/[^A-Za-z0-9]/.test(password) ? 'text-green-500' : ''}>
          • At least one special character
        </li>
      </ul>
    </div>
  )
}

export default PasswordStrengthIndicator