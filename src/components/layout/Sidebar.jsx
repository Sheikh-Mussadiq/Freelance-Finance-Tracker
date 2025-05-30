import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HomeIcon,
  ProjectsIcon,
  PaymentIcon as ExpensesIcon,
  AccountsIcon,
  SettingsIcon,
  SunIcon,
  MoonIcon,
  CloseIcon,
} from "../icons/Icons";
import { signOut } from "../../lib/supabase";

const Sidebar = ({ isMobile, isOpen, onClose, darkMode, toggleDarkMode }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: "Dashboard", icon: <HomeIcon />, path: "/" },
    { name: "Projects", icon: <ProjectsIcon />, path: "/projects" },
    { name: "Expenses", icon: <ExpensesIcon />, path: "/expenses" },
    { name: "Accounts", icon: <AccountsIcon />, path: "/accounts" },
    { name: "Settings", icon: <SettingsIcon />, path: "/settings" },
  ];

  // Animation variants for framer-motion
  const sidebarVariants = {
    open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: {
      x: "-100%",
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        console.error("Error signing out:", error);
      } else {
        // Redirect to login page after successful logout
        navigate("/login");
      }
    } catch (error) {
      console.error("Exception during logout:", error);
    }
  };

  return (
    <motion.aside
      className={`${
        isMobile ? "fixed inset-y-0 left-0 z-30" : "flex-shrink-0"
      } w-64 h-screen bg-white dark:bg-gray-800 shadow-lg flex flex-col`}
      initial={isMobile ? "closed" : "open"}
      animate={isMobile ? (isOpen ? "open" : "closed") : "open"}
      variants={isMobile ? sidebarVariants : {}}
    >
      <div className="h-screen flex flex-col">
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">
            FinanceTrack
          </h1>
          {isMobile && (
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
            >
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
                    ? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                }`}
                onClick={isMobile ? onClose : undefined}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>

          <button
            onClick={toggleDarkMode}
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {darkMode ? <SunIcon /> : <MoonIcon />}
            <span className="ml-2">
              {darkMode ? "Light Mode" : "Dark Mode"}
            </span>
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
