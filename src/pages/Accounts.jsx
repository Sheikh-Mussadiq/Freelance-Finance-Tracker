import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { useData } from "../context/DataContext";
import EmptyState from "../components/ui/EmptyState";
import { AccountsEmptyIcon } from "../components/icons/EmptyStateIcons";

// Icon components
const AddIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>
);

const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
    />
  </svg>
);

const DeleteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

// Animation variants
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

const modalVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

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

const Accounts = () => {
  const { accounts, addAccount, updateAccount, deleteAccount } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    balance: "",
    type: "Checking",
  });

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const openAddModal = () => {
    setFormData({
      name: "",
      balance: "",
      type: "Checking",
    });
    setCurrentAccount(null);
    setIsModalOpen(true);
  };

  const openEditModal = (account) => {
    setFormData({
      name: account.name,
      balance: account.balance,
      type: account.type,
    });
    setCurrentAccount(account);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentAccount(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "balance" ? parseFloat(value) || "" : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const timestamp = new Date().toISOString();

    try {
      let result;

      if (currentAccount) {
        result = await updateAccount({
          ...currentAccount,
          ...formData,
          last_updated: timestamp,
        });
      } else {
        result = await addAccount({
          ...formData,
          last_updated: timestamp,
        });
      }

      if (result.error) {
        alert(`Error: ${result.error.message || "An unknown error occurred"}`);
        return;
      }

      closeModal();
    } catch (error) {
      alert(`Error: ${error.message || "An unknown error occurred"}`);
      console.error("Error in handleSubmit:", error);
    }
  };

  const handleDeleteAccount = (id) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      deleteAccount(id);
    }
  };

  // Calculate totals
  const totalAssets = accounts.reduce((sum, account) => {
    return account.type !== "Credit" ? sum + account.balance : sum;
  }, 0);

  const totalLiabilities = accounts.reduce((sum, account) => {
    return account.type === "Credit" ? sum + Math.abs(account.balance) : sum;
  }, 0);

  const netWorth = totalAssets - totalLiabilities;

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Accounts
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage your bank accounts and track balances
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="btn-primary inline-flex items-center space-x-2"
        >
          <AddIcon />
          <span>Add Account</span>
        </button>
      </header>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <motion.div
          className="card bg-white dark:bg-gray-800 border border-blue-100 dark:border-blue-900"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          custom={0}
        >
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Total Assets
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalAssets)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Sum of checking and savings accounts
          </p>
        </motion.div>

        <motion.div
          className="card bg-white dark:bg-gray-800 border border-red-100 dark:border-red-900"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          custom={1}
        >
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Total Liabilities
          </h3>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {formatCurrency(totalLiabilities)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Sum of credit accounts
          </p>
        </motion.div>

        <motion.div
          className="card bg-white dark:bg-gray-800 border border-green-100 dark:border-green-900"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          custom={2}
        >
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Net Worth
          </h3>
          <p
            className={`text-2xl font-bold ${
              netWorth >= 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {formatCurrency(netWorth)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Assets minus liabilities
          </p>
        </motion.div>
      </div>

      {/* Accounts list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {accounts.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              icon={AccountsEmptyIcon}
              title="No accounts added"
              description="Add your bank accounts to track your balances and manage your finances."
              action={
                <button
                  onClick={openAddModal}
                  className="btn-primary inline-flex items-center space-x-2"
                >
                  <AddIcon />
                  <span>Add Account</span>
                </button>
              }
            />
          </div>
        ) : (
          accounts.map((account, index) => (
            <motion.div
              key={account.id}
              className={`card relative ${
                account.type === "Credit"
                  ? "border-l-4 border-l-red-500"
                  : account.type === "Savings"
                  ? "border-l-4 border-l-green-500"
                  : "border-l-4 border-l-blue-500"
              }`}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              custom={index}
            >
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={() => openEditModal(account)}
                  className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                  title="Edit Account"
                >
                  <EditIcon />
                </button>
                <button
                  onClick={() => handleDeleteAccount(account.id)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  title="Delete Account"
                >
                  <DeleteIcon />
                </button>
              </div>

              <div>
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded-full mb-3 ${
                    account.type === "Credit"
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                      : account.type === "Savings"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                  }`}
                >
                  {account.type}
                </span>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                  {account.name}
                </h3>
                <p
                  className={`text-2xl font-bold ${
                    account.type === "Credit" && account.balance < 0
                      ? "text-red-600 dark:text-red-400"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {formatCurrency(account.balance)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Last updated:{" "}
                  {account.lastUpdated
                    ? format(new Date(account.lastUpdated), "MMM d, yyyy")
                    : "Not set"}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Account Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {currentAccount ? "Edit Account" : "Add New Account"}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <CloseIcon />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="p-4 space-y-4">
                  <div>
                    <label htmlFor="name" className="label">
                      Account Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      className="input"
                      placeholder="e.g., Business Checking"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="balance" className="label">
                      Current Balance ($)
                    </label>
                    <input
                      type="number"
                      id="balance"
                      name="balance"
                      value={formData.balance}
                      onChange={handleFormChange}
                      className="input"
                      step="0.01"
                      placeholder="0.00"
                      required
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      For credit accounts, enter a negative value for a balance
                      owed
                    </p>
                  </div>
                  <div>
                    <label htmlFor="type" className="label">
                      Account Type
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleFormChange}
                      className="input"
                      required
                    >
                      <option value="Checking">Checking</option>
                      <option value="Savings">Savings</option>
                      <option value="Credit">Credit</option>
                      <option value="Investment">Investment</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700 space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {currentAccount ? "Update Account" : "Add Account"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Accounts;
