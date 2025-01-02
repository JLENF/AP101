import { supabase } from '../../lib/supabase';
import { Rental } from '../../types/rental';
import { mapRentalDates } from './mappers';

export async function fetchRentals(): Promise<Rental[]> {
  const { data, error } = await supabase
    .from('rentals')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching rentals:', error);
    return [];
  }

  return data.map(mapRentalDates);
}

export async function updateRentalPayment(id: string, isPaid: boolean): Promise<boolean> {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return false;

  const updateData = isPaid
    ? {
        is_paid: true,
        received_at: new Date().toISOString(),
        received_by: user.user.id,
      }
    : {
        is_paid: false,
        received_at: null,
        received_by: null,
      };

  const { error } = await supabase
    .from('rentals')
    .update(updateData)
    .eq('id', id);

  if (error) {
    console.error('Error updating rental payment:', error);
    return false;
  }

  return true;
}

export async function deleteRental(id: string): Promise<boolean> {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return false;

  const { error } = await supabase
    .from('rentals')
    .update({
      is_active: false,
      deleted_at: new Date().toISOString(),
      deleted_by: user.user.id
    })
    .eq('id', id);

  if (error) {
    console.error('Error deleting rental:', error);
    return false;
  }

  return true;
}