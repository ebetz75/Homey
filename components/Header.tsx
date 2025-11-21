import React from 'react';
import { LayoutDashboard } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-3 shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="bg-primary-600 text-white p-1.5 rounded-lg">
          <LayoutDashboard size={20} />
        </div>
        <h1 className="text-lg font-bold text-slate-800 tracking-tight">Homey AI</h1>
      </div>
      <div className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
        Beta
      </div>
    </header>
  );
};
