import React, { useState } from 'react';
import { 
  Search, 
  Printer, 
  FileText, 
  Utensils, 
  ShoppingBag, 
  Truck, 
  CheckCircle, 
  Clock, 
  ChefHat 
} from 'lucide-react';
import { Order, OrderType, OrderStatus } from '../types/pos';

interface OrdersHistoryProps {
  orders: Order[];
  onViewReceipt: (order: Order) => void;
  onPrintKOT: (order: Order) => void;
}

export const OrdersHistory: React.FC<OrdersHistoryProps> = ({
  orders,
  onViewReceipt,
  onPrintKOT
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredOrders = orders.filter(order => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      order.orderNumber.toString().includes(q) ||
      (order.customerName && order.customerName.toLowerCase().includes(q)) ||
      (order.tableName && order.tableName.toLowerCase().includes(q));

    const matchesType = filterType === 'all' || order.type === filterType;
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-950 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-black text-white">Order Management & History (ඇණවුම් ඉතිහාසය)</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            View, reprint invoices, inspect items and review order details
          </p>
        </div>

        {/* Search */}
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search order #, customer or table..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-1.5 flex-wrap text-xs font-semibold">
          <span className="text-slate-400 mr-1 text-[11px]">Type:</span>
          {['all', 'dine-in', 'takeaway', 'delivery'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-lg capitalize transition ${
                filterType === type ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap text-xs font-semibold">
          <span className="text-slate-400 mr-1 text-[11px]">Status:</span>
          {['all', 'completed', 'in-kitchen', 'ready', 'pending'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded-lg capitalize transition ${
                filterStatus === st ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-black tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Type / Location</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items Summary</th>
                <th className="py-3 px-4 text-right">Total (LKR)</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No orders found matching filters
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => {
                  const formattedDate = new Date(order.createdAt).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <tr key={order.id} className="hover:bg-slate-850/60 transition">
                      <td className="py-3 px-4 font-mono font-bold text-white">
                        #{order.orderNumber}
                      </td>

                      <td className="py-3 px-4 text-slate-400 font-mono">
                        {formattedDate}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          {order.type === 'dine-in' && <Utensils className="w-3.5 h-3.5 text-orange-400" />}
                          {order.type === 'takeaway' && <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />}
                          {order.type === 'delivery' && <Truck className="w-3.5 h-3.5 text-blue-400" />}
                          <span className="font-semibold text-slate-200">
                            {order.type === 'dine-in' ? order.tableName || 'Dine-In' : order.type.toUpperCase()}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-300">
                        {order.customerName || 'Walk-in'}
                      </td>

                      <td className="py-3 px-4 text-slate-400 max-w-xs truncate">
                        {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-black text-orange-400">
                        Rs. {order.total.toLocaleString()}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            order.status === 'completed'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : order.status === 'in-kitchen'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : order.status === 'ready'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onPrintKOT(order)}
                            title="Reprint Kitchen KOT"
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition"
                          >
                            <ChefHat className="w-3.5 h-3.5 text-amber-400" />
                          </button>
                          <button
                            onClick={() => onViewReceipt(order)}
                            title="View & Print Bill Receipt"
                            className="px-2.5 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition font-bold flex items-center gap-1 shadow"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Bill</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
