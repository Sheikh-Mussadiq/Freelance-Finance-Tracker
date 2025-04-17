import React from 'react'
import { motion } from 'framer-motion'

const EmptyState = ({ 
  title, 
  description, 
  icon: Icon, 
  action,
  className = '',
  size = 'default'
}) => {
  const sizeClasses = {
    small: {
      container: 'p-4',
      icon: 'w-8 h-8',
      title: 'text-sm',
      description: 'text-xs'
    },
    default: {
      container: 'p-6',
      icon: 'w-12 h-12',
      title: 'text-lg',
      description: 'text-sm'
    },
    large: {
      container: 'p-8',
      icon: 'w-16 h-16',
      title: 'text-xl',
      description: 'text-base'
    }
  }[size]

  return (
    <motion.div 
      className={`flex flex-col items-center justify-center text-center ${sizeClasses.container} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {Icon && (
        <div className="mb-4">
          <Icon className={`${sizeClasses.icon} text-gray-400 dark:text-gray-600`} />
        </div>
      )}
      <h3 className={`${sizeClasses.title} font-medium text-gray-900 dark:text-white mb-1`}>
        {title}
      </h3>
      <p className={`${sizeClasses.description} text-gray-500 dark:text-gray-400 mb-4 max-w-sm`}>
        {description}
      </p>
      {action}
    </motion.div>
  )
}

export default EmptyState