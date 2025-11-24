
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header.tsx';
import { Navigation } from './components/Navigation.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { InsuranceAnalytics } from './components/InsuranceAnalytics.tsx';
import { ItemCard } from './components/ItemCard.tsx';
import { CameraModal } from './components/CameraModal.tsx';
import { Category, Condition, InventoryItem, ViewState, ItemType } from './types';
import { analyzeItemImage } from './services/geminiService.ts';
import { Loader2, Search, Sparkles, Save, WifiOff, Download, Trash2, Briefcase, Shield, Camera, ShieldCheck, ArrowLeft } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const DEMO_ITEMS: InventoryItem[] = [
  { id: '1', name: 'MacBook Pro M1', category: Category.ELECTRONICS, room: 'Office', type: ItemType.PERSONAL, value: 1200, purchaseDate: '2022-05-15', description: '14 inch silver laptop', condition: Condition.GOOD, createdAt: Date.now() },
  { id: '2', name: 'Viking Gas Range', category: Category.APPLIANCES, room: 'Kitchen', type: ItemType.FIXTURE, value: 4500, purchaseDate: '2020-11-20', description: '6-burner gas stove, stainless steel', condition: Condition.GOOD, createdAt: Date.now() - 10000 },
];

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('DASHBOARD');
  const [items, setItems] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('ledger_items');
    return saved ? JSON.parse(saved) : DEMO_ITEMS;
  });
  const [policyLimit, setPolicyLimit] = useState<number>(() => {
    const saved = localStorage.getItem('policy_limit');
    return saved ? Number(saved) : 100000;
  });

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Form State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraMode, setCameraMode] = useState<'ITEM' | 'RECEIPT'>('ITEM');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [tempReceipt, setTempReceipt] = useState<string | null>(null);
  
  // Form Data
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    category: Category.OTHER,
    condition: Condition.GOOD,
    type: ItemType.PERSONAL,
    room: 'Living Room',
    purchaseDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    localStorage.setItem('ledger_items', JSON.stringify(items));
  }, [items]);
  
  useEffect(() => {
    localStorage.setItem('policy_limit', policyLimit.toString());
  }, [policyLimit]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleCapture = useCallback(async (imageSrc: string) => {
    // Handle Receipt Capture
    if (cameraMode === 'RECEIPT') {
      setTempReceipt(imageSrc);
      return;
    }

    // Handle Item Capture
    if (!isOnline) {
      alert("Offline Mode: AI analysis unavailable.");
      setTempImage(imageSrc);
      setNewItem(prev => ({ ...prev, imageUrl: imageSrc }));
      return;
    }

    setTempImage(imageSrc);
    setIsAnalyzing(true);
    setNewItem(prev => ({ ...prev, imageUrl: imageSrc }));

    try {
      const result = await analyzeItemImage(imageSrc);
      setNewItem(prev => ({
        ...prev,
        name: result.name,
        category: result.category as Category,
        room: result.room || 'Unknown Room',
        type: result.type as ItemType,
        value: result.estimatedValue,
        description: result.description,
        condition: result.condition as Condition
      }));
    } catch (error) {
      console.error("Analysis failed", error);
      alert("Could not analyze image using AI. Please enter details manually.");
    } finally {
      setIsAnalyzing(false);
    }
  }, [isOnline, cameraMode]);

  const openCamera = (mode: 'ITEM' | 'RECEIPT') => {
    setCameraMode(mode);
    setIsCameraOpen(true);
  };

  const handleSaveItem = () => {
    if (!newItem.name || !newItem.value) {
      alert("Please provide at least a name and value.");
      return;
    }

    const item: InventoryItem = {
      id: Date.now().toString(),
      name: newItem.name,
      category: newItem.category as Category || Category.OTHER,
      room: newItem.room || 'General',
      type: newItem.type as ItemType || ItemType.PERSONAL,
      value: Number(newItem.value),
      purchaseDate: newItem.purchaseDate || new Date().toISOString().split('T')[0],
      description: newItem.description || '',
      condition: newItem.condition as Condition || Condition.GOOD,
      imageUrl: tempImage || undefined,
      receiptUrl: tempReceipt || undefined,
      createdAt: Date.now()
    };

    setItems(prev => [item, ...prev]);
    setView('DASHBOARD');
    resetForm();
  };

  const resetForm = () => {
    setNewItem({
      category: Category.OTHER,
      condition: Condition.GOOD,
      type: ItemType.PERSONAL,
      room: 'Living Room',
      purchaseDate: new Date().toISOString().split('T')[0]
    });
    setTempImage(null);
    setTempReceipt(null);
  };

  const generatePDF = (type: 'INSURANCE' | 'REAL_ESTATE') => {
    const doc = new jsPDF();
    
    if (type === 'INSURANCE') {
      doc.setFontSize(18);
      doc.setTextColor(37, 99, 235);
      doc.text("Homey Insurance Report", 14, 20);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);
      doc.text(`Total Value: $${items.reduce((a,b) => a + b.value, 0).toLocaleString()}`, 14, 34);

      const tableData = items.map(item => [
        item.name,
        item.category,
        item.room,
        `$${item.value.toLocaleString()}`,
        item.condition,
        item.receiptUrl ? 'Yes' : 'No'
      ]);

      autoTable(doc, {
        startY: 40,
        head: [['Item', 'Category', 'Location', 'Value', 'Cond', 'Receipt']],
        body: tableData,
      });
      doc.save('Insurance_Report.pdf');
    } else {
      // REAL ESTATE TRANSFER REPORT
      doc.setFontSize(18);
      doc.setTextColor(16, 185, 129); // Emerald
      doc.text("Real Estate Conveyance Schedule", 14, 20);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text("This document lists fixtures conveying with property and excluded personal items.", 14, 28);

      // Part 1: Fixtures (Stay)
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text("Section A: Fixtures (Staying with Property)", 14, 40);
      
      const fixtures = items.filter(i => i.type === ItemType.FIXTURE);
      const fixtureData = fixtures.map(item => [item.name, item.room, item.condition, item.description]);
      
      autoTable(doc, {
        startY: 45,
        head: [['Item', 'Location', 'Condition', 'Description/Serial']],
        body: fixtureData,
        headStyles: { fillColor: [16, 185, 129] },
      });

      // Part 2: Exclusions (Personal)
      const finalY = (doc as any).lastAutoTable.finalY || 50;
      doc.text("Section B: Excluded Personal Property", 14, finalY + 15);
      
      const personal = items.filter(i => i.type === ItemType.PERSONAL);
      const personalData = personal.map(item => [item.name, item.room, "Excluded"]);

      autoTable(doc, {
        startY: finalY + 20,
        head: [['Item', 'Location', 'Status']],
        body: personalData,
        headStyles: { fillColor: [100, 116, 139] }, // Slate
      });

      doc.save('Real_Estate_Schedule.pdf');
    }
  };

  const renderContent = () => {
    switch (view) {
      case 'DASHBOARD':
        return <Dashboard items={items} onNavigate={setView} />;
      
      case 'INSURANCE':
        return (
          <InsuranceAnalytics 
            items={items} 
            policyLimit={policyLimit} 
            onGenerateReport={generatePDF}
          />
        );
      
      case 'DETAILS':
        return (
          <div className="space-y-4 pb-24">
            <div className="flex items-center gap-2 mb-4">
              <button onClick={() => setView('DASHBOARD')} className="p-2 rounded-full hover:bg-slate-100">
                <ArrowLeft size={20} className="text-slate-600"/>
              </button>
              <h2 className="text-xl font-bold text-slate-800">Item Registry</h2>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search inventory..." 
                className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
               <button className="px-4 py-1.5 bg-slate-800 text-white text-xs rounded-full font-medium whitespace-nowrap shadow-lg shadow-slate-200">All Items</button>
               <button className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs rounded-full font-medium whitespace-nowrap">Fixtures Only</button>
               <button className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs rounded-full font-medium whitespace-nowrap">Personal Only</button>
            </div>
            <div className="space-y-3">
              {items.map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        );

      case 'ADD':
        return (
          <div className="pb-24 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-2 mb-6">
               <button onClick={() => setView('DASHBOARD')} className="p-2 rounded-full hover:bg-slate-100">
                  <ArrowLeft size={20} className="text-slate-600"/>
               </button>
               <h2 className="text-xl font-bold text-slate-800">Add New Item</h2>
            </div>
            
            <div className="mb-6">
              <div 
                onClick={() => !isAnalyzing && openCamera('ITEM')}
                className={`
                  relative w-full aspect-video rounded-2xl border-2 border-dashed
                  flex flex-col items-center justify-center cursor-pointer overflow-hidden
                  transition-all shadow-inner group
                  ${tempImage ? 'border-transparent' : 'border-indigo-300 bg-indigo-50/50 hover:bg-indigo-50'}
                `}
              >
                {tempImage ? (
                  <>
                    <img src={tempImage} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <div className="bg-white/20 backdrop-blur text-white px-4 py-2 rounded-full font-medium">Retake Photo</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-white text-indigo-600 rounded-full flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform"><Sparkles size={28} /></div>
                    <span className="font-bold text-indigo-900">Scan with Gemini AI</span>
                    <span className="text-xs text-indigo-500 mt-1 font-medium">Auto-detects Room, Type & Value</span>
                  </>
                )}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center z-10">
                    <Loader2 size={32} className="animate-spin text-indigo-600 mb-2" />
                    <p className="text-sm font-medium text-indigo-900">Analyzing Image...</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Item Name</label>
                <input 
                  type="text" 
                  value={newItem.name || ''}
                  onChange={e => setNewItem({...newItem, name: e.target.value})}
                  className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none shadow-sm font-medium text-slate-900"
                  placeholder="e.g. Crystal Chandelier"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Room</label>
                  <input 
                    type="text"
                    list="rooms"
                    value={newItem.room || ''}
                    onChange={e => setNewItem({...newItem, room: e.target.value})}
                    className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none shadow-sm font-medium"
                    placeholder="Kitchen"
                  />
                  <datalist id="rooms">
                    <option value="Kitchen" />
                    <option value="Living Room" />
                    <option value="Master Bedroom" />
                    <option value="Garage" />
                    <option value="Basement" />
                  </datalist>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Type</label>
                  <select 
                    value={newItem.type}
                    onChange={e => setNewItem({...newItem, type: e.target.value as ItemType})}
                    className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none shadow-sm font-medium text-slate-700"
                  >
                    {Object.values(ItemType).map(t => <option key={t as string} value={t as string}>{t as string}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Value ($)</label>
                  <input 
                    type="number" 
                    value={newItem.value || ''}
                    onChange={e => setNewItem({...newItem, value: Number(e.target.value)})}
                    className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none shadow-sm font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Category</label>
                  <select 
                    value={newItem.category}
                    onChange={e => setNewItem({...newItem, category: e.target.value})}
                    className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none shadow-sm font-medium text-slate-700"
                  >
                    {Object.values(Category).map(c => <option key={c as string} value={c as string}>{c as string}</option>)}
                  </select>
                </div>
              </div>
              
              {/* Receipt Capture Section */}
              <div>
                 <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Proof of Purchase</label>
                 <div 
                    onClick={() => openCamera('RECEIPT')}
                    className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${tempReceipt ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}`}
                 >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden ${tempReceipt ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                       {tempReceipt ? (
                          <img src={tempReceipt} alt="Receipt" className="w-full h-full object-cover" />
                       ) : (
                          <Camera size={24} />
                       )}
                    </div>
                    <div className="flex-1">
                       <div className={`text-sm font-bold ${tempReceipt ? 'text-emerald-800' : 'text-slate-700'}`}>{tempReceipt ? 'Receipt Attached' : 'Add Receipt or Warranty'}</div>
                       <div className="text-xs text-slate-400">{tempReceipt ? 'Tap to change photo' : 'Take a photo of receipt or upload'}</div>
                    </div>
                    {tempReceipt && <div className="text-emerald-500"><ShieldCheck size={20} strokeWidth={2.5} /></div>}
                 </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Description / Serial #</label>
                <textarea 
                  value={newItem.description || ''}
                  onChange={e => setNewItem({...newItem, description: e.target.value})}
                  className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none h-24 resize-none shadow-sm"
                  placeholder="Model numbers, warranty info, etc."
                />
              </div>

              <button 
                onClick={handleSaveItem}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-indigo-200 active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                <Save size={20} strokeWidth={2.5} />
                Save Item
              </button>
            </div>
          </div>
        );

      case 'SETTINGS':
        return (
           <div className="pb-24">
             <h2 className="text-xl font-bold text-slate-800 mb-4">Settings</h2>
             
             <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm">
                <div className="flex items-center gap-2 mb-2 text-slate-800 font-bold">
                  <Shield size={18} className="text-indigo-600" />
                  <span>Coverage Goals</span>
                </div>
                <div className="text-xs text-slate-500 mb-3">Set your insurance policy limit to track under-insurance risks.</div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input 
                    type="number" 
                    value={policyLimit}
                    onChange={(e) => setPolicyLimit(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-7 pr-4 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-semibold"
                  />
                </div>
             </div>

             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Data Exports</h3>
             <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-sm">
               
               <div className="p-4 flex items-center justify-between group cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => generatePDF('REAL_ESTATE')}>
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Briefcase size={20} /></div>
                    <div>
                      <div className="text-slate-800 font-bold">Real Estate Schedule</div>
                      <div className="text-xs text-slate-500">Transferable fixtures list</div>
                    </div>
                 </div>
                 <Download size={18} className="text-slate-400 group-hover:text-slate-600" />
               </div>

                <div className="p-4 flex items-center justify-between group cursor-pointer hover:bg-red-50 transition-colors"
                  onClick={() => {
                    if(confirm("Delete all items?")) {
                      localStorage.removeItem('ledger_items');
                      setItems([]);
                      setView('DASHBOARD');
                    }
                  }}
                >
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-50 text-red-600 rounded-lg"><Trash2 size={20} /></div>
                    <div>
                      <div className="text-red-700 font-bold">Clear Storage</div>
                    </div>
                 </div>
               </div>
             </div>
             
             <div className="mt-6 mx-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
                <h3 className="text-emerald-800 font-bold mb-1">Real Estate Agent?</h3>
                <p className="text-xs text-emerald-600 mb-3">License Homey for your entire brokerage.</p>
                <button className="px-4 py-2 bg-white text-emerald-700 text-xs font-bold border border-emerald-200 rounded-lg shadow-sm">
                  Contact Sales
                </button>
             </div>
           </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header />
      {!isOnline && (
        <div className="bg-amber-50 border-b border-amber-100 px-4 py-2 flex items-center justify-center gap-2 text-xs font-medium text-amber-700">
          <WifiOff size={14} />
          <span>You are offline. AI features are unavailable.</span>
        </div>
      )}
      <main className="max-w-md mx-auto p-4 min-h-[calc(100vh-140px)]">
        {renderContent()}
      </main>
      <Navigation currentView={view} onChangeView={setView} />
      <CameraModal isOpen={isCameraOpen} onClose={() => setIsCameraOpen(false)} onCapture={handleCapture} />
    </div>
  );
};

export default App;
