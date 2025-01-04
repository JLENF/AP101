import React from 'react';
import { Home, LogOut } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { RentalForm } from './components/RentalForm';
import { RentalList } from './components/RentalList';
import { RentalCalendar } from './components/RentalCalendar';
import { Reports } from './components/Reports';
import { AuthModal } from './components/auth/AuthModal';
import { MainNav } from './components/Navigation/MainNav';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { RentalFormData } from './types/rental';
import { createRental, updateRentalPayment, deleteRental } from './utils/rental/index';
import { useRentals } from './hooks/useRentals';
import toast from 'react-hot-toast';

function AppContent() {
  const { user, signOut } = React.useContext(AuthContext);
  const { rentals, reloadRentals } = useRentals();
  const [activeTab, setActiveTab] = React.useState<'list' | 'calendar' | 'reports'>('list');
  const [showForm, setShowForm] = React.useState(false);

  const handleAddRental = async (formData: RentalFormData) => {
    const newRental = await createRental(formData);
    if (newRental) {
      await reloadRentals();
      setShowForm(false);
      toast.success('Locação criada com sucesso!');
    } else {
      toast.error('Erro ao criar locação');
    }
  };

  const handleTogglePayment = async (id: string) => {
    const rental = rentals.find(r => r.id === id);
    if (!rental) return;

    const success = await updateRentalPayment(id, !rental.is_paid);
    if (success) {
      await reloadRentals();
      toast.success('Status de pagamento atualizado!');
    } else {
      toast.error('Erro ao atualizar status de pagamento');
    }
  };

  const handleDeleteRental = async (id: string) => {
    const success = await deleteRental(id);
    if (success) {
      await reloadRentals();
      toast.success('Locação excluída com sucesso!');
    } else {
      toast.error('Erro ao excluir locação');
    }
  };

  const handleTabChange = (tab: 'list' | 'calendar' | 'reports') => {
    setActiveTab(tab);
    setShowForm(false);
  };

  if (!user) {
    return <AuthModal onSuccess={reloadRentals} />;
  }

  const renderContent = () => {
    if (showForm) {
      return <RentalForm onSubmit={handleAddRental} />;
    }

    switch (activeTab) {
      case 'list':
        return (
          <RentalList
            rentals={rentals}
            onTogglePayment={handleTogglePayment}
            onDeleteRental={handleDeleteRental}
          />
        );
      case 'calendar':
        return <RentalCalendar rentals={rentals} />;
      case 'reports':
        return <Reports rentals={rentals} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Home className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">
                Gerenciador de Locações
              </h1>
            </div>
            <button
              onClick={signOut}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <span>Sair</span>
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <MainNav
            activeTab={activeTab}
            showForm={showForm}
            onTabChange={handleTabChange}
            onNewRental={() => setShowForm(true)}
          />
          <div className="mt-6">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

export default App;