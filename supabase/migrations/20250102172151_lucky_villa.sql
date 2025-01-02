/*
  # Fix Rental RLS Policies

  1. Changes
    - Drop existing policies
    - Create new policies with proper conditions
    - Allow users to update payment status
  
  2. Security
    - Maintain data isolation between users
    - Allow users to manage their own rentals
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own rentals" ON rentals;
DROP POLICY IF EXISTS "Users can insert own rentals" ON rentals;
DROP POLICY IF EXISTS "Users can update own rentals" ON rentals;
DROP POLICY IF EXISTS "Users can soft delete own rentals" ON rentals;

-- Create new policies
CREATE POLICY "Users can read own rentals"
  ON rentals
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own rentals"
  ON rentals
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own rentals"
  ON rentals
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Ensure the table has RLS enabled
ALTER TABLE rentals ENABLE ROW LEVEL SECURITY;