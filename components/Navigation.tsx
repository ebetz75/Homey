import React from 'react';
import { Home, Plus, Settings, List } from 'lucide-react';
import { ViewState } from '../types';

interface NavigationProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onChangeView }) => {
  const navItems = [
    { id: 'DASHBOARD', icon: Home, label: 'Home' },
    { id: 'DETAILS', icon: List, label: 'Items' }, // Reuse DETAILS for list view in this context
    { id: 'ADD', icon: Plus, label: 'Add', isPrimary: true },
    { id: 'SETTINGS', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe pt-2 px-4 shadow-lg z-50 pb-4">
      <div className="flex justify-around items-end">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          
          if (item.isPrimary) {
            return (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id as ViewState)}
                className="relative -top-6 bg-primary-600 text-white p-4 rounded-full shadow-xl shadow-primary-600/30 hover:scale-105 transition-transform"
              >
                <Icon size={28} />
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id as ViewState)}
              className={`flex flex-col items-center gap-1 p-2 min-w-[64px] transition-colors ${
                isActive ? 'text-primary-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
