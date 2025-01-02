import React from 'react';
import { Rental } from '../types/rental';
import { Calendar, DollarSign, Check, X, User, Trash2 } from 'lucide-react';
import { getTextColorForBg } from '../utils/colors';
import { DeleteRentalModal } from './modals/DeleteRentalModal';

interface RentalListProps {
  rentals: Rental[];
  onTogglePayment: (id: string) => void;
  onDeleteRental: (id: string) => void;
}

export function RentalList({ rentals, onTogglePayment, onDeleteRental }: RentalListProps) {
  const [selectedRental, setSelectedRental] = React.useState<Rental | null>(null);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleDelete = () => {
    if (selectedRental) {
      onDeleteRental(selectedRental.id);
      setSelectedRental(null);
    }
  };

  return (
    <div className="space-y-4">
      {rentals.map((rental) => (
        <div
          key={rental.id}
          className={`p-4 rounded-lg shadow-sm border border-gray-200 ${rental.color} ${getTextColorForBg(rental.color)}`}
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
            <div className="space-y-2">
              {/* Nome do locatário */}
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 flex-shrink-0" />
                <span className="font-medium">{rental.renter_name}</span>
              </div>
              
              {/* Datas */}
              <div className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  <div className="flex flex-col text-sm">
                    <div className="flex items-center space-x-1">
                      <span className="font-medium">Entrada:</span>
                      <span>{formatDate(rental.check_in)}</span>
                      <span className="text-xs">(após 12h)</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="font-medium">Saída:</span>
                      <span>{formatDate(rental.check_out)}</span>
                      <span className="text-xs">(até 12h)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Valor */}
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm font-medium">
                  R$ {rental.daily_rate}/dia ({rental.number_of_days} {rental.number_of_days === 1 ? 'diária' : 'diárias'})
                </span>
              </div>
            </div>

            {/* Ações */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onTogglePayment(rental.id)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                  rental.is_paid
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {rental.is_paid ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Pago</span>
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4" />
                    <span>Não Pago</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setSelectedRental(rental)}
                className="p-1.5 hover:bg-red-100 rounded-full"
                title="Excluir locação"
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </button>
            </div>
          </div>

          {/* Total */}
          <div className="mt-2 text-right">
            <span className="text-sm font-medium">
              Total: R$ {rental.total_amount}
            </span>
          </div>
        </div>
      ))}

      <DeleteRentalModal
        isOpen={!!selectedRental}
        onClose={() => setSelectedRental(null)}
        onConfirm={handleDelete}
        rentalName={selectedRental?.renter_name || ''}
      />
    </div>
  );
}