
import React, { useMemo } from 'react';
import { InventoryItem, Category } from '../types';
import { ArrowUpRight, Home, Box, Clock, ArrowRight, Wallet, Sparkles, Sofa, Utensils, Bed, Car } from 'lucide-react';
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

  // Colorful styling for specific room types
  const getRoomConfig = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('kitchen')) return { 
      style: 'bg-orange-500 text-white shadow-orange-200', 
      icon: <Utensils size={20} />,
      subtext: 'text-orange-100'
    };
    if (n.includes('bed')) return { 
      style: 'bg-indigo-500 text-white shadow-indigo-200', 
      icon: <Bed size={20} />,
      subtext: 'text-indigo-100'
    };
    if (n.includes('living')) return { 
      style: 'bg-emerald-500 text-white shadow-emerald-200', 
      icon: <Sofa size={20} />,
      subtext: 'text-emerald-100'
    };
    if (n.includes('garage')) return { 
      style: 'bg-slate-600 text-white shadow-slate-300', 
      icon: <Car size={20} />,
      subtext: 'text-slate-300'
    };
    // Default
    return { 
      style: 'bg-blue-500 text-white shadow-blue-200', 
      icon: <Home size={20} />,
      subtext: 'text-blue-100'
    };
  };

  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-500">
      
      {/* Welcome Header */}
      <div className="pt-2 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">{getGreeting()}</h1>
          <p className="text-slate-500 font-medium">Overview of your inventory.</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg border-4 border-white shadow-sm">
           {stats.totalItems}
        </div>
      </div>

      {/* Main Value Card */}
      <div className="group relative overflow-hidden rounded-[2rem] bg-slate-900 p-8 text-white shadow-2xl shadow-slate-900/20 transition-transform active:scale-[0.98]">
         {/* Decorative Background Patterns */}
         <div className="absolute -right-4 -top-10 h-56 w-56 rounded-full bg-indigo-500 opacity-40 blur-[60px]"></div>
         <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-purple-500 opacity-40 blur-[50px]"></div>
         
         <div className="relative z-10">
           <div className="flex items-center justify-between mb-8">
             <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
                <Wallet className="text-indigo-300" size={24} />
             </div>
             <button onClick={() => onNavigate('INSURANCE')} className="flex items-center gap-1 text-white text-xs font-bold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full backdrop-blur-md transition-colors">
               <Sparkles size={12} className="text-yellow-300" />
               <span>Analyze</span>
               <ArrowUpRight size={12} />
             </button>
           </div>

           <div className="space-y-1 mb-8">
             <div className="text-5xl font-bold tracking-tighter">
               ${stats.totalValue.toLocaleString()}
             </div>
             <div className="text-slate-300 font-medium pl-1">Total estimated worth</div>
           </div>
           
           <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
             <div>
                <div className="text-2xl font-bold">{stats.totalItems}</div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">Items</div>
             </div>
             <div>
                <div className="text-2xl font-bold">{Object.keys(Category).length}</div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">Categories</div>
             </div>
           </div>
         </div>
      </div>

      {/* Browse by Room */}
      <div>
        <div className="flex items-center justify-between mb-5 px-1">
          <h3 className="font-bold text-slate-800 text-lg">Rooms</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {stats.roomData.slice(0, 5).map(room => {
             const config = getRoomConfig(room.name);
             return (
               <button 
                 key={room.name}
                 onClick={() => onNavigate('DETAILS')}
                 className={`group relative flex flex-col gap-3 p-5 rounded-[1.5rem] shadow-lg text-left overflow-hidden transition-all hover:scale-[1.02] active:scale-95 ${config.style}`}
               >
                  {/* Shine effect */}
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/20 rounded-full blur-2xl group-hover:bg-white/30 transition-colors"></div>
                  
                  <div className="bg-white/20 w-fit p-2.5 rounded-xl backdrop-blur-sm border border-white/10 relative z-10">
                    {config.icon}
                  </div>
                  <div className="relative z-10">
                     <div className="font-bold truncate text-lg">{room.name}</div>
                     <div className={`text-xs font-medium ${config.subtext} opacity-90`}>{room.count} items</div>
                  </div>
               </button>
             );
          })}
          <button 
            onClick={() => onNavigate('DETAILS')}
            className="flex flex-col items-center justify-center gap-2 p-5 rounded-[1.5rem] bg-slate-50 border-2 border-dashed border-slate-200 text-slate-400 hover:bg-slate-100 hover:border-slate-300 transition-all"
          >
             <div className="bg-white p-3 rounded-full shadow-sm">
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
                 <div className="absolute -inset-2 bg-gradient-to-r from-slate-50 to-white rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10 border border-slate-100 shadow-sm" />
                 <ItemCard item={item} />
                 <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-indigo-600 shadow-sm text-[10px] font-bold text-white">
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
