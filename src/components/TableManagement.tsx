import React, { useState } from 'react';
import { 
  Users, 
  Clock, 
  Receipt, 
  PlusCircle, 
  CheckCircle2, 
  Sparkles,
  Filter
} from 'lucide-react';
import { DiningTable, Order } from '../types/pos';

interface TableManagementProps {
  tables: DiningTable[];
  orders: Order[];
  onOpenOrderForTable: (tableId: string) => void;
  onSettleBillForTable: (order: Order) => void;
  onUpdateTableStatus: (tableId: string, status: DiningTable['status']) => void;
}

export const TableManagement: React.FC<TableManagementProps> = ({
  tables,
  orders,
  onOpenOrderForTable,
  onSettleBillForTable,
  onUpdateTableStatus
}) => {
  const [selectedSection, setSelectedSection] = useState<string>('All');

  const sections = ['All', 'Main Hall', 'AC VIP Room', 'Outdoor Garden', 'Rooftop'];

  const filteredTables = selectedSection === 'All'
    ? tables
    : tables.filter(t => t.section === selectedSection);

  const availableCount = tables.filter(t => t.status === 'available').length;
  const occupiedCount = tables.filter(t => t.status === 'occupied').length;
  const billingCount = tables.filter(t => t.status === 'billing').length;
  const reservedCount = tables.filter(t => t.status === 'reserved').length;

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-950 space-y-6">
      {/* Top Banner & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <span>Table Floor Management (මේස කළමනාකරණය)</span>
            <span className="text-xs px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
              Live Floor View
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time visual table statuses, running checks & seat turnover tracking
          </p>
        </div>

        {/* Status Count Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Available: {availableCount}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>Occupied: {occupiedCount}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Billing: {billingCount}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Reserved: {reservedCount}</span>
          </div>
        </div>
      </div>

      {/* Floor Sections Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="w-4 h-4 text-slate-500 mr-1" />
        {sections.map(sec => (
          <button
            key={sec}
            onClick={() => setSelectedSection(sec)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedSection === sec
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {sec}
          </button>
        ))}
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTables.map(table => {
          const activeOrder = table.currentOrderId
            ? orders.find(o => o.id === table.currentOrderId)
            : undefined;

          // Status colors & labels
          const statusConfig = {
            available: {
              border: 'border-emerald-500/40 hover:border-emerald-500',
              badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
              label: 'Available (හිස්)',
              iconDot: 'bg-emerald-500'
            },
            occupied: {
              border: 'border-rose-500/60 hover:border-rose-500',
              badge: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
              label: 'Occupied (පිරී ඇත)',
              iconDot: 'bg-rose-500 animate-pulse'
            },
            billing: {
              border: 'border-blue-500/60 hover:border-blue-500',
              badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
              label: 'Billing (බිල්පත් කරමින්)',
              iconDot: 'bg-blue-500'
            },
            reserved: {
              border: 'border-amber-500/40 hover:border-amber-500',
              badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
              label: 'Reserved (වෙන් කර ඇත)',
              iconDot: 'bg-amber-500'
            }
          }[table.status];

          return (
            <div
              key={table.id}
              className={`bg-slate-900 border rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 shadow-lg ${statusConfig.border}`}
            >
              <div>
                {/* Table Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="font-black text-base text-white">{table.name}</h3>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Users className="w-3 h-3 text-slate-500" />
                      <span>{table.capacity} Persons &bull; {table.section}</span>
                    </span>
                  </div>

                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-md border flex items-center gap-1.5 ${statusConfig.badge}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.iconDot}`} />
                    {statusConfig.label}
                  </span>
                </div>

                {/* Table Body Content */}
                <div className="py-3 space-y-2">
                  {table.status === 'occupied' || table.status === 'billing' ? (
                    activeOrder ? (
                      <div className="space-y-1.5 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 text-xs">
                        <div className="flex justify-between items-center text-slate-400">
                          <span>Order #{activeOrder.orderNumber}</span>
                          <span className="text-orange-400 font-bold">
                            {activeOrder.items.length} items
                          </span>
                        </div>
                        {activeOrder.customerName && (
                          <div className="text-[11px] text-slate-300 font-medium">
                            Guest: {activeOrder.customerName}
                          </div>
                        )}
                        <div className="flex justify-between items-center pt-1 border-t border-slate-800">
                          <span className="text-slate-400">Running Total:</span>
                          <span className="font-mono font-extrabold text-orange-400 text-sm">
                            Rs. {activeOrder.total.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 italic p-2">
                        Seated & waiting for order...
                      </div>
                    )
                  ) : table.status === 'reserved' ? (
                    <div className="bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl text-xs text-amber-300">
                      Reserved for evening VIP dinner
                    </div>
                  ) : (
                    <div className="bg-emerald-500/5 border border-emerald-500/15 p-2.5 rounded-xl text-xs text-emerald-400/80 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Cleaned & Ready for guests</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Table Action Buttons */}
              <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                {table.status === 'available' && (
                  <button
                    onClick={() => onOpenOrderForTable(table.id)}
                    className="w-full py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Seat Guests / Take Order</span>
                  </button>
                )}

                {(table.status === 'occupied' || table.status === 'billing') && (
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => onOpenOrderForTable(table.id)}
                      className="py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1 transition"
                    >
                      <PlusCircle className="w-3 h-3 text-orange-400" />
                      <span>+ Add Items</span>
                    </button>

                    {activeOrder && (
                      <button
                        onClick={() => onSettleBillForTable(activeOrder)}
                        className="py-2 px-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1 transition shadow"
                      >
                        <Receipt className="w-3 h-3" />
                        <span>Settle Bill</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Status Toggle Quick Helpers */}
                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                  {table.status !== 'available' ? (
                    <button
                      onClick={() => onUpdateTableStatus(table.id, 'available')}
                      className="hover:text-emerald-400 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>Free / Mark Cleaned</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onUpdateTableStatus(table.id, 'reserved')}
                      className="hover:text-amber-400"
                    >
                      Mark Reserved
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
