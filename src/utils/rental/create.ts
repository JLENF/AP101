import { Rental, RentalFormData } from '../../types/rental';
import { getNextColor } from '../colors';
import { supabase } from '../../lib/supabase';
import { calculateNumberOfDays, calculateTotalAmount } from './calculations';
import { mapRentalDates } from './mappers';
import { validateDates, normalizeDate } from './validation';
import { RentalError } from './error';

async function getAuthenticatedUser() {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw new RentalError('Authentication error: ' + userError.message);
  if (!userData.user) throw new RentalError('No authenticated user found');
  return userData.user;
}

async function fetchExistingRentals() {
  const { data: rentalsRaw, error: rentalsError } = await supabase
    .from('rentals')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (rentalsError) throw new RentalError('Error fetching rentals: ' + rentalsError.message);
  return (rentalsRaw ?? []).map(mapRentalDates);
}

async function insertRental(rentalData: any) {
  const { data: newRental, error: insertError } = await supabase
    .from('rentals')
    .insert([rentalData])
    .select()
    .single();

  if (insertError) throw new RentalError('Error inserting rental: ' + insertError.message);
  if (!newRental) throw new RentalError('No rental data returned after insertion');
  
  return newRental;
}

export async function createRental(formData: RentalFormData): Promise<Rental | null> {
  try {
    const user = await getAuthenticatedUser();
    const existingRentals = await fetchExistingRentals();

    const checkIn = normalizeDate(new Date(formData.check_in));
    const checkOut = normalizeDate(new Date(formData.check_out));
    
    validateDates(checkIn, checkOut);
    
    const totalAmount = calculateTotalAmount(checkIn, checkOut, formData.daily_rate);
    const numberOfDays = calculateNumberOfDays(checkIn, checkOut);

    // Filter rentals that overlap with the new rental's date range
    const overlappingRentals = existingRentals.filter(rental => {
      const rentalStart = new Date(rental.check_in);
      const rentalEnd = new Date(rental.check_out);
      return (checkIn <= rentalEnd && checkOut >= rentalStart);
    });

    console.log('Existing rentals:', existingRentals);
    console.log('Overlapping rentals:', overlappingRentals);
    
    // Get the next color for this user
    const nextColor = await getNextColor(existingRentals, user.id);
    console.log('Selected color for new rental:', nextColor);

    const rental = {
      user_id: user.id,
      created_by: user.id,
      renter_name: formData.renter_name,
      check_in: checkIn.toISOString(),
      check_out: checkOut.toISOString(),
      daily_rate: formData.daily_rate,
      is_paid: formData.is_paid,
      total_amount: totalAmount,
      number_of_days: numberOfDays,
      created_at: new Date().toISOString(),
      color: nextColor,
      is_active: true
    };

    console.log('Saving rental with color:', rental.color);
    const newRental = await insertRental(rental);
    console.log('Saved rental:', newRental);
    return mapRentalDates(newRental);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in createRental:', error.message);
    } else {
      console.error('Error in createRental:', error);
    }
    return null;
  }
}