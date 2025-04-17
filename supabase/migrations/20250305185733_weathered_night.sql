/*
  # Fix Expenses Schema

  1. Changes
    - Add account_name column for storing the account name directly
    - Add account_id as foreign key to accounts table
    - Add category column with proper constraints
    - Add missing RLS policies

  2. Security
    - Enable RLS on expenses table
    - Add policies for CRUD operations
*/

-- Add new columns to expenses table
ALTER TABLE expenses 
ADD COLUMN IF NOT EXISTS account_name text,
ADD COLUMN IF NOT EXISTS account_id uuid REFERENCES accounts(id) ON DELETE SET NULL;

-- Add category column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'expenses' AND column_name = 'category'
  ) THEN
    ALTER TABLE expenses ADD COLUMN category text NOT NULL DEFAULT 'Other';
  END IF;
END $$;

-- Add category check constraint if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'expenses_category_check'
  ) THEN
    ALTER TABLE expenses ADD CONSTRAINT expenses_category_check 
    CHECK (category IN (
      'Software', 'Hardware', 'Office', 'Hosting', 'Travel',
      'Meals', 'Marketing', 'Utilities', 'Rent', 'Insurance',
      'Subscriptions', 'Professional Services', 'Other'
    ));
  END IF;
END $$;

-- Enable RLS
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can create own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can update own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can delete own expenses" ON expenses;

-- Create new policies
CREATE POLICY "Users can view own expenses"
  ON expenses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own expenses"
  ON expenses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expenses"
  ON expenses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses"
  ON expenses
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);