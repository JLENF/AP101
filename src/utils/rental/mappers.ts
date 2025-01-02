import { Rental } from '../../types/rental';

export function mapRentalDates(data: any): Rental {
  if (!data) return data;
  
  // Ensure color is set
  if (!data.color) {
    console.warn('Rental missing color:', data);
  }

  return {
    ...data,
    check_in: new Date(data.check_in),
    check_out: new Date(data.check_out),
    created_at: new Date(data.created_at),
    deleted_at: data.deleted_at ? new Date(data.deleted_at) : undefined,
    received_at: data.received_at ? new Date(data.received_at) : undefined,
    color: data.color || 'bg-yellow-100', // Provide default color if missing
  };
}