import React from 'react';
import { ChefHat, Printer, X } from 'lucide-react';
import { Order } from '../types/pos';
import { RESTAURANT_CONFIG } from '../data/mockData';

interface KOTModalProps {
  order: Order | null;
  onClose: () => void;
}

export const KOTModal: React.FC<KOTModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedTime = new Date(order.createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header Bar */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-850">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <ChefHat className="w-5 h-5" />
            <span>Kitchen Order Ticket (KOT)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable KOT Paper */}
        <div className="p-4 overflow-y-auto flex-1 bg-slate-950/50 flex justify-center">
          <div
            id="printable-receipt"
            className="w-full bg-white text-slate-900 font-mono text-xs p-5 rounded-md shadow-lg border border-slate-300 select-text leading-snug"
          >
            {/* Header */}
            <div className="text-center pb-2 border-b-2 border-slate-900 mb-2">
              <h2 className="text-base font-black uppercase tracking-wider text-black">
                *** KITCHEN ORDER TICKET ***
              </h2>
              <div className="text-sm font-black text-rose-700 mt-1">
                {order.type === 'dine-in' ? `TABLE: ${order.tableName || 'N/A'}` : `TYPE: ${order.type.toUpperCase()}`}
              </div>
            </div>

            {/* Meta */}
            <div className="text-[11px] space-y-1 mb-2 pb-2 border-b border-dashed border-slate-400">
              <div className="flex justify-between font-bold">
                <span>KOT #: KOT-{order.orderNumber}</span>
                <span>ORDER #: #{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>TIME: {formattedTime}</span>
                <span>WAITER: {order.waiterName || 'Staff'}</span>
              </div>
              {order.customerName && (
                <div className="text-slate-700">
                  CUSTOMER: <strong>{order.customerName}</strong>
                </div>
              )}
            </div>

            {/* Items Table */}
            <div className="text-[11px] font-black pb-1 mb-2 border-b border-slate-900 flex justify-between uppercase">
              <span className="w-16">QTY</span>
              <span className="flex-1">FOOD ITEM / NOTES</span>
            </div>

            <div className="space-y-2 mb-3 pb-3 border-b-2 border-slate-900">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-start text-xs border-b border-slate-200 pb-1.5 last:border-0">
                  <div className="w-16 font-black text-base text-black flex items-center gap-1">
                    <span className="px-1.5 py-0.5 bg-slate-200 rounded">{item.quantity}x</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm text-slate-950">{item.name}</div>
                    {item.notes ? (
                      <div className="text-[11px] text-rose-700 font-bold bg-rose-50 px-1 py-0.5 mt-0.5 rounded border border-rose-200">
                        ⚡ SPECIAL: {item.notes}
                      </div>
                    ) : (
                      <div className="text-[10px] text-slate-500">Standard prep</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Instructions */}
            <div className="text-center text-[10px] text-slate-600 font-bold uppercase">
              Total Items Count: {order.items.reduce((s, i) => s + i.quantity, 0)} &bull; Cook ASAP
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold text-sm transition"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-amber-600/30"
          >
            <Printer className="w-4 h-4" />
            <span>Print KOT Ticket</span>
          </button>
        </div>
      </div>
    </div>
  );
};
