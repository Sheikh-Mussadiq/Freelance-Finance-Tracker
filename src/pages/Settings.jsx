import { useState } from "react";
import { motion } from "framer-motion";
import { useData } from "../context/DataContext";

const Settings = () => {
  const { projects, expenses, accounts } = useData();
  const [exportStatus, setExportStatus] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);

  // Animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 10 },
    animate: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
      },
    }),
  };

  const handleExportData = () => {
    try {
      // Prepare data for export
      const exportData = {
        projects,
        expenses,
        accounts,
        exportDate: new Date().toISOString(),
      };

      // Convert to JSON and create download link
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri =
        "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

      const exportFileDefaultName = `finance-tracker-data-${
        new Date().toISOString().split("T")[0]
      }.json`;

      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();

      setExportStatus({
        success: true,
        message: "Data exported successfully!",
      });

      // Reset status message after a delay
      setTimeout(() => {
        setExportStatus(null);
      }, 3000);
    } catch (error) {
      setExportStatus({
        success: false,
        message: `Error exporting data: ${error.message}`,
      });
    }
  };

  const handleResetData = () => {
    if (confirmReset) {
      // Clear localStorage
      localStorage.removeItem("projects");
      localStorage.removeItem("expenses");
      localStorage.removeItem("accounts");

      // Reload page to reset state
      window.location.reload();
    } else {
      setConfirmReset(true);

      // Reset confirmation after a delay
      setTimeout(() => {
        setConfirmReset(false);
      }, 5000);
    }
  };

  return (
    <div className="space-y-6 overflow-y-auto pb-8">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Manage your application preferences and data
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {/* Data Management */}
        <motion.section
          className="card overflow-visible"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          custom={0}
        >
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
            Data Management
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                Export Data
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Download all your data as a JSON file for backup or transfer.
              </p>
              <button onClick={handleExportData} className="btn-primary">
                Export Data
              </button>

              {exportStatus && (
                <div
                  className={`mt-2 text-sm ${
                    exportStatus.success
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {exportStatus.message}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                Reset Data
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Clear all your data and reset the application to default state.
                This action cannot be undone.
              </p>
              <button
                onClick={handleResetData}
                className={`${
                  confirmReset
                    ? "btn-primary bg-red-600 hover:bg-red-700"
                    : "btn-outline text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                }`}
              >
                {confirmReset ? "Confirm Reset" : "Reset Data"}
              </button>

              {confirmReset && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  Are you sure? This will permanently delete all your data.
                </p>
              )}
            </div>
          </div>
        </motion.section>

        {/* App Information */}
        <motion.section
          className="card overflow-visible"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          custom={1}
        >
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
            About
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1">
                Finance Tracker
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Version 0.1.0
              </p>
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-1">
                Features
              </h3>
              <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>Track projects and client payments</li>
                <li>Monitor business expenses</li>
                <li>Manage multiple bank accounts</li>
                <li>Dark mode support</li>
                <li>Local data storage</li>
              </ul>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This application stores all data locally in your browser. No
                data is sent to any server.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Statistics */}
        <motion.section
          className="card overflow-visible"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          custom={2}
        >
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
            Application Statistics
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Projects
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {projects.length}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Expenses
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {expenses.length}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Bank Accounts
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {accounts.length}
              </p>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            <p>
              Last data update: {new Date().toLocaleDateString()}{" "}
              {new Date().toLocaleTimeString()}
            </p>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Settings;
