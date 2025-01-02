export interface Rental {
  id: string;
  user_id: string;
  renter_name: string;
  check_in: Date;
  check_out: Date;
  daily_rate: number;
  is_paid: boolean;
  total_amount: number;
  number_of_days: number;
  created_at: Date;
  created_by: string;
  received_at?: Date;
  received_by?: string;
  is_active: boolean;
  deleted_at?: Date;
  deleted_by?: string;
  color: string;
}

export type RentalFormData = Pick<Rental, 'renter_name' | 'check_in' | 'check_out' | 'daily_rate' | 'is_paid'>;