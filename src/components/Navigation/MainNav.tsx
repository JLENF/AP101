import React from 'react';
import { Menu } from 'lucide-react';
import { NavigationMenu } from './NavigationMenu';

interface MainNavProps {
  activeTab: 'list' | 'calendar' | 'reports';
  showForm: boolean;
  onTabChange: (tab: 'list' | 'calendar' | 'reports') => void;
  onNewRental: () => void;
}

export function MainNav({ activeTab, showForm, onTabChange, onNewRental }: MainNavProps) {
  return (
    <div className="flex flex-wrap gap-1">
      <NavigationMenu
        label="Locações"
        isActive={activeTab === 'list'}
        onClick={() => onTabChange('list')}
        dropdownItems={[
          {
            label: 'Nova Locação',
            onClick: onNewRental,
            isActive: showForm,
          },
          {
            label: 'Lista',
            onClick: () => onTabChange('list'),
            isActive: !showForm && activeTab === 'list',
          },
        ]}
      />
      
      <button
        onClick={() => onTabChange('calendar')}
        className={`px-2 py-1.5 text-sm rounded-md ${
          activeTab === 'calendar'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Calendário
      </button>
      
      <button
        onClick={() => onTabChange('reports')}
        className={`px-2 py-1.5 text-sm rounded-md ${
          activeTab === 'reports'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Relatórios
      </button>
    </div>
  );
}