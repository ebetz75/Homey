
import React from 'react';
import { Home, Plus, Settings, List, PieChart } from 'lucide-react';
import { ViewState } from '../types';

interface NavigationProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onChangeView }) => {
  const navItems = [
    { id: 'DASHBOARD', icon: Home, label: 'Home' },
    { id: 'DETAILS', icon: List, label: 'Items' },
    { id: 'ADD', icon: Plus, label: 'Add', isPrimary: true },
    { id: 'INSURANCE', icon: PieChart, label: 'Analysis' },
    { id: 'SETTINGS', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 pb-safe pt-3 px-6 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-50 pb-6 rounded-t-3xl">
      <div className="flex justify-between items-end max-w-md mx-auto relative">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          
          if (item.isPrimary) {
            return (
              <div key={item.id} className="relative -top-10">
                <button
                  onClick={() => onChangeView(item.id as ViewState)}
                  className="bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 text-white p-5 rounded-full shadow-2xl shadow-indigo-400/50 hover:scale-105 active:scale-95 transition-all duration-300 ring-8 ring-slate-50"
                >
                  <Icon size={32} strokeWidth={2.5} />
                </button>
              </div>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id as ViewState)}
              className={`group flex flex-col items-center justify-center gap-1.5 w-14 transition-all duration-300 ${
                isActive ? 'text-indigo-600 -translate-y-1' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className={`relative p-1 rounded-xl transition-colors ${isActive ? 'bg-indigo-50' : 'bg-transparent group-hover:bg-slate-50'}`}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "fill-indigo-100" : ""} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-600 rounded-full" />
                )}
              </div>
              <span className={`text-[10px] font-bold tracking-tight ${isActive ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden group-hover:opacity-100 group-hover:h-auto'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
