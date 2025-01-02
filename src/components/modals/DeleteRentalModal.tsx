import React from 'react';
import { Trash2 } from 'lucide-react';

interface DeleteRentalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  rentalName: string;
}

export function DeleteRentalModal({ isOpen, onClose, onConfirm, rentalName }: DeleteRentalModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-red-100 p-3 rounded-full">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-center mb-2">Confirmar Exclusão</h3>
        
        <p className="text-gray-600 text-center mb-6">
          Tem certeza que deseja excluir a locação de <strong>{rentalName}</strong>? 
          Esta ação não pode ser desfeita.
        </p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}