import React, { useMemo } from 'react';
import { InventoryItem, Category } from '../types';
import { ArrowUpRight, Home, Box, Clock, ArrowRight, Wallet, Sparkles } from 'lucide-react';
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
      rooms[room] = (rooms[room] || 0) + 1;
    });
    
    const roomData = Object.entries(rooms)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
    
    return { totalValue, totalItems, roomData };
  }, [items]);

  const recentItems = [...items].sort((a, b) => b.createdAt - a.createdAt).slice(0, 3);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Styling for specific room types
  const getRoomStyle = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('kitchen')) return 'bg-orange-50 text-orange-600 border-orange-100';
    if (n.includes('bed')) return 'bg-indigo-50 text-indigo-600 border-indigo-100';
    if (n.includes('living')) return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    if (n.includes('garage')) return 'bg-slate-100 text-slate-600 border-slate-200';
    return 'bg-blue-50 text-blue-600 border-blue-100';
  };

  const getRoomIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('garage')) return <Box size={20} />;
    if (n.includes('storage')) return <Box size={20} />;
    return <Home size={20} />;
  };

  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-500">
      
      {/* Welcome Header */}
      <div className="pt-2">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">{getGreeting()}</h1>
        <p className="text-slate-500 font-medium">Here's a summary of your home.</p>
      </div>

      {/* Main Value Card */}
      <div className="group relative overflow-hidden rounded-[2rem] bg-indigo-600 p-8 text-white shadow-2xl shadow-indigo-600/30 transition-transform active:scale-[0.98]">
         {/* Decorative Background Patterns */}
         <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
         <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-indigo-400/20 blur-2xl"></div>
         
         <div className="relative z-10">
           <div className="flex items-center justify-between mb-8">
             <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl">
                <Wallet className="text-white" size={24} />
             </div>
             <div className="flex items-center gap-1 text-indigo-100 text-sm font-medium bg-black/10 px-3 py-1 rounded-full">
               <Sparkles size={12} />
               <span>Asset Value</span>
             </div>
           </div>

           <div className="space-y-1 mb-8">
             <div className="text-5xl font-bold tracking-tighter">
               ${stats.totalValue.toLocaleString()}
             </div>
             <div className="text-indigo-200 font-medium pl-1">Total estimated worth</div>
           </div>
           
           <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
             <div>
                <div className="text-2xl font-bold">{stats.totalItems}</div>
                <div className="text-xs text-indigo-200 font-medium uppercase tracking-wide">Total Items</div>
             </div>
             <div>
                <div className="text-2xl font-bold">{Object.keys(Category).length}</div>
                <div className="text-xs text-indigo-200 font-medium uppercase tracking-wide">Categories</div>
             </div>
           </div>
         </div>
      </div>

      {/* Browse by Room */}
      <div>
        <div className="flex items-center justify-between mb-5 px-1">
          <h3 className="font-bold text-slate-800 text-lg">Rooms</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {stats.roomData.slice(0, 5).map(room => (
             <button 
               key={room.name}
               onClick={() => onNavigate('DETAILS')}
               className={`flex flex-col gap-3 p-4 rounded-2xl border transition-all hover:shadow-md text-left ${getRoomStyle(room.name)}`}
             >
                <div className="bg-white/60 w-fit p-2 rounded-xl backdrop-blur-sm">
                  {getRoomIcon(room.name)}
                </div>
                <div>
                   <div className="font-bold truncate">{room.name}</div>
                   <div className="text-xs opacity-70 font-medium">{room.count} items</div>
                </div>
             </button>
          ))}
          <button 
            onClick={() => onNavigate('DETAILS')}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-slate-50 border border-slate-200 border-dashed text-slate-400 hover:bg-slate-100 hover:border-slate-300 transition-all"
          >
             <div className="bg-white p-2 rounded-full shadow-sm">
               <ArrowRight size={20} />
             </div>
             <span className="text-xs font-bold">View All</span>
          </button>
        </div>
      </div>

      {/* Recently Added */}
      <div>
        <div className="flex items-center justify-between mb-5 px-1">
          <h3 className="font-bold text-slate-800 text-lg">Recent Items</h3>
          <button onClick={() => onNavigate('DETAILS')} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          {recentItems.length > 0 ? (
            recentItems.map(item => (
              <div key={item.id} className="relative group">
                 <div className="absolute -inset-2 bg-slate-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                 <ItemCard item={item} />
                 <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/80 backdrop-blur shadow-sm text-[10px] font-bold text-slate-500 border border-slate-100">
                      <Clock size={10} />
                      NEW
                    </span>
                 </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
                <Box size={32} />
              </div>
              <p className="text-slate-500 font-medium">No items added yet</p>
              <button 
                onClick={() => onNavigate('ADD')}
                className="mt-3 text-sm font-bold text-indigo-600 hover:underline"
              >
                Add your first item
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
