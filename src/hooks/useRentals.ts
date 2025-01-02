import { useState, useEffect } from 'react';
import { Rental } from '../types/rental';
import { fetchRentals } from '../utils/rental';

export function useRentals() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadRentals();
  }, []);

  const loadRentals = async () => {
    try {
      setLoading(true);
      const data = await fetchRentals();
      setRentals(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load rentals'));
    } finally {
      setLoading(false);
    }
  };

  return {
    rentals,
    loading,
    error,
    reloadRentals: loadRentals
  };
}