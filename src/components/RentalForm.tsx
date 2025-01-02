import React from 'react';
import { User, DollarSign } from 'lucide-react';
import { RentalFormData } from '../types/rental';
import { CustomDatePicker } from './DatePicker/CustomDatePicker';
import { useRentals } from '../hooks/useRentals';
import toast from 'react-hot-toast';

interface RentalFormProps {
  onSubmit: (data: RentalFormData) => void;
}

export function RentalForm({ onSubmit }: RentalFormProps) {
  const { rentals } = useRentals();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState<RentalFormData>({
    renter_name: '',
    check_in: new Date(),
    check_out: new Date(),
    daily_rate: 0,
    is_paid: false,
  });
  const [isDailyRateFocused, setIsDailyRateFocused] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      const checkIn = new Date(formData.check_in);
      const checkOut = new Date(formData.check_out);
      
      if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
        toast.error('Datas inválidas');
        return;
      }
      
      if (checkOut <= checkIn) {
        toast.error('A data de saída deve ser posterior à data de entrada');
        return;
      }

      if (formData.daily_rate <= 0) {
        toast.error('O valor da diária deve ser maior que zero');
        return;
      }

      checkIn.setHours(12, 0, 0, 0);
      checkOut.setHours(12, 0, 0, 0);

      await onSubmit({
        ...formData,
        check_in: checkIn,
        check_out: checkOut,
      });
    } catch (error) {
      toast.error('Erro ao criar locação. Tente novamente.');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDailyRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!isDailyRateFocused) {
      setFormData({ ...formData, daily_rate: Number(value) });
      setIsDailyRateFocused(true);
    } else {
      setFormData({ ...formData, daily_rate: Number(value) });
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 md:max-w-2xl md:mx-auto">
      <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-6 rounded-lg shadow-sm space-y-4">
        {/* Nome do Locatário */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome do Locatário
          </label>
          <div className="relative">
            <input
              type="text"
              className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={formData.renter_name}
              onChange={(e) => setFormData({ ...formData, renter_name: e.target.value })}
              required
            />
            <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Datas */}
        <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data de Entrada
            </label>
            <CustomDatePicker
              selectedDate={formData.check_in}
              onChange={(date) => setFormData({ ...formData, check_in: date })}
              rentals={rentals}
              excludeDate={formData.check_out}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data de Saída
            </label>
            <CustomDatePicker
              selectedDate={formData.check_out}
              onChange={(date) => setFormData({ ...formData, check_out: date })}
              rentals={rentals}
              minDate={formData.check_in}
            />
          </div>
        </div>

        {/* Valor e Pagamento */}
        <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor da Diária
            </label>
            <div className="relative">
              <input
                type="number"
                inputMode="decimal"
                className="block w-full pl-8 pr-10 py-2.5 text-base border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={isDailyRateFocused ? formData.daily_rate : ''}
                onChange={handleDailyRateChange}
                onFocus={() => setIsDailyRateFocused(true)}
                min="0"
                step="0.01"
                required
                placeholder="0,00"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">R$</span>
              </div>
              <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={formData.is_paid}
                onChange={(e) => setFormData({ ...formData, is_paid: e.target.checked })}
              />
              <span className="text-sm text-gray-700">Pagamento Recebido</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 px-4 text-base font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Adicionando...' : 'Adicionar Locação'}
          </button>
        </div>
      </form>
    </div>
  );
}