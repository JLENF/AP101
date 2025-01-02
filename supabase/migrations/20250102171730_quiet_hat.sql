/*
  # Initial rentals table setup with tracking fields

  1. New Tables
    - `rentals`
      - Core fields for rental management
      - Tracking fields for audit and soft delete
      - Foreign key constraints for user references

  2. Security
    - Enable RLS
    - Add policies for CRUD operations
    - Ensure only active rentals are visible
*/

CREATE TABLE IF NOT EXISTS rentals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  renter_name text NOT NULL,
  check_in timestamptz NOT NULL,
  check_out timestamptz NOT NULL,
  daily_rate numeric NOT NULL,
  is_paid boolean DEFAULT false,
  total_amount numeric NOT NULL,
  number_of_days integer NOT NULL,
  color text NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users,
  received_at timestamptz,
  received_by uuid REFERENCES auth.users,
  is_active boolean DEFAULT true,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users
);

ALTER TABLE rentals ENABLE ROW LEVEL SECURITY;

-- Users can read their own active rentals
CREATE POLICY "Users can read own rentals"
  ON rentals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id AND is_active = true);

-- Users can insert their own rentals
CREATE POLICY "Users can insert own rentals"
  ON rentals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own rentals
CREATE POLICY "Users can update own rentals"
  ON rentals
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Set created_by to user_id for existing rentals
DO $$ 
BEGIN 
  UPDATE rentals SET created_by = user_id WHERE created_by IS NULL;
END $$;