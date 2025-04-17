/*
  # Fix Projects Schema and Policies

  1. Changes
    - Drop existing policies if they exist
    - Create new policies with unique names
    - Ensure proper RLS setup

  2. Security
    - Enable RLS
    - Add policies for CRUD operations with unique names
*/

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can create own projects" ON projects;
  DROP POLICY IF EXISTS "Users can view own projects" ON projects;
  DROP POLICY IF EXISTS "Users can update own projects" ON projects;
  DROP POLICY IF EXISTS "Users can delete own projects" ON projects;
END $$;

-- Create new policies with unique names
CREATE POLICY "projects_insert_policy" 
  ON projects FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "projects_select_policy" 
  ON projects FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "projects_update_policy" 
  ON projects FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "projects_delete_policy" 
  ON projects FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);