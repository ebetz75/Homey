
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
      className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-3 flex gap-3 cursor-pointer overflow-hidden relative"
    >
      {/* Type Indicator Strip */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${isFixture ? 'bg-emerald-500' : 'bg-blue-500'}`} />

      <div className="w-24 h-24 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-100 ml-1 relative">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <Tag size={24} />
          </div>
        )}
        {item.receiptUrl && (
          <div className="absolute bottom-1 right-1 bg-black/50 backdrop-blur p-1 rounded text-white">
            <FileText size={10} />
          </div>
        )}
      </div>
      
      <div className="flex flex-col flex-1 min-w-0 justify-between py-1">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-slate-800 truncate pr-2">{item.name}</h3>
            {isFixture ? (
               <Home size={14} className="text-emerald-600 flex-shrink-0 mt-1" />
            ) : (
               <Box size={14} className="text-blue-600 flex-shrink-0 mt-1" />
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
             <p className="text-xs text-slate-500">{item.category}</p>
             <span className="text-[10px] text-slate-300">•</span>
             <div className="flex items-center gap-1 text-xs text-slate-500">
               <MapPin size={10} />
               <span className="truncate max-w-[100px]">{item.room}</span>
             </div>
          </div>
        </div>
        
        <div className="flex items-end justify-between mt-2">
          <div className="flex flex-col gap-1">
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${isFixture ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
              {isFixture ? 'Stays with Home' : 'Personal'}
            </span>
          </div>
          
          <div className="text-slate-700 font-bold flex items-center">
            <DollarSign size={14} />
            <span>{item.value.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
