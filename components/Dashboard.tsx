
import React, { useMemo } from 'react';
import { InventoryItem, Category } from '../types';
import { Package, ArrowUpRight, Home, Box, Clock, ArrowRight } from 'lucide-react';
import { ItemCard } from './ItemCard';

interface DashboardProps {
  items: InventoryItem[];
  onNavigate: (view: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ items, onNavigate }) => {
  
  const stats = useMemo(() => {
    const totalValue = items.reduce((acc, item) => acc + item.value, 0);
    const totalItems = items.length;
    
    // Room Data
    const rooms: Record<string, number> = {};
    items.forEach(item => {
      const room = item.room || 'Other';
      rooms[room] = (rooms[room] || 0) + 1; // Count items
    });
    
    // Sort rooms by item count
    const roomData = Object.entries(rooms)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
    
    return { totalValue, totalItems, roomData };
  }, [items]);

  const recentItems = [...items].sort((a, b) => b.createdAt - a.createdAt).slice(0, 3);

  // Icons for rooms (mapping)
  const getRoomIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('kitchen')) return <div className="bg-orange-100 text-orange-600 p-2 rounded-lg"><Home size={20} /></div>;
    if (n.includes('bed')) return <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg"><Box size={20} /></div>;
    if (n.includes('living')) return <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg"><Home size={20} /></div>;
    if (n.includes('garage')) return <div className="bg-slate-200 text-slate-600 p-2 rounded-lg"><Box size={20} /></div>;
    return <div className="bg-blue-100 text-blue-600 p-2 rounded-lg"><Home size={20} /></div>;
  };

  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-500">
      
      {/* Welcome Header */}
      <div className="flex justify-between items-center pt-2">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
           <p className="text-sm text-slate-500">Your home inventory summary</p>
        </div>
        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
           <span className="font-bold text-slate-500 text-xs">ME</span>
        </div>
      </div>

      {/* Main Value Card */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl p-6 text-white shadow-lg shadow-primary-600/20 relative overflow-hidden">
         <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4">
            <Box size={200} />
         </div>
         <div className="relative z-10">
           <div className="flex items-start justify-between mb-6">
             <div>
               <div className="text-primary-100 text-sm font-medium mb-1">Total Asset Value</div>
               <div className="text-4xl font-bold tracking-tight">${stats.totalValue.toLocaleString()}</div>
             </div>
             <div className="bg-white/10 backdrop-blur rounded-lg p-2">
               <ArrowUpRight size={24} className="text-primary-100" />
             </div>
           </div>
           
           <div className="flex gap-4">
             <div className="bg-black/10 rounded-xl px-4 py-2 flex-1">
                <div className="text-xs text-primary-200">Total Items</div>
                <div className="text-lg font-bold">{stats.totalItems}</div>
             </div>
             <div className="bg-black/10 rounded-xl px-4 py-2 flex-1">
                <div className="text-xs text-primary-200">Categories</div>
                <div className="text-lg font-bold">{Object.keys(Category).length}</div>
             </div>
           </div>
         </div>
      </div>

      {/* Browse by Room */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="font-bold text-slate-800">Browse by Room</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {stats.roomData.slice(0, 4).map(room => (
             <button 
               key={room.name}
               onClick={() => onNavigate('DETAILS')} // In a real app this would filter
               className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all text-left"
             >
                {getRoomIcon(room.name)}
                <div className="min-w-0">
                   <div className="font-semibold text-slate-800 truncate text-sm">{room.name}</div>
                   <div className="text-xs text-slate-500">{room.count} items</div>
                </div>
             </button>
          ))}
          <button 
            onClick={() => onNavigate('DETAILS')}
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-100 border-dashed text-slate-400 hover:bg-slate-100 transition-colors"
          >
             <span className="text-sm font-medium">View All</span>
             <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Recently Added */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="font-bold text-slate-800">Recently Added</h3>
          <button onClick={() => onNavigate('DETAILS')} className="text-xs font-medium text-primary-600">View All</button>
        </div>
        
        <div className="space-y-3">
          {recentItems.length > 0 ? (
            recentItems.map(item => (
              <div key={item.id} className="relative">
                 <ItemCard item={item} />
                 <div className="absolute top-3 right-3 text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                    <Clock size={10} />
                    new
                 </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              No recent items found
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
