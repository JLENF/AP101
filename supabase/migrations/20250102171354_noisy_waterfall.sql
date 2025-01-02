/*
  # Add tracking fields to rentals table

  1. New Columns
    - `is_active` (boolean) - Indicates if the rental is active or soft-deleted
    - `deleted_at` (timestamptz) - When the rental was deleted
    - `deleted_by` (uuid) - Who deleted the rental
    - `created_by` (uuid) - Who created the rental
    - `received_at` (timestamptz) - When payment was received
    - `received_by` (uuid) - Who marked the rental as paid

  2. Changes
    - Add foreign key constraints for user references
    - Set default value for is_active
*/

-- Add tracking columns
ALTER TABLE rentals 
  ADD COLUMN is_active boolean DEFAULT true,
  ADD COLUMN deleted_at timestamptz,
  ADD COLUMN deleted_by uuid REFERENCES auth.users,
  ADD COLUMN created_by uuid REFERENCES auth.users,
  ADD COLUMN received_at timestamptz,
  ADD COLUMN received_by uuid REFERENCES auth.users;

-- Update existing rentals to set created_by
DO $$ 
BEGIN 
  UPDATE rentals SET created_by = user_id WHERE created_by IS NULL;
END $$;