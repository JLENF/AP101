/*
  # Create rentals table

  1. New Tables
    - `rentals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `renter_name` (text)
      - `check_in` (timestamptz)
      - `check_out` (timestamptz)
      - `daily_rate` (numeric)
      - `is_paid` (boolean)
      - `total_amount` (numeric)
      - `number_of_days` (integer)
      - `color` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `rentals` table
    - Add policies for authenticated users to manage their rentals
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
  created_at timestamptz DEFAULT now()
);

ALTER TABLE rentals ENABLE ROW LEVEL SECURITY;

-- Users can read their own rentals
CREATE POLICY "Users can read own rentals"
  ON rentals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

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

-- Users can delete their own rentals
CREATE POLICY "Users can delete own rentals"
  ON rentals
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);