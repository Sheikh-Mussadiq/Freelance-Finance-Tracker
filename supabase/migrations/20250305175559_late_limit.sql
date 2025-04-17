/*
  # Fix Projects and Expenses Schema

  1. Changes to Projects Table
    - Add contract_type, payment_terms columns with constraints
    - Add hourly_rate, monthly_rate, hours_logged columns
    - Add contract_duration column
    - Add constraints only if they don't exist

  2. Changes to Expenses Table
    - Add account_id as foreign key
    - Add category column with constraints
    - Add constraints only if they don't exist

  3. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Projects table modifications
DO $$ 
BEGIN
  -- Add columns if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'contract_type') THEN
    ALTER TABLE projects ADD COLUMN contract_type text NOT NULL DEFAULT 'fixed';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'payment_terms') THEN
    ALTER TABLE projects ADD COLUMN payment_terms text NOT NULL DEFAULT 'milestone';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'hourly_rate') THEN
    ALTER TABLE projects ADD COLUMN hourly_rate numeric;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'monthly_rate') THEN
    ALTER TABLE projects ADD COLUMN monthly_rate numeric;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'hours_logged') THEN
    ALTER TABLE projects ADD COLUMN hours_logged numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'contract_duration') THEN
    ALTER TABLE projects ADD COLUMN contract_duration integer;
  END IF;

  -- Add constraints if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'projects_contract_type_check') THEN
    ALTER TABLE projects ADD CONSTRAINT projects_contract_type_check 
    CHECK (contract_type IN ('fixed', 'hourly', 'monthly'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'projects_payment_terms_check') THEN
    ALTER TABLE projects ADD CONSTRAINT projects_payment_terms_check 
    CHECK (payment_terms IN (
      'milestone', 'weekly', 'biweekly', 'monthly',
      'half-upfront', 'full-upfront', 'upon-completion'
    ));
  END IF;
END $$;

-- Expenses table modifications
DO $$ 
BEGIN
  -- Add columns if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'expenses' AND column_name = 'account_id') THEN
    ALTER TABLE expenses ADD COLUMN account_id uuid REFERENCES accounts(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'expenses' AND column_name = 'category') THEN
    ALTER TABLE expenses ADD COLUMN category text NOT NULL DEFAULT 'Other';
  END IF;

  -- Add constraint if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'expenses_category_check') THEN
    ALTER TABLE expenses ADD CONSTRAINT expenses_category_check 
    CHECK (category IN (
      'Software', 'Hardware', 'Office', 'Hosting', 'Travel',
      'Meals', 'Marketing', 'Utilities', 'Rent', 'Insurance',
      'Subscriptions', 'Professional Services', 'Other'
    ));
  END IF;
END $$;

-- Enable RLS if not already enabled
DO $$ 
BEGIN
  -- For projects table
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'projects' AND rowsecurity = true
  ) THEN
    ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
  END IF;

  -- For expenses table
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'expenses' AND rowsecurity = true
  ) THEN
    ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Drop existing policies if they exist and recreate them
DO $$ 
BEGIN
  -- Projects policies
  DROP POLICY IF EXISTS "Users can view own projects" ON projects;
  DROP POLICY IF EXISTS "Users can create own projects" ON projects;
  DROP POLICY IF EXISTS "Users can update own projects" ON projects;
  DROP POLICY IF EXISTS "Users can delete own projects" ON projects;

  -- Expenses policies
  DROP POLICY IF EXISTS "Users can view own expenses" ON expenses;
  DROP POLICY IF EXISTS "Users can create own expenses" ON expenses;
  DROP POLICY IF EXISTS "Users can update own expenses" ON expenses;
  DROP POLICY IF EXISTS "Users can delete own expenses" ON expenses;
END $$;

-- Create new policies
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own expenses"
  ON expenses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own expenses"
  ON expenses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expenses"
  ON expenses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses"
  ON expenses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);