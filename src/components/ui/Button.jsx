import React from 'react'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  startIcon = null,
  endIcon = null,
  ...props 
}) => {
  // Base button classes
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 rounded-lg"
  
  // Size classes
  const sizeClasses = {
    sm: "px-2.5 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base"
  }[size] || "px-4 py-2 text-sm";
  
  // Variant classes
  const variantClasses = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-300",
    secondary: "bg-secondary-600 hover:bg-secondary-700 text-white focus:ring-secondary-300",
    outline: "border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-300",
    success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-300",
    ghost: "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
  }[variant] || "bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-300";
  
  // Disabled state
  const disabledClasses = props.disabled ? "opacity-50 cursor-not-allowed" : "";
  
  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${disabledClasses} ${className}`}
      {...props}
    >
      {startIcon && <span className="mr-2">{startIcon}</span>}
      {children}
      {endIcon && <span className="ml-2">{endIcon}</span>}
    </button>
  )
}

export default Button