
import React, { useMemo } from 'react';
import { InventoryItem, Category } from '../types';
import { ArrowUpRight, Home, Box, Clock, ArrowRight, Wallet, Sparkles, Sofa, Utensils, Bed, Car, Lamp, Smartphone, BarChart3 } from 'lucide-react';
import { ItemCard } from './ItemCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  items: InventoryItem[];
  onNavigate: (view: any) => void;
}

const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

export const Dashboard: React.FC<DashboardProps> = ({ items, onNavigate }) => {
  
  const stats = useMemo(() => {
    const totalValue = items.reduce((acc, item) => acc + item.value, 0);
    const totalItems = items.length;
    
    // Room Data
    const rooms: Record<string, number> = {};
    items.forEach(item => {
      const room = item.room || 'Other';
      rooms[room] = (rooms[room] || 0) + item.value; // Value based instead of count for graph
    });
    
    const roomData = Object.entries(rooms)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
      
    const roomCounts: Record<string, number> = {};
    items.forEach(item => {
       const room = item.room || 'Other';
       roomCounts[room] = (roomCounts[room] || 0) + 1;
    });

    return { totalValue, totalItems, roomData, roomCounts };
  }, [items]);

  const recentItems = [...items].sort((a, b) => b.createdAt - a.createdAt).slice(0, 3);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Stronger, more vibrant gradients
  const getRoomConfig = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('kitchen')) return { 
      bg: 'bg-gradient-to-br from-orange-500 to-red-500',
      icon: <Utensils size={22} className="text-white" />,
      shadow: 'shadow-orange-200'
    };
    if (n.includes('bed')) return { 
      bg: 'bg-gradient-to-br from-indigo-500 to-purple-600',
      icon: <Bed size={22} className="text-white" />,
      shadow: 'shadow-indigo-200'
    };
    if (n.includes('living')) return { 
      bg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
      icon: <Sofa size={22} className="text-white" />,
      shadow: 'shadow-emerald-200'
    };
    if (n.includes('garage')) return { 
      bg: 'bg-gradient-to-br from-slate-600 to-slate-800',
      icon: <Car size={22} className="text-white" />,
      shadow: 'shadow-slate-200'
    };
    if (n.includes('office') || n.includes('study')) return { 
      bg: 'bg-gradient-to-br from-blue-500 to-cyan-600',
      icon: <Smartphone size={22} className="text-white" />,
      shadow: 'shadow-blue-200'
    };
    // Default
    return { 
      bg: 'bg-gradient-to-br from-violet-500 to-fuchsia-600',
      icon: <Home size={22} className="text-white" />,
      shadow: 'shadow-violet-200'
    };
  };

  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-500 relative">
      
      {/* Ambient Background */}
      <div className="fixed top-0 left-0 right-0 h-64 bg-gradient-to-b from-indigo-50 to-slate-50 -z-10 pointer-events-none" />
      <div className="fixed top-[-10%] right-[-20%] w-64 h-64 rounded-full bg-purple-200/30 blur-3xl -z-10 pointer-events-none" />

      {/* Welcome Header */}
      <div className="pt-2 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 tracking-tight mb-1">{getGreeting()}</h1>
          <p className="text-slate-500 font-medium">Here is your home overview.</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-indigo-600 font-bold text-lg border border-indigo-100 shadow-md shadow-indigo-100">
           {stats.totalItems}
        </div>
      </div>

      {/* Main Value Card - Vibrant Gradient */}
      <div className="group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 p-8 text-white shadow-2xl shadow-indigo-300/50 transition-transform active:scale-[0.99]">
         <div className="absolute -right-8 -top-12 h-64 w-64 rounded-full bg-white opacity-10 blur-3xl"></div>
         <div className="absolute -left-8 -bottom-12 h-48 w-48 rounded-full bg-fuchsia-500 opacity-20 blur-3xl"></div>
         
         <div className="relative z-10">
           <div className="flex items-center justify-between mb-6">
             <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-inner">
                <Wallet className="text-white" size={24} />
             </div>
             <button onClick={() => onNavigate('INSURANCE')} className="flex items-center gap-2 text-indigo-900 text-xs font-bold bg-white hover:bg-indigo-50 px-4 py-2 rounded-full shadow-lg transition-colors">
               <Sparkles size={14} className="text-amber-500 fill-amber-500" />
               <span>Analytics</span>
             </button>
           </div>

           <div className="space-y-1 mb-8">
             <div className="text-5xl font-black tracking-tight drop-shadow-sm">
               ${stats.totalValue.toLocaleString()}
             </div>
             <div className="text-indigo-100 font-bold pl-1 text-xs uppercase tracking-widest opacity-90">Total Asset Value</div>
           </div>
           
           <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
             <div>
                <div className="text-2xl font-bold">{stats.totalItems}</div>
                <div className="text-[10px] text-indigo-200 font-bold uppercase tracking-widest">Items</div>
             </div>
             <div>
                <div className="text-2xl font-bold">{Object.keys(Category).length}</div>
                <div className="text-[10px] text-indigo-200 font-bold uppercase tracking-widest">Categories</div>
             </div>
           </div>
         </div>
      </div>

      {/* Cost Per Room Graph - Mini Dashboard Version */}
      {stats.roomData.length > 0 && (
        <div>
           <div className="flex items-center gap-2 mb-4 px-1">
              <BarChart3 size={18} className="text-indigo-500" />
              <h3 className="font-bold text-slate-800 text-lg">Cost by Room</h3>
           </div>
           <div className="bg-white p-5 rounded-[2rem] shadow-lg shadow-slate-200/50 border border-slate-100">
              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.roomData.slice(0, 5)} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" hide />
                    <YAxis hide />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 4, 4]}>
                      {stats.roomData.slice(0, 5).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between mt-2 px-2">
                 {stats.roomData.slice(0, 5).map((room, idx) => (
                    <div key={room.name} className="flex flex-col items-center">
                       <div className="w-2 h-2 rounded-full mb-1" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                       <span className="text-[10px] font-medium text-slate-400 truncate max-w-[60px]">{room.name}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* Browse by Room */}
      <div>
        <div className="flex items-center justify-between mb-5 px-1">
          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <Home size={18} className="text-indigo-500" />
            <span>Rooms</span>
          </h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {stats.roomData.slice(0, 5).map(room => {
             const config = getRoomConfig(room.name);
             const count = stats.roomCounts[room.name] || 0;
             return (
               <button 
                 key={room.name}
                 onClick={() => onNavigate('DETAILS')}
                 className={`group relative flex flex-col justify-between h-32 p-5 rounded-[2rem] shadow-lg shadow-slate-200 text-left overflow-hidden transition-all hover:scale-[1.02] active:scale-95 ${config.bg}`}
               >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-xl group-hover:opacity-20 transition-opacity"></div>
                  
                  <div className="bg-white/20 w-fit p-3 rounded-2xl backdrop-blur-sm border border-white/10 relative z-10 shadow-sm">
                    {config.icon}
                  </div>
                  <div className="relative z-10">
                     <div className="font-bold text-lg text-white leading-tight tracking-tight">{room.name}</div>
                     <div className="text-xs font-medium text-white/80">{count} items</div>
                  </div>
               </button>
             );
          })}
          <button 
            onClick={() => onNavigate('DETAILS')}
            className="flex flex-col items-center justify-center gap-2 h-32 rounded-[2rem] bg-white border border-slate-200 text-slate-400 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-lg hover:shadow-indigo-100 transition-all group"
          >
             <div className="bg-indigo-50 p-3 rounded-full group-hover:scale-110 transition-transform">
               <ArrowRight size={20} className="text-indigo-500" />
             </div>
             <span className="text-xs font-bold">View All</span>
          </button>
        </div>
      </div>

      {/* Recently Added */}
      <div>
        <div className="flex items-center justify-between mb-5 px-1">
          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <Clock size={18} className="text-indigo-500" />
            <span>Recent Activity</span>
          </h3>
          <button onClick={() => onNavigate('DETAILS')} className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-full transition-colors">
            History
          </button>
        </div>
        
        <div className="space-y-4">
          {recentItems.length > 0 ? (
            recentItems.map((item, i) => (
              <div key={item.id} className="animate-in slide-in-from-bottom-2 duration-500" style={{animationDelay: `${i * 100}ms`}}>
                 <ItemCard item={item} />
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-[2rem] border border-dashed border-slate-200 shadow-sm">
              <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-3 text-indigo-300">
                <Box size={32} />
              </div>
              <p className="text-slate-500 font-medium">No items added yet</p>
              <button 
                onClick={() => onNavigate('ADD')}
                className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors"
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
