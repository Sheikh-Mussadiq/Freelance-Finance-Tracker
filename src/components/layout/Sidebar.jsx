import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HomeIcon,
  ProjectsIcon,
  PaymentIcon as ExpensesIcon,
  AccountsIcon,
  SettingsIcon,
  SunIcon,
  MoonIcon,
  CloseIcon
} from '../icons/Icons'

const Sidebar = ({ isMobile, isOpen, onClose, darkMode, toggleDarkMode }) => {
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', icon: <HomeIcon />, path: '/' },
    { name: 'Projects', icon: <ProjectsIcon />, path: '/projects' },
    { name: 'Expenses', icon: <ExpensesIcon />, path: '/expenses' },
    { name: 'Accounts', icon: <AccountsIcon />, path: '/accounts' },
    { name: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ]

  // Animation variants for framer-motion
  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } }
  }

  return (
    <motion.aside
      className={`${isMobile ? 'fixed inset-y-0 left-0 z-30' : 'flex-shrink-0'} w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col`}
      initial={isMobile ? "closed" : "open"}
      animate={isMobile ? (isOpen ? "open" : "closed") : "open"}
      variants={isMobile ? sidebarVariants : {}}
    >
      <div className="h-full flex flex-col">
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">FinanceTrack</h1>
          {isMobile && (
            <button onClick={onClose} className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white">
              <CloseIcon />
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                }`}
                onClick={isMobile ? onClose : undefined}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={toggleDarkMode}
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {darkMode ? <SunIcon /> : <MoonIcon />}
            <span className="ml-2">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </div>
    </motion.aside>
  )
}

export default Sidebar