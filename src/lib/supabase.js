import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const signIn = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signUp = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Projects helpers
export const fetchProjects = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("projects")
      .select(
        `
        *,
        payments (*)
      `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Transform the data to camelCase and ensure proper date formats
    const transformedData = data?.map((project) => ({
      id: project.id,
      name: project.name,
      client: project.client,
      totalAmount: project.total_amount || 0,
      paidAmount: project.paid_amount || 0,
      status: project.status,
      startDate: project.start_date,
      endDate: project.end_date,
      contractType: project.contract_type,
      paymentTerms: project.payment_terms,
      hourlyRate: project.hourly_rate,
      hoursLogged: project.hours_logged || 0,
      monthlyRate: project.monthly_rate,
      contractDuration: project.contract_duration,
      payments:
        project.payments?.map((payment) => ({
          id: payment.id,
          amount: payment.amount,
          date: payment.date,
          description: payment.description,
        })) || [],
    }));

    return { data: transformedData, error: null };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return { data: null, error };
  }
};

export const createProject = async (project) => {
  try {
    console.log("createProject called with:", project);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log("Auth user:", user);

    if (!user) {
      console.error("User not authenticated while creating project");
      return {
        data: null,
        error: new Error("User not authenticated. Please sign in again."),
      };
    }

    // Ensure status matches the database enum format
    let status = project.status;
    if (status === "in-progress") {
      status = "in_progress"; // Convert to database format
    }

    // Convert camelCase to snake_case for database fields
    const projectData = {
      name: project.name,
      client: project.client,
      status: status,
      start_date: project.startDate,
      end_date: project.endDate,
      contract_type: project.contractType,
      payment_terms: project.paymentTerms,
      user_id: user.id,
      contract_duration: parseInt(project.contractDuration) || null,
    };

    // Add contract-specific fields
    if (project.contractType === "fixed") {
      projectData.total_amount = parseFloat(project.totalAmount) || 0;
      projectData.paid_amount = 0;
      projectData.hourly_rate = null;
      projectData.hours_logged = null;
      projectData.monthly_rate = null;
    } else if (project.contractType === "hourly") {
      projectData.hourly_rate = parseFloat(project.hourlyRate) || 0;
      projectData.total_amount = 0;
      projectData.paid_amount = 0;
      projectData.hours_logged = 0;
      projectData.monthly_rate = null;
    } else if (project.contractType === "monthly") {
      projectData.monthly_rate = parseFloat(project.monthlyRate) || 0;
      projectData.total_amount = 0;
      projectData.paid_amount = 0;
      projectData.hourly_rate = null;
      projectData.hours_logged = null;
    }

    console.log("Creating project with data:", projectData);

    const { data, error } = await supabase
      .from("projects")
      .insert(projectData)
      .select()
      .single();

    if (error) {
      console.error("Error from Supabase:", error);
      return { data: null, error };
    }

    console.log("Project created successfully:", data);
    return { data, error };
  } catch (error) {
    console.error("Exception in createProject:", error);
    return { data: null, error };
  }
};

export const updateProject = async (id, updates) => {
  try {
    // Convert camelCase to snake_case for the database
    const dbUpdates = {
      name: updates.name,
      client: updates.client,
      status: updates.status === "in-progress" ? "in_progress" : updates.status,
      start_date: updates.startDate,
      end_date: updates.endDate,
      contract_type: updates.contractType,
      payment_terms: updates.paymentTerms,
      contract_duration: updates.contractDuration,
    };

    // Add contract-specific fields
    if (updates.contractType === "fixed") {
      dbUpdates.total_amount = parseFloat(updates.totalAmount) || 0;
      if (updates.paidAmount !== undefined) {
        dbUpdates.paid_amount = parseFloat(updates.paidAmount) || 0;
      }
    } else if (updates.contractType === "hourly") {
      dbUpdates.hourly_rate = parseFloat(updates.hourlyRate) || 0;
      if (updates.hoursLogged !== undefined) {
        dbUpdates.hours_logged = parseFloat(updates.hoursLogged) || 0;
      }
    } else if (updates.contractType === "monthly") {
      dbUpdates.monthly_rate = parseFloat(updates.monthlyRate) || 0;
    }

    const { data, error } = await supabase
      .from("projects")
      .update(dbUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Transform the data to camelCase for frontend consistency
    const transformedData = data
      ? {
          id: data.id,
          name: data.name,
          client: data.client,
          totalAmount: data.total_amount || 0,
          paidAmount: data.paid_amount || 0,
          status: data.status,
          startDate: data.start_date,
          endDate: data.end_date,
          contractType: data.contract_type,
          paymentTerms: data.payment_terms,
          hourlyRate: data.hourly_rate,
          hoursLogged: data.hours_logged || 0,
          monthlyRate: data.monthly_rate,
          contractDuration: data.contract_duration,
        }
      : null;

    return { data: transformedData, error: null };
  } catch (error) {
    console.error("Error updating project:", error);
    return { data: null, error };
  }
};

export const deleteProject = async (id) => {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  return { error };
};

// Payments helpers
export const createPayment = async (payment) => {
  const { data, error } = await supabase
    .from("payments")
    .insert(payment)
    .select()
    .single();
  return { data, error };
};

// Expenses helpers
export const fetchExpenses = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });
  return { data, error };
};

export const createExpense = async (expense) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  // Handle recurring expense
  const { isRecurring, recurrencePattern, recurrenceEndDate, ...expenseData } =
    expense;

  const timestamp = new Date().toISOString();

  const { data, error } = await supabase
    .from("expenses")
    .insert({
      ...expenseData,
      is_recurring: isRecurring,
      recurrence_pattern: recurrencePattern,
      recurrence_end_date: recurrenceEndDate,
      user_id: user.id,
      account_name: expense.account,
      created_at: timestamp,
    })
    .select()
    .single();
  return { data, error };
};

export const updateExpense = async (id, updates) => {
  // Handle recurring expense fields
  const { isRecurring, recurrencePattern, recurrenceEndDate, ...updateData } =
    updates;

  const { data, error } = await supabase
    .from("expenses")
    .update({
      ...updateData,
      is_recurring: isRecurring,
      recurrence_pattern: recurrencePattern,
      recurrence_end_date: recurrenceEndDate,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();
  return { data, error };
};

export const deleteExpense = async (id) => {
  const { error } = await supabase.from("expenses").delete().eq("id", id);
  return { error };
};

// Accounts helpers
export const fetchAccounts = async () => {
  const { data, error } = await supabase
    .from("accounts")
    .select()
    .order("created_at", { ascending: false });
  return { data, error };
};

export const createAccount = async (account) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated while creating account");
      return {
        data: null,
        error: new Error("User not authenticated. Please sign in again."),
      };
    }

    // Prepare account data
    const newAccount = {
      ...account,
      user_id: user.id,
      currency: "PKR",
    };

    const { data, error } = await supabase
      .from("accounts")
      .insert(newAccount)
      .select("*")
      .single();
    return { data, error };
  } catch (error) {
    console.error("Error in createAccount:", error);
    return { data: null, error };
  }
};

export const updateAccount = async (id, updates) => {
  const { data, error } = await supabase
    .from("accounts")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  return { data, error };
};

export const deleteAccount = async (id) => {
  const { error } = await supabase.from("accounts").delete().eq("id", id);
  return { error };
};

// Budgets helpers
export const fetchBudgets = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("budgets")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  return { data, error };
};

export const createBudget = async (budget) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("budgets")
    .insert({
      ...budget,
      user_id: user.id,
    })
    .select()
    .single();
  return { data, error };
};

export const updateBudget = async (id, updates) => {
  const { data, error } = await supabase
    .from("budgets")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  return { data, error };
};

export const deleteBudget = async (id) => {
  const { error } = await supabase.from("budgets").delete().eq("id", id);
  return { error };
};
