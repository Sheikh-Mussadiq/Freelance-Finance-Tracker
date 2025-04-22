import React from 'react'
import { useLocation } from 'react-router-dom'

const Header = () => {
  const location = useLocation();
  
  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path.startsWith('/projects')) return 'Projects';
    if (path.startsWith('/expenses')) return 'Expenses';
    if (path.startsWith('/accounts')) return 'Accounts';
    if (path.startsWith('/settings')) return 'Settings';
    return 'FinanceTrack';
  };
  
  return (
    <div className="lg:hidden px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
      <div>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">{getPageTitle()}</h1>
      </div>
      <div>
        <h2 className="text-sm font-medium text-primary-600 dark:text-primary-400">FinanceTrack</h2>
      </div>
    </div>
  )
}

export default Header