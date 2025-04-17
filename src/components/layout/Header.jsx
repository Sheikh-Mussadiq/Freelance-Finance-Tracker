import React from 'react'
import { MenuIcon } from '../icons/Icons'

const Header = ({ toggleSidebar }) => {
  return (
    <div className="lg:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 flex items-center">
      <button
        onClick={toggleSidebar}
        className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 focus:outline-none"
      >
        <span className="sr-only">Open sidebar</span>
        <MenuIcon />
      </button>
      <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400 ml-2">FinanceTrack</h1>
    </div>
  )
}

export default Header