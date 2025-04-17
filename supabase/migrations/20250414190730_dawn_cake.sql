/*
  # Fix Accounts and Projects Schema

  1. Changes
    - Drop existing policies if they exist
    - Create tables if they don't exist
    - Add new policies with unique names
    - Add triggers for timestamps

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "accounts_select_policy" ON accounts;
  DROP POLICY IF EXISTS "accounts_insert_policy" ON accounts;
  DROP POLICY IF EXISTS "accounts_update_policy" ON accounts;
  DROP POLICY IF EXISTS "accounts_delete_policy" ON accounts;
  DROP POLICY IF EXISTS "projects_select_policy" ON projects;
  DROP POLICY IF EXISTS "projects_insert_policy" ON projects;
  DROP POLICY IF EXISTS "projects_update_policy" ON projects;
  DROP POLICY IF EXISTS "projects_delete_policy" ON projects;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

-- Create accounts table if it doesn't exist
CREATE TABLE IF NOT EXISTS accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  balance numeric DEFAULT 0,
  type text NOT NULL CHECK (type IN ('Checking', 'Savings', 'Credit', 'Investment', 'Other')),
  currency text NOT NULL DEFAULT 'PKR' CHECK (currency IN ('PKR', 'USD', 'EUR', 'GBP')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_updated timestamptz DEFAULT now()
);

-- Create projects table if it doesn't exist
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  client text NOT NULL,
  total_amount numeric DEFAULT 0,
  paid_amount numeric DEFAULT 0,
  status text CHECK (status IN ('pending', 'in-progress', 'completed')) DEFAULT 'pending',
  start_date date NOT NULL,
  end_date date,
  contract_type text CHECK (contract_type IN ('fixed', 'hourly', 'monthly')) NOT NULL,
  payment_terms text CHECK (payment_terms IN ('milestone', 'weekly', 'biweekly', 'monthly', 'half-upfront', 'full-upfront', 'upon-completion')) NOT NULL,
  hourly_rate numeric,
  hours_logged numeric DEFAULT 0,
  monthly_rate numeric,
  contract_duration integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create new policies with unique names
DO $$ 
BEGIN
  -- Accounts policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'accounts' AND policyname = 'accounts_select_policy_v2'
  ) THEN
    CREATE POLICY "accounts_select_policy_v2" ON accounts
      FOR SELECT TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'accounts' AND policyname = 'accounts_insert_policy_v2'
  ) THEN
    CREATE POLICY "accounts_insert_policy_v2" ON accounts
      FOR INSERT TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'accounts' AND policyname = 'accounts_update_policy_v2'
  ) THEN
    CREATE POLICY "accounts_update_policy_v2" ON accounts
      FOR UPDATE TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'accounts' AND policyname = 'accounts_delete_policy_v2'
  ) THEN
    CREATE POLICY "accounts_delete_policy_v2" ON accounts
      FOR DELETE TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  -- Projects policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'projects' AND policyname = 'projects_select_policy_v2'
  ) THEN
    CREATE POLICY "projects_select_policy_v2" ON projects
      FOR SELECT TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'projects' AND policyname = 'projects_insert_policy_v2'
  ) THEN
    CREATE POLICY "projects_insert_policy_v2" ON projects
      FOR INSERT TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'projects' AND policyname = 'projects_update_policy_v2'
  ) THEN
    CREATE POLICY "projects_update_policy_v2" ON projects
      FOR UPDATE TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'projects' AND policyname = 'projects_delete_policy_v2'
  ) THEN
    CREATE POLICY "projects_delete_policy_v2" ON projects
      FOR DELETE TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create or replace function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  NEW.last_updated = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_accounts_timestamps'
  ) THEN
    CREATE TRIGGER update_accounts_timestamps
      BEFORE UPDATE ON accounts
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_projects_updated_at'
  ) THEN
    CREATE TRIGGER update_projects_updated_at
      BEFORE UPDATE ON projects
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;