/*
  # Fix Rental RLS Policies

  1. Changes
    - Drop existing RLS policies
    - Create new, more permissive policies for CRUD operations
    - Ensure users can update their own rentals' payment status
  
  2. Security
    - Maintain user data isolation
    - Allow users to manage their own rentals
    - Prevent unauthorized access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own rentals" ON rentals;
DROP POLICY IF EXISTS "Users can insert own rentals" ON rentals;
DROP POLICY IF EXISTS "Users can update own rentals" ON rentals;

-- Create new policies
-- Read policy - users can read their own active rentals
CREATE POLICY "Users can read own rentals"
  ON rentals
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() 
    AND is_active = true
  );

-- Insert policy - users can insert rentals for themselves
CREATE POLICY "Users can insert own rentals"
  ON rentals
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Update policy - users can update their own rentals
CREATE POLICY "Users can update own rentals"
  ON rentals
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Delete policy (soft delete) - users can mark their own rentals as inactive
CREATE POLICY "Users can soft delete own rentals"
  ON rentals
  FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid() 
    AND is_active = true
  );