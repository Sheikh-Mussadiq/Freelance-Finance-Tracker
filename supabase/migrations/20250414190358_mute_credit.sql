/*
  # Fix Accounts and Projects Schema

  1. New Tables
    - `accounts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `name` (text)
      - `balance` (numeric)
      - `type` (text)
      - `currency` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `last_updated` (timestamp)

    - `projects`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `name` (text)
      - `client` (text)
      - `total_amount` (numeric)
      - `paid_amount` (numeric)
      - `status` (text)
      - `start_date` (date)
      - `end_date` (date)
      - `contract_type` (text)
      - `payment_terms` (text)
      - `hourly_rate` (numeric)
      - `hours_logged` (numeric)
      - `monthly_rate` (numeric)
      - `contract_duration` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create accounts table
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

-- Create projects table
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

-- Create RLS policies for accounts
CREATE POLICY "accounts_select_policy" ON accounts
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "accounts_insert_policy" ON accounts
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "accounts_update_policy" ON accounts
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "accounts_delete_policy" ON accounts
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Create RLS policies for projects
CREATE POLICY "projects_select_policy" ON projects
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "projects_insert_policy" ON projects
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "projects_update_policy" ON projects
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "projects_delete_policy" ON projects
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  NEW.last_updated = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_accounts_timestamps
  BEFORE UPDATE ON accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();