/*
  # Add contract duration column to projects table

  1. Changes
    - Add contract_duration column to projects table to store project duration in weeks
    - This column is optional since not all projects need a fixed duration

  2. Impact
    - Allows storing and tracking project duration for better project management
    - Enables automatic end date calculations based on start date and duration
*/

ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS contract_duration integer;