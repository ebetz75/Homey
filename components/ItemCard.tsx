
import React from 'react';
import { InventoryItem, ItemType } from '../types';
import { Tag, Calendar, DollarSign, Home, Box, MapPin, FileText } from 'lucide-react';

interface ItemCardProps {
  item: InventoryItem;
  onClick?: (item: InventoryItem) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onClick }) => {
  const isFixture = item.type === ItemType.FIXTURE;

  return (
    <div 
      onClick={() => onClick?.(item)}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-3 flex gap-3 cursor-pointer overflow-hidden relative group"
    >
      {/* Type Indicator Strip */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${isFixture ? 'bg-emerald-500' : 'bg-blue-500'}`} />

      <div className="w-24 h-24 rounded-xl bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-100 ml-2 relative">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
            <Tag size={24} />
          </div>
        )}
        {item.receiptUrl && (
          <div className="absolute bottom-1 right-1 bg-emerald-500/90 backdrop-blur p-1 rounded-full text-white shadow-sm">
            <FileText size={10} />
          </div>
        )}
      </div>
      
      <div className="flex flex-col flex-1 min-w-0 justify-between py-1">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-slate-800 truncate pr-2 text-sm leading-tight">{item.name}</h3>
            {isFixture ? (
               <div className="bg-emerald-100 p-1 rounded-full flex-shrink-0">
                  <Home size={12} className="text-emerald-700" />
               </div>
            ) : (
               <div className="bg-blue-100 p-1 rounded-full flex-shrink-0">
                  <Box size={12} className="text-blue-700" />
               </div>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1.5">
             <p className="text-xs text-slate-500 font-medium">{item.category}</p>
             <span className="text-[8px] text-slate-300">●</span>
             <div className="flex items-center gap-1 text-xs text-slate-500">
               <MapPin size={10} />
               <span className="truncate max-w-[100px]">{item.room}</span>
             </div>
          </div>
        </div>
        
        <div className="flex items-end justify-between mt-2">
          <div className="flex flex-col gap-1">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${isFixture ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
              {isFixture ? 'FIXTURE' : 'PERSONAL'}
            </span>
          </div>
          
          <div className="text-slate-900 font-bold flex items-center bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
            <span className="text-xs mr-0.5">$</span>
            <span>{item.value.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
