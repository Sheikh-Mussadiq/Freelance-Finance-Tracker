/*
  # Fix accounts table and policies

  1. Changes
    - Drop existing policies if they exist
    - Create accounts table if it doesn't exist
    - Add new policies with unique names
    - Add trigger for updated_at

  2. Security
    - Enable RLS on accounts table
    - Add policies for authenticated users to manage their own accounts
*/

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can create accounts" ON accounts;
  DROP POLICY IF EXISTS "Users can view own accounts" ON accounts;
  DROP POLICY IF EXISTS "Users can update own accounts" ON accounts;
  DROP POLICY IF EXISTS "Users can delete own accounts" ON accounts;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

-- Create accounts table if it doesn't exist
CREATE TABLE IF NOT EXISTS accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  balance numeric DEFAULT 0,
  type text NOT NULL CHECK (type IN ('Checking', 'Savings', 'Credit', 'Investment', 'Other')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

-- Create policies with unique names
CREATE POLICY "accounts_insert_policy" 
  ON accounts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "accounts_select_policy"
  ON accounts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "accounts_update_policy"
  ON accounts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "accounts_delete_policy"
  ON accounts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create updated_at trigger if it doesn't exist
DO $$ 
BEGIN
  CREATE TRIGGER update_accounts_updated_at
    BEFORE UPDATE ON accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
EXCEPTION
  WHEN duplicate_object THEN
    NULL;
END $$;