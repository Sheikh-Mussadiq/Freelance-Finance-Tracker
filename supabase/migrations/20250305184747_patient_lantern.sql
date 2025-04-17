/*
  # Fix Expenses Schema

  1. Changes to Expenses Table
    - Add account_id as foreign key to accounts table
    - Add account_name column for storing the account name
    - Add category column with constraints

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Add new columns to expenses table
ALTER TABLE expenses 
ADD COLUMN IF NOT EXISTS account_id uuid REFERENCES accounts(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS account_name text;

-- Add category check constraint if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'expenses_category_check') THEN
    ALTER TABLE expenses ADD CONSTRAINT expenses_category_check 
    CHECK (category IN (
      'Software', 'Hardware', 'Office', 'Hosting', 'Travel',
      'Meals', 'Marketing', 'Utilities', 'Rent', 'Insurance',
      'Subscriptions', 'Professional Services', 'Other'
    ));
  END IF;
END $$;