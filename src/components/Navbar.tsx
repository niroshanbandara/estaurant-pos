import React, { useState, useEffect } from 'react';
import { 
  Store, 
  LayoutGrid, 
  ChefHat, 
  Clock, 
  Receipt, 
  BarChart3, 
  Maximize2, 
  Minimize2,
  BellRing
} from 'lucide-react';
import { RESTAURANT_CONFIG } from '../data/mockData';

interface NavbarProps {
  activeTab: 'pos' | 'tables' | 'kitchen' | 'orders' | 'reports';
  setActiveTab: (tab: 'pos' | 'tables' | 'kitchen' | 'orders' | 'reports') => void;
  activeKitchenOrdersCount: number;
  occupiedTablesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeKitchenOrdersCount,
  occupiedTablesCount
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 select-none shadow-lg">
      <div className="px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Restaurant Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg tracking-tight text-white leading-none">
                {RESTAURANT_CONFIG.name}
              </h1>
              <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded">
                POS
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              {RESTAURANT_CONFIG.branch} &bull; <span className="text-emerald-400 font-mono">System Online</span>
            </p>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="flex items-center gap-1.5 bg-slate-950/70 p-1.5 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setActiveTab('pos')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'pos'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>POS Terminal</span>
          </button>

          <button
            onClick={() => setActiveTab('tables')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all relative ${
              activeTab === 'tables'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Tables (මේස)</span>
            {occupiedTablesCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-xs font-bold bg-amber-500 text-slate-950 rounded-full">
                {occupiedTablesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('kitchen')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all relative ${
              activeTab === 'kitchen'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ChefHat className="w-4 h-4" />
            <span>Kitchen (KDS)</span>
            {activeKitchenOrdersCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-xs font-bold bg-rose-500 text-white rounded-full animate-pulse">
                {activeKitchenOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'orders'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Orders History</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'reports'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Day Reports</span>
          </button>
        </nav>

        {/* Right Info & Clock */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="font-mono font-bold text-sm text-slate-100 flex items-center justify-end gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              {currentTime || '--:--:--'}
            </div>
            <div className="text-[11px] text-slate-400">
              Cashier: <span className="text-orange-400 font-medium">{RESTAURANT_CONFIG.cashier}</span>
            </div>
          </div>

          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen for Cashier"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
