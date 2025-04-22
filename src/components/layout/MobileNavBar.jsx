import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  ProjectsIcon,
  PaymentIcon as ExpensesIcon,
  AccountsIcon,
  SettingsIcon,
} from "../icons/Icons";

/**
 * Mobile bottom navigation bar component
 * Displays navigation icons at the bottom of the screen on mobile devices
 */
const MobileNavBar = () => {
  const location = useLocation();

  // Navigation items - same as sidebar but with shorter labels for mobile
  const navigation = [
    { name: "Home", icon: <HomeIcon />, path: "/" },
    { name: "Projects", icon: <ProjectsIcon />, path: "/projects" },
    { name: "Expenses", icon: <ExpensesIcon />, path: "/expenses" },
    { name: "Accounts", icon: <AccountsIcon />, path: "/accounts" },
    { name: "Settings", icon: <SettingsIcon />, path: "/settings" },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-30">
      <div className="flex justify-around items-center h-16">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors ${
              location.pathname === item.path
                ? "text-primary-600 dark:text-primary-400"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            <div className="w-6 h-6 mb-1">{item.icon}</div>
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
      
      {/* Safe area padding for newer iOS devices */}
      <div className="h-safe-area-bottom bg-white dark:bg-gray-800"></div>
    </div>
  );
};

export default MobileNavBar;
