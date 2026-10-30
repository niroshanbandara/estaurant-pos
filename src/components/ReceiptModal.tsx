import React from 'react';
import { Printer, CheckCircle, X, Download } from 'lucide-react';
import { Order } from '../types/pos';
import { RESTAURANT_CONFIG } from '../data/mockData';

interface ReceiptModalProps {
  order: Order | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-GB');
  const formattedTime = new Date(order.createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header Bar */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-850">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <CheckCircle className="w-5 h-5" />
            <span>Bill Generated &bull; #{order.orderNumber}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Paper Container */}
        <div className="p-4 overflow-y-auto flex-1 bg-slate-950/50 flex justify-center">
          <div
            id="printable-receipt"
            className="w-full max-w-[340px] bg-white text-slate-900 font-mono text-xs p-5 rounded-md shadow-lg border border-slate-300 select-text leading-tight"
          >
            {/* Restaurant Header */}
            <div className="text-center pb-3 border-b border-dashed border-slate-400 mb-3">
              <h2 className="text-base font-black tracking-tight uppercase text-slate-950">
                {RESTAURANT_CONFIG.name}
              </h2>
              <p className="text-[11px] text-slate-600 mt-0.5">{RESTAURANT_CONFIG.branch}</p>
              <p className="text-[10px] text-slate-500">{RESTAURANT_CONFIG.address}</p>
              <p className="text-[10px] text-slate-500 font-medium">Tel: {RESTAURANT_CONFIG.phone}</p>
              <p className="text-[10px] text-slate-500">Reg/VAT: {RESTAURANT_CONFIG.vatNumber}</p>
            </div>

            {/* Bill Meta */}
            <div className="text-[11px] space-y-1 mb-3 pb-3 border-b border-dashed border-slate-400">
              <div className="flex justify-between">
                <span>INVOICE #: <strong className="text-black font-bold">INV-{order.orderNumber}</strong></span>
                <span>TYPE: <strong className="uppercase font-bold">{order.type}</strong></span>
              </div>
              {order.tableName && (
                <div className="flex justify-between">
                  <span>TABLE: <strong>{order.tableName}</strong></span>
                  <span>WAITER: <strong>{order.waiterName || 'Staff'}</strong></span>
                </div>
              )}
              {order.customerName && (
                <div className="flex justify-between">
                  <span>GUEST: <strong>{order.customerName}</strong></span>
                  {order.customerPhone && <span>TEL: {order.customerPhone}</span>}
                </div>
              )}
              <div className="flex justify-between text-slate-600 text-[10px]">
                <span>DATE: {formattedDate}</span>
                <span>TIME: {formattedTime}</span>
              </div>
              <div className="text-[10px] text-slate-600">
                CASHIER: {order.cashierName || RESTAURANT_CONFIG.cashier}
              </div>
            </div>

            {/* Items Header */}
            <div className="text-[10px] font-bold pb-1 mb-2 border-b border-slate-900 flex justify-between uppercase">
              <span className="w-1/2">Item Description</span>
              <span className="w-12 text-center">Qty</span>
              <span className="w-14 text-right">Price</span>
              <span className="w-16 text-right">Total</span>
            </div>

            {/* Items List */}
            <div className="space-y-1.5 mb-3 pb-3 border-b border-dashed border-slate-400">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start text-[11px]">
                  <div className="w-1/2 pr-1">
                    <div className="font-semibold">{item.name}</div>
                    {item.notes && (
                      <div className="text-[9px] text-slate-500 italic">* {item.notes}</div>
                    )}
                  </div>
                  <div className="w-12 text-center">{item.quantity}</div>
                  <div className="w-14 text-right">{item.price.toFixed(2)}</div>
                  <div className="w-16 text-right font-bold">
                    {(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1 text-[11px] mb-3 pb-3 border-b border-dashed border-slate-400">
              <div className="flex justify-between">
                <span>Subtotal ({order.items.reduce((acc, i) => acc + i.quantity, 0)} Items)</span>
                <span>Rs. {order.subtotal.toFixed(2)}</span>
              </div>

              {order.serviceCharge > 0 && (
                <div className="flex justify-between text-slate-700">
                  <span>Service Charge ({RESTAURANT_CONFIG.serviceChargePercent}%)</span>
                  <span>Rs. {order.serviceCharge.toFixed(2)}</span>
                </div>
              )}

              {order.tax > 0 && (
                <div className="flex justify-between text-slate-700">
                  <span>Govt Tax / VAT ({RESTAURANT_CONFIG.taxPercent}%)</span>
                  <span>Rs. {order.tax.toFixed(2)}</span>
                </div>
              )}

              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Special Discount</span>
                  <span>- Rs. {order.discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-base font-black text-black pt-1 border-t border-slate-900 mt-1">
                <span>NET TOTAL:</span>
                <span>Rs. {order.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Info */}
            <div className="space-y-1 text-[10px] mb-3 pb-3 border-b border-dashed border-slate-400">
              <div className="flex justify-between font-bold">
                <span>PAYMENT METHOD:</span>
                <span className="uppercase">{order.paymentMethod || 'CASH'}</span>
              </div>
              {order.amountReceived && order.amountReceived > 0 && (
                <>
                  <div className="flex justify-between">
                    <span>CASH TENDERED:</span>
                    <span>Rs. {order.amountReceived.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>CHANGE DUE:</span>
                    <span>Rs. {(order.change ?? (order.amountReceived - order.total)).toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Bill Footer */}
            <div className="text-center text-[10px] text-slate-600 space-y-1">
              <p className="font-semibold text-slate-800">{RESTAURANT_CONFIG.footerNote}</p>
              <div className="border border-slate-300 p-1.5 rounded bg-slate-50 text-[9px]">
                <p>Free Guest Wi-Fi: <strong>{RESTAURANT_CONFIG.wifiName}</strong></p>
                <p>Password: <strong>{RESTAURANT_CONFIG.wifiPassword}</strong></p>
              </div>
              <p className="text-[9px] text-slate-400 pt-1">
                POS Powered by SpiceLounge Cloud &bull; Printed {formattedTime}
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold text-sm transition"
          >
            Done / New Bill
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt (80mm)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
