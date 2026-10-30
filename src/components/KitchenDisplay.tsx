import React, { useState, useEffect } from 'react';
import { 
  ChefHat, 
  Clock, 
  Check, 
  Printer, 
  AlertTriangle, 
  CheckCircle, 
  Flame, 
  Bell
} from 'lucide-react';
import { Order, OrderStatus } from '../types/pos';

interface KitchenDisplayProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onPrintKOT: (order: Order) => void;
}

export const KitchenDisplay: React.FC<KitchenDisplayProps> = ({
  orders,
  onUpdateOrderStatus,
  onPrintKOT
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'in-kitchen' | 'ready'>('all');
  const [completedItemsMap, setCompletedItemsMap] = useState<Record<string, boolean>>({});

  // Active kitchen orders
  const kitchenOrders = orders.filter(
    o => o.status === 'pending' || o.status === 'in-kitchen' || o.status === 'ready'
  );

  const filteredOrders = filterStatus === 'all'
    ? kitchenOrders
    : kitchenOrders.filter(o => o.status === filterStatus);

  // Time difference helper in minutes
  const getElapsedMinutes = (dateString: string) => {
    const diffMs = Date.now() - new Date(dateString).getTime();
    return Math.max(1, Math.floor(diffMs / (1000 * 60)));
  };

  const toggleItemDone = (uniqueKey: string) => {
    setCompletedItemsMap(prev => ({
      ...prev,
      [uniqueKey]: !prev[uniqueKey]
    }));
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-950 space-y-6">
      {/* KDS Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <span>Kitchen Display System (කුස්සියේ තිරය / KDS)</span>
              <span className="px-2 py-0.5 text-xs font-bold rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                {kitchenOrders.length} Active Orders
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Live chef workstation for incoming food tickets, preparation tracking & dispatch
            </p>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterStatus === 'all' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Tickets ({kitchenOrders.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterStatus === 'pending' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Queued ({kitchenOrders.filter(o => o.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilterStatus('in-kitchen')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterStatus === 'in-kitchen' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Cooking ({kitchenOrders.filter(o => o.status === 'in-kitchen').length})
          </button>
          <button
            onClick={() => setFilterStatus('ready')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterStatus === 'ready' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Ready to Serve ({kitchenOrders.filter(o => o.status === 'ready').length})
          </button>
        </div>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-3">
          <ChefHat className="w-12 h-12 mx-auto text-slate-600" />
          <h3 className="text-base font-bold text-slate-200">All Kitchen Orders Clear!</h3>
          <p className="text-xs text-slate-500">New orders placed at POS terminal will automatically appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredOrders.map(order => {
            const elapsed = getElapsedMinutes(order.createdAt);
            const isDelayed = elapsed > 20;
            const isWarning = elapsed > 12 && !isDelayed;

            // Timer color
            const timerClass = isDelayed
              ? 'bg-rose-500/20 text-rose-400 border-rose-500/30 animate-pulse'
              : isWarning
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';

            return (
              <div
                key={order.id}
                className={`bg-slate-900 border rounded-2xl flex flex-col justify-between shadow-xl transition-all ${
                  isDelayed ? 'border-rose-500/80 ring-1 ring-rose-500/50' : 'border-slate-800'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="p-3.5 bg-slate-850 rounded-t-2xl border-b border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-base text-white">
                          #{order.orderNumber}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {order.type}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-orange-400 mt-0.5">
                        {order.tableName || order.customerName || 'Takeaway'}
                      </div>
                    </div>

                    {/* Timer Badge */}
                    <div className={`px-2.5 py-1 rounded-xl border flex items-center gap-1.5 text-xs font-mono font-black ${timerClass}`}>
                      <Clock className="w-3.5 h-3.5" />
                      <span>{elapsed}m ago</span>
                    </div>
                  </div>

                  {/* Items List for Chefs */}
                  <div className="p-3.5 space-y-2.5">
                    {order.items.map((item, idx) => {
                      const itemKey = `${order.id}-${idx}`;
                      const isDone = !!completedItemsMap[itemKey];

                      return (
                        <div
                          key={idx}
                          onClick={() => toggleItemDone(itemKey)}
                          className={`p-2 rounded-xl border cursor-pointer select-none transition ${
                            isDone
                              ? 'bg-slate-950/40 border-slate-800 opacity-40 line-through'
                              : 'bg-slate-950/90 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <span className="w-6 h-6 rounded-md bg-orange-600/20 text-orange-400 border border-orange-500/30 font-mono font-black text-xs flex items-center justify-center shrink-0">
                              {item.quantity}
                            </span>
                            <div className="flex-1">
                              <div className="font-bold text-xs text-white leading-snug">
                                {item.name}
                              </div>
                              {item.notes && (
                                <div className="text-[10px] text-rose-400 font-bold mt-1 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 inline-block">
                                  ⚡ {item.notes}
                                </div>
                              )}
                            </div>
                            {isDone && <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-3 bg-slate-950/80 rounded-b-2xl border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onPrintKOT(order)}
                    title="Print KOT Ticket"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                  >
                    <Printer className="w-4 h-4" />
                  </button>

                  {order.status === 'pending' && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'in-kitchen')}
                      className="flex-1 py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow"
                    >
                      <ChefHat className="w-4 h-4" />
                      <span>Start Cooking</span>
                    </button>
                  )}

                  {order.status === 'in-kitchen' && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'ready')}
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1.5 transition shadow"
                    >
                      <Bell className="w-4 h-4" />
                      <span>Ready to Serve!</span>
                    </button>
                  )}

                  {order.status === 'ready' && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'completed')}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-emerald-600 text-emerald-400 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition border border-emerald-500/30"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Mark Served</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
