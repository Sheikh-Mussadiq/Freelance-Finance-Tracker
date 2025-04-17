import React from 'react'

const Badge = ({ children, variant = 'default', size = 'md' }) => {
  // Determine base classes
  const baseClasses = "inline-flex items-center font-medium rounded-full"
  
  // Size classes
  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-xs",
    lg: "px-3 py-1 text-sm"
  }[size] || "px-2.5 py-0.5 text-xs";
  
  // Variant classes
  const variantClasses = {
    default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200",
    primary: "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-100 hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors duration-200",
    secondary: "bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-100 hover:bg-secondary-200 dark:hover:bg-secondary-800 transition-colors duration-200",
    success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 hover:bg-green-200 dark:hover:bg-green-800 transition-colors duration-200",
    danger: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 hover:bg-red-200 dark:hover:bg-red-800 transition-colors duration-200",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors duration-200",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200"
  }[variant] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  
  return (
    <span className={`${baseClasses} ${sizeClasses} ${variantClasses}`}>
      {children}
    </span>
  )
}

export default Badge