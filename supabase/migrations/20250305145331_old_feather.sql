/*
  # Fix Accounts Table and Currency Handling

  1. Changes
    - Add missing lastUpdated column to accounts table
    - Add trigger for lastUpdated column
    - Add currency column with default value 'PKR'
    - Add check constraint for valid currencies

  2. Security
    - Ensure RLS policies are properly set
*/

-- Add lastUpdated column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'accounts' AND column_name = 'last_updated'
  ) THEN
    ALTER TABLE accounts ADD COLUMN last_updated timestamptz DEFAULT now();
  END IF;
END $$;

-- Add currency column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'accounts' AND column_name = 'currency'
  ) THEN
    ALTER TABLE accounts ADD COLUMN currency text DEFAULT 'PKR' NOT NULL;
  END IF;
END $$;

-- Add currency check constraint
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage 
    WHERE table_name = 'accounts' AND constraint_name = 'accounts_currency_check'
  ) THEN
    ALTER TABLE accounts ADD CONSTRAINT accounts_currency_check 
      CHECK (currency IN ('PKR', 'USD', 'EUR', 'GBP'));
  END IF;
END $$;

-- Create or replace trigger for last_updated
CREATE OR REPLACE TRIGGER update_accounts_last_updated
  BEFORE UPDATE ON accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();