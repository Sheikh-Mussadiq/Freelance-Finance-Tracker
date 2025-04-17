import { useState } from "react";
import { motion } from "framer-motion";
import { useData } from "../context/DataContext";
import { AddIcon, FilterIcon } from "../components/icons/Icons";
import ExpenseList from "../components/expense/ExpenseList";
import ExpenseModal from "../components/expense/ExpenseModal";
import RecurringExpenseModal from "../components/expense/RecurringExpenseModal";
import BudgetModal from "../components/budget/BudgetModal";
import BudgetProgressBar from "../components/budget/BudgetProgressBar";
import FilterModal from "../components/expense/FilterModal";

// Animation variants
const tableVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
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

const expenseCategories = [
  "Software",
  "Hardware",
  "Office",
  "Hosting",
  "Travel",
  "Meals",
  "Marketing",
  "Utilities",
  "Rent",
  "Insurance",
  "Subscriptions",
  "Professional Services",
  "Other",
];

const Expenses = () => {
  const {
    expenses,
    accounts,
    budgets,
    addExpense,
    updateExpense,
    deleteExpense,
    addBudget,
    updateBudget,
    deleteBudget,
    getBudgetProgress,
  } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [currentBudget, setCurrentBudget] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    account: "",
    dateFrom: "",
    dateTo: "",
    amountMin: "",
    amountMax: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    date: "",
    category: "",
    account: "",
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
      amount: "",
      date: new Date().toISOString().split("T")[0],
      category: expenseCategories[0],
      account: accounts.length > 0 ? accounts[0].name : "",
    });
    setCurrentExpense(null);
    setIsModalOpen(true);
  };

  const openEditModal = (expense) => {
    setFormData({
      name: expense.name,
      amount: expense.amount,
      date: expense.date,
      category: expense.category,
      account: expense.account,
    });
    setCurrentExpense(expense);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsFilterModalOpen(false);
    setIsRecurringModalOpen(false);
    setIsBudgetModalOpen(false);
    setCurrentExpense(null);
    setCurrentBudget(null);
  };

  const toggleFilterModal = () => {
    setIsFilterModalOpen(!isFilterModalOpen);
  };

  const resetFilters = () => {
    setFilters({
      category: "",
      account: "",
      dateFrom: "",
      dateTo: "",
      amountMin: "",
      amountMax: "",
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "amount" ? parseFloat(value) || "" : value,
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (currentExpense) {
      updateExpense({
        ...currentExpense,
        ...formData,
      });
    } else {
      addExpense(formData);
    }

    closeModal();
  };

  const openRecurringModal = (expense) => {
    setCurrentExpense(expense);
    setIsRecurringModalOpen(true);
  };

  const handleRecurringSubmit = (recurringData) => {
    if (currentExpense) {
      updateExpense({
        ...currentExpense,
        isRecurring: recurringData.isRecurring,
        recurrencePattern: recurringData.recurrencePattern,
        recurrenceEndDate: recurringData.recurrenceEndDate,
      });
    }
    closeModal();
  };

  const handleBudgetSubmit = (budgetData) => {
    if (currentBudget) {
      updateBudget(currentBudget.id, budgetData);
    } else {
      addBudget(budgetData);
    }
    closeModal();
  };

  const handleDeleteExpense = (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      deleteExpense(id);
    }
  };

  // Filter expenses
  const filteredExpenses = expenses
    .filter((expense) => {
      // Search term filter
      if (
        searchTerm &&
        !expense.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Category filter
      if (filters.category && expense.category !== filters.category) {
        return false;
      }

      // Account filter
      if (filters.account && expense.account !== filters.account) {
        return false;
      }

      // Date range filter
      if (
        filters.dateFrom &&
        new Date(expense.date) < new Date(filters.dateFrom)
      ) {
        return false;
      }

      if (filters.dateTo && new Date(expense.date) > new Date(filters.dateTo)) {
        return false;
      }

      // Amount range filter
      if (filters.amountMin && expense.amount < parseFloat(filters.amountMin)) {
        return false;
      }

      if (filters.amountMax && expense.amount > parseFloat(filters.amountMax)) {
        return false;
      }

      return true;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Calculate totals and statistics
  const totalFiltered = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const totalAll = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Get unique categories
  const uniqueCategories = [
    ...new Set(expenses.map((expense) => expense.category)),
  ];

  // Get expenses by category
  const expensesByCategory = uniqueCategories
    .map((category) => {
      const total = expenses
        .filter((expense) => expense.category === category)
        .reduce((sum, expense) => sum + expense.amount, 0);

      return { category, total };
    })
    .sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Expenses
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Track your business expenses and analyze spending
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="btn-primary inline-flex items-center space-x-2"
        >
          <AddIcon />
          <span>Add Expense</span>
        </button>
      </header>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
        <motion.div
          className="card bg-white dark:bg-gray-800"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          custom={0}
        >
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Total Expenses
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalAll)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            All time
          </p>
        </motion.div>

        <motion.div
          className="card bg-white dark:bg-gray-800"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          custom={1}
        >
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Filtered Total
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalFiltered)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Based on current filters
          </p>
        </motion.div>

        <motion.div
          className="card bg-white dark:bg-gray-800"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          custom={2}
        >
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            This Month
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(
              expenses
                .filter((expense) => {
                  const expenseDate = new Date(expense.date);
                  const now = new Date();
                  return (
                    expenseDate.getMonth() === now.getMonth() &&
                    expenseDate.getFullYear() === now.getFullYear()
                  );
                })
                .reduce((sum, expense) => sum + expense.amount, 0)
            )}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Current month expenses
          </p>
        </motion.div>

        <motion.div
          className="card bg-white dark:bg-gray-800"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          custom={3}
        >
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Average
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {expenses.length > 0
              ? formatCurrency(totalAll / expenses.length)
              : formatCurrency(0)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Average per expense
          </p>
        </motion.div>

        <motion.div
          className="card bg-white dark:bg-gray-800 lg:col-span-1"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          custom={4}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Budgets
            </h3>
            <button
              onClick={() => setIsBudgetModalOpen(true)}
              className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
            >
              Manage
            </button>
          </div>
          <div className="space-y-4">
            {budgets.length > 0 ? (
              budgets.map((budget) => {
                const progress = getBudgetProgress(
                  budget.category,
                  budget.period
                );
                return (
                  <div key={budget.id} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {budget.category}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {budget.period}
                      </span>
                    </div>
                    <BudgetProgressBar
                      spent={progress?.spent || 0}
                      budget={budget.amount}
                      showLabels={false}
                    />
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No budgets set
              </p>
            )}
          </div>
        </motion.div>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0 mb-4">
          <div className="flex-1 mr-2">
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input"
            />
          </div>
          <button
            onClick={toggleFilterModal}
            className="btn-outline flex items-center justify-center space-x-2"
          >
            <FilterIcon />
            <span>Filter</span>
            {(filters.category ||
              filters.account ||
              filters.dateFrom ||
              filters.dateTo ||
              filters.amountMin ||
              filters.amountMax) && (
              <span className="bg-primary-500 text-white text-xs rounded-full px-1.5 py-0.5 ml-1">
                •
              </span>
            )}
          </button>
        </div>

        <ExpenseList
          expenses={filteredExpenses}
          onEdit={openEditModal}
          onDelete={handleDeleteExpense}
          onRecurring={openRecurringModal}
          formatCurrency={formatCurrency}
          openAddModal={openAddModal}
        />
      </div>

      {/* Expense by category section */}
      {expenses.length > 0 && (
        <motion.div
          className="card"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          custom={4}
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Expenses by Category
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              {expensesByCategory
                .slice(0, Math.ceil(expensesByCategory.length / 2))
                .map((item, index) => (
                  <div
                    key={item.category}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-primary-500 dark:bg-primary-400 mr-2"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {item.category}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(item.total)}
                    </span>
                  </div>
                ))}
            </div>

            <div className="space-y-2">
              {expensesByCategory
                .slice(Math.ceil(expensesByCategory.length / 2))
                .map((item, index) => (
                  <div
                    key={item.category}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-primary-500 dark:bg-primary-400 mr-2"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {item.category}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(item.total)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Recurring Expense Modal */}
      <RecurringExpenseModal
        isOpen={isRecurringModalOpen}
        onClose={closeModal}
        expense={currentExpense}
        onSubmit={handleRecurringSubmit}
      />

      {/* Budget Modal */}
      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={closeModal}
        budget={currentBudget}
        onSubmit={handleBudgetSubmit}
        categories={expenseCategories}
      />

      {/* Expense Modal */}
      <ExpenseModal
        isOpen={isModalOpen}
        onClose={closeModal}
        formData={formData}
        handleFormChange={handleFormChange}
        handleSubmit={handleSubmit}
        currentExpense={currentExpense}
        expenseCategories={expenseCategories}
        accounts={accounts}
      />

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={closeModal}
        filters={filters}
        handleFilterChange={handleFilterChange}
        resetFilters={resetFilters}
        expenseCategories={expenseCategories}
        accounts={accounts}
      />
    </div>
  );
};

export default Expenses;
