import React from 'react';
import { Rental } from '../types/rental';
import { DollarSign, Calendar, TrendingUp } from 'lucide-react';

interface ReportsProps {
  rentals: Rental[];
}

export function Reports({ rentals }: ReportsProps) {
  const totalRentals = rentals.length;
  const totalDays = rentals.reduce((sum, rental) => sum + rental.number_of_days, 0);
  const totalAmount = rentals.reduce((sum, rental) => sum + rental.total_amount, 0);
  const paidAmount = rentals
    .filter(rental => rental.is_paid)
    .reduce((sum, rental) => sum + rental.total_amount, 0);
  const unpaidAmount = totalAmount - paidAmount;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const stats = [
    {
      icon: Calendar,
      label: 'Total de Locações',
      value: totalRentals,
      subValue: `${totalDays} diárias no total`
    },
    {
      icon: DollarSign,
      label: 'Valor Recebido',
      value: `R$ ${paidAmount}`,
      subValue: `${rentals.filter(r => r.is_paid).length} locações pagas`
    },
    {
      icon: TrendingUp,
      label: 'Valor a Receber',
      value: `R$ ${unpaidAmount}`,
      subValue: `${rentals.filter(r => !r.is_paid).length} locações pendentes`
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <stat.icon className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-medium text-gray-900">{stat.label}</h3>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.subValue}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Detalhamento das Locações</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Locatário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Período
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Diárias
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rentals.map((rental) => (
                <tr key={rental.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {rental.renter_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(rental.check_in)} - {formatDate(rental.check_out)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {rental.number_of_days} {rental.number_of_days === 1 ? 'diária' : 'diárias'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    R$ {rental.total_amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      rental.is_paid 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {rental.is_paid ? 'Pago' : 'Pendente'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}