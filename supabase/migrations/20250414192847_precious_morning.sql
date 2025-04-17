/*
  # Add Recurring Expenses Support

  1. Changes
    - Add recurrence fields to expenses table
    - Add check constraints for valid recurrence patterns
    - Add trigger for auto-creating recurring expenses

  2. Security
    - Maintain existing RLS policies
*/

-- Add recurrence fields to expenses table
ALTER TABLE expenses
ADD COLUMN IF NOT EXISTS is_recurring boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS recurrence_pattern text CHECK (
  recurrence_pattern IS NULL OR 
  recurrence_pattern IN ('daily', 'weekly', 'monthly', 'yearly')
),
ADD COLUMN IF NOT EXISTS next_due_date date,
ADD COLUMN IF NOT EXISTS recurrence_end_date date;

-- Create function to handle recurring expenses
CREATE OR REPLACE FUNCTION handle_recurring_expenses()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process recurring expenses
  IF NEW.is_recurring THEN
    -- Calculate next due date based on pattern
    NEW.next_due_date := CASE NEW.recurrence_pattern
      WHEN 'daily' THEN NEW.date + INTERVAL '1 day'
      WHEN 'weekly' THEN NEW.date + INTERVAL '1 week'
      WHEN 'monthly' THEN NEW.date + INTERVAL '1 month'
      WHEN 'yearly' THEN NEW.date + INTERVAL '1 year'
      ELSE NULL
    END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for recurring expenses
DROP TRIGGER IF EXISTS handle_recurring_expenses_trigger ON expenses;
CREATE TRIGGER handle_recurring_expenses_trigger
  BEFORE INSERT OR UPDATE ON expenses
  FOR EACH ROW
  EXECUTE FUNCTION handle_recurring_expenses();