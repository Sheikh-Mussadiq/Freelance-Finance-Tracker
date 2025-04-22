import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "./AuthContext";
import * as api from "../lib/supabase";

// Create context
const DataContext = createContext();

const mockProjects = [
  {
    id: uuidv4(),
    name: "Website Redesign",
    client: "ABC Corp",
    totalAmount: 5000,
    paidAmount: 2500,
    status: "in-progress",
    startDate: "2025-01-01",
    endDate: "2025-02-28",
    contractType: "fixed",
    paymentTerms: "milestone",
    hourlyRate: null,
    hoursLogged: null,
    monthlyRate: null,
    contractDuration: 8, // in weeks
    payments: [
      {
        id: uuidv4(),
        amount: 2500,
        date: "2025-01-01",
        description: "Initial Payment",
      },
    ],
  },
  {
    id: uuidv4(),
    name: "Mobile App Development",
    client: "XYZ Solutions",
    totalAmount: 8000,
    paidAmount: 4000,
    status: "in-progress",
    startDate: "2025-01-05",
    endDate: "2025-03-30",
    contractType: "hourly",
    paymentTerms: "biweekly",
    hourlyRate: 75,
    hoursLogged: 106.5,
    monthlyRate: null,
    contractDuration: 12, // in weeks
    payments: [
      {
        id: uuidv4(),
        amount: 4000,
        date: "2025-01-05",
        description: "50% Advance",
      },
    ],
  },
  {
    id: uuidv4(),
    name: "Brand Identity",
    client: "Startup Inc",
    totalAmount: 3000,
    paidAmount: 3000,
    status: "completed",
    startDate: "2024-12-15",
    endDate: "2025-01-10",
    contractType: "fixed",
    paymentTerms: "half-upfront",
    hourlyRate: null,
    hoursLogged: null,
    monthlyRate: null,
    contractDuration: 4, // in weeks
    payments: [
      {
        id: uuidv4(),
        amount: 1500,
        date: "2024-12-15",
        description: "Advance",
      },
    ],
  },
];

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data
  const fetchData = useCallback(async () => {
    if (!user) {
      setProjects([]);
      setExpenses([]);
      setAccounts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [
        { data: projectsData, error: projectsError },
        { data: expensesData, error: expensesError },
        { data: accountsData, error: accountsError },
        { data: budgetsData, error: budgetsError },
      ] = await Promise.all([
        api.fetchProjects(),
        api.fetchExpenses(),
        api.fetchAccounts(),
        api.fetchBudgets(),
      ]);

      if (projectsError) throw projectsError;
      if (expensesError) throw expensesError;
      if (accountsError) throw accountsError;
      if (budgetsError) throw budgetsError;

      setProjects(projectsData || []);
      setExpenses(expensesData || []);
      setAccounts(accountsData || []);
      setBudgets(budgetsData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch data when user changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Project methods
  const addProject = async (project) => {
    try {
      if (!user) {
        throw new Error("User is not authenticated. Please sign in again.");
      }

      console.log("Adding project:", project);
      console.log("Current user:", user);

      try {
        const { data, error } = await api.createProject({
          ...project,
          user_id: user.id,
        });

        console.log("API response data:", data);
        console.log("API response error:", error);

        if (error) throw error;
        setProjects([data, ...projects]);
        return { data, error: null };
      } catch (error) {
        console.error("Error adding project:", error);
        alert("Error adding project: " + error.message);
        return { data: null, error };
      }
    } catch (error) {
      console.error("Error adding project:", error);
      alert("Error adding project: " + error.message);
      return { data: null, error };
    }
  };

  const updateProject = async (updatedProject) => {
    console.log("Updating project:", updatedProject);
    try {
      const { data, error } = await api.updateProject(
        updatedProject.id,
        updatedProject
      );
      if (error) throw error;
      setProjects(
        projects.map((project) =>
          project.id === updatedProject.id ? data : project
        )
      );
      return { data, error: null };
    } catch (error) {
      console.error("Error updating project:", error);
      return { data: null, error };
    }
  };

  const deleteProject = async (id) => {
    try {
      const { error } = await api.deleteProject(id);
      if (error) throw error;
      setProjects(projects.filter((project) => project.id !== id));
      return { error: null };
    } catch (error) {
      console.error("Error deleting project:", error);
      return { error };
    }
  };

  const addPayment = async (projectId, payment) => {
    try {
      const { data, error } = await api.createPayment({
        ...payment,
        project_id: projectId,
      });
      if (error) throw error;

      // Update local project data
      const project = projects.find((p) => p.id === projectId);
      if (project) {
        const updatedProject = {
          ...project,
          paid_amount: project.paid_amount + Number(payment.amount),
          payments: [...(project.payments || []), data],
        };
        await updateProject(updatedProject);
      }

      return { data, error: null };
    } catch (error) {
      console.error("Error adding payment:", error);
      return { data: null, error };
    }
  };

  const updateHours = (projectId, hours) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project || project.contractType !== "hourly") return;

    const updatedProject = {
      ...project,
      hoursLogged: hours,
      totalAmount: hours * project.hourlyRate,
    };

    updateProject(updatedProject);
  };

  // Stats and summaries
  const getStats = () => {
    const totalEarned = projects.reduce(
      (sum, project) => sum + project.paidAmount,
      0
    );
    const totalPending = projects.reduce(
      (sum, project) => sum + (project.totalAmount - project.paidAmount),
      0
    );
    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    const netBalance = totalEarned - totalExpenses;

    const accountsTotal = accounts.reduce((sum, account) => {
      // Only add checking and savings to total (credit is negative)
      if (account.type !== "Credit") {
        return sum + account.balance;
      }
      return sum;
    }, 0);

    return {
      totalEarned,
      totalPending,
      totalExpenses,
      netBalance,
      accountsTotal,
      projectCount: projects.length,
      activeProjects: projects.filter((p) => p.status === "in-progress").length,
    };
  };

  // Expense methods
  const addExpense = async (expense) => {
    try {
      const { data, error } = await api.createExpense({
        ...expense,
        user_id: user.id,
      });
      if (error) throw error;
      setExpenses([data, ...expenses]);
      return { data, error: null };
    } catch (error) {
      console.error("Error adding expense:", error);
      return { data: null, error };
    }
  };

  const updateExpense = async (updatedExpense) => {
    try {
      const { data, error } = await api.updateExpense(
        updatedExpense.id,
        updatedExpense
      );
      if (error) throw error;
      setExpenses(
        expenses.map((expense) =>
          expense.id === updatedExpense.id ? data : expense
        )
      );
      return { data, error: null };
    } catch (error) {
      console.error("Error updating expense:", error);
      return { data: null, error };
    }
  };

  const deleteExpense = async (id) => {
    try {
      const { error } = await api.deleteExpense(id);
      if (error) throw error;
      setExpenses(expenses.filter((expense) => expense.id !== id));
      return { error: null };
    } catch (error) {
      console.error("Error deleting expense:", error);
      return { error };
    }
  };

  // Account methods
  const addAccount = async (account) => {
    try {
      if (!user) {
        throw new Error("User is not authenticated. Please sign in again.");
      }

      const { data, error } = await api.createAccount({
        ...account,
        user_id: user.id,
      });
      if (error) throw error;
      setAccounts([data, ...accounts]);
      return { data, error: null };
    } catch (error) {
      console.error("Error adding account:", error);
      return { data: null, error };
    }
  };

  const updateAccount = async (updatedAccount) => {
    try {
      const { data, error } = await api.updateAccount(
        updatedAccount.id,
        updatedAccount
      );
      if (error) throw error;
      setAccounts(
        accounts.map((account) =>
          account.id === updatedAccount.id ? data : account
        )
      );
      return { data, error: null };
    } catch (error) {
      console.error("Error updating account:", error);
      return { data: null, error };
    }
  };

  const deleteAccount = async (id) => {
    try {
      const { error } = await api.deleteAccount(id);
      if (error) throw error;
      setAccounts(accounts.filter((account) => account.id !== id));
      return { error: null };
    } catch (error) {
      console.error("Error deleting account:", error);
      return { error };
    }
  };

  // Budget methods
  const addBudget = async (budget) => {
    try {
      const { data, error } = await api.createBudget(budget);
      if (error) throw error;
      setBudgets([data, ...budgets]);
      return { data, error: null };
    } catch (error) {
      console.error("Error adding budget:", error);
      return { data: null, error };
    }
  };

  const updateBudget = async (id, updates) => {
    try {
      const { data, error } = await api.updateBudget(id, updates);
      if (error) throw error;
      setBudgets(budgets.map((budget) => (budget.id === id ? data : budget)));
      return { data, error: null };
    } catch (error) {
      console.error("Error updating budget:", error);
      return { data: null, error };
    }
  };

  const deleteBudget = async (id) => {
    try {
      const { error } = await api.deleteBudget(id);
      if (error) throw error;
      setBudgets(budgets.filter((budget) => budget.id !== id));
      return { error: null };
    } catch (error) {
      console.error("Error deleting budget:", error);
      return { error };
    }
  };

  // Get budget progress
  const getBudgetProgress = (category, period = "monthly") => {
    const budget = budgets.find(
      (b) => b.category === category && b.period === period
    );
    if (!budget) return null;

    const now = new Date();
    const startDate = new Date(budget.startDate);
    let endDate = new Date(startDate);

    switch (period) {
      case "monthly":
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case "quarterly":
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case "yearly":
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
    }

    const periodExpenses = expenses.filter(
      (expense) =>
        expense.category === category &&
        new Date(expense.date) >= startDate &&
        new Date(expense.date) < endDate
    );

    const spent = periodExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    return {
      budget: budget.amount,
      spent,
      remaining: Math.max(budget.amount - spent, 0),
      percentage: Math.min((spent / budget.amount) * 100, 100),
    };
  };

  const value = {
    loading,
    projects,
    expenses,
    accounts,
    budgets,
    addProject,
    updateProject,
    deleteProject,
    addPayment,
    updateHours,
    addExpense,
    updateExpense,
    deleteExpense,
    addAccount,
    updateAccount,
    deleteAccount,
    addBudget,
    updateBudget,
    deleteBudget,
    getBudgetProgress,
    refreshData: fetchData,
    getStats,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

// Custom hook
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
