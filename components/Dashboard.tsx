
import React, { useMemo } from 'react';
import { InventoryItem, Category } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { TrendingUp, Package, DollarSign, AlertTriangle, CheckCircle, Home, ArrowRight, ShieldCheck } from 'lucide-react';

interface DashboardProps {
  items: InventoryItem[];
  policyLimit: number;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1', '#64748b'];

export const Dashboard: React.FC<DashboardProps> = ({ items, policyLimit }) => {
  
  const stats = useMemo(() => {
    const totalValue = items.reduce((acc, item) => acc + item.value, 0);
    const totalItems = items.length;
    
    // Category Data
    const categoryData = Object.values(Category).map(cat => {
      const catItems = items.filter(i => i.category === cat);
      return {
        name: cat,
        value: catItems.reduce((acc, i) => acc + i.value, 0),
        count: catItems.length
      };
    }).filter(d => d.value > 0);

    // Room Data
    const rooms: Record<string, number> = {};
    items.forEach(item => {
      const room = item.room || 'Other';
      rooms[room] = (rooms[room] || 0) + item.value;
    });
    const roomData = Object.entries(rooms)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value); // Sort highest value first
    
    return { totalValue, totalItems, categoryData, roomData };
  }, [items]);

  const coveragePct = Math.min((stats.totalValue / policyLimit) * 100, 100);
  const isUnderInsured = stats.totalValue > policyLimit;

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500">
      
      {/* Insurance Health Card */}
      <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-xl shadow-slate-900/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <ShieldCheck size={100} />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-400" />
              Coverage Health
            </h3>
            <span className={`text-xs px-2 py-1 rounded-full font-bold ${isUnderInsured ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
              {isUnderInsured ? 'UNDER INSURED' : 'PROTECTED'}
            </span>
          </div>
          
          <div className="mb-4">
            <div className="text-3xl font-bold tracking-tight mb-1">
              ${stats.totalValue.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400">
              Documented Assets vs ${policyLimit.toLocaleString()} Policy Limit
            </div>
          </div>

          <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden mb-2">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${isUnderInsured ? 'bg-red-500' : 'bg-emerald-500'}`}
              style={{ width: `${coveragePct}%` }} 
            />
          </div>
          
          <div className="flex justify-between text-[10px] text-slate-400 font-medium uppercase tracking-wider">
             <span>$0</span>
             <span>{Math.round(coveragePct)}% Used</span>
             <span>${policyLimit.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Package size={16} />
            <span className="text-xs font-medium">Total Items</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">
            {stats.totalItems}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-center">
           <div className="text-xs text-slate-500 mb-1">Avg Item Value</div>
           <div className="font-bold text-slate-800 text-lg">
             ${stats.totalItems > 0 ? Math.round(stats.totalValue / stats.totalItems).toLocaleString() : 0}
           </div>
        </div>
      </div>

      {/* Room Highlights */}
      {stats.roomData.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-sm font-bold text-slate-700">Top Rooms by Value</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {stats.roomData.slice(0, 4).map((room, idx) => (
              <div key={room.name} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute right-0 bottom-0 p-2 text-slate-100 opacity-50 -rotate-12 group-hover:scale-110 transition-transform">
                   <Home size={40} />
                </div>
                <div className="relative z-10">
                  <div className="text-xs text-slate-500 font-medium mb-1 truncate">{room.name}</div>
                  <div className="font-bold text-slate-800">${room.value.toLocaleString()}</div>
                </div>
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${idx === 0 ? 'bg-primary-500' : 'bg-slate-200'}`} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts */}
      {stats.totalItems > 0 ? (
        <div className="space-y-6">
           <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <TrendingUp size={16} />
              Value by Category
            </h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `$${value.toLocaleString()}`}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
               {stats.categoryData.slice(0, 4).map((cat, idx) => (
                 <div key={cat.name} className="flex items-center gap-2 text-xs text-slate-600">
                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                   <span className="truncate flex-1">{cat.name}</span>
                   <span className="font-medium">${cat.value.toLocaleString()}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
            <Package size={32} />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-1">No Items Yet</h3>
          <p className="text-sm text-slate-500 max-w-[250px]">Start adding items to your ledger to see analytics and insights.</p>
        </div>
      )}
    </div>
  );
};
