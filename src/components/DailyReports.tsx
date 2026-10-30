import React, { useState } from 'react';
import { 
  BarChart3, 
  DollarSign, 
  ShoppingBag, 
  CreditCard, 
  Banknote, 
  QrCode, 
  TrendingUp, 
  CheckCircle, 
  Printer, 
  Coins, 
  Award,
  Calendar
} from 'lucide-react';
import { Order } from '../types/pos';
import { RESTAURANT_CONFIG } from '../data/mockData';

interface DailyReportsProps {
  orders: Order[];
}

export const DailyReports: React.FC<DailyReportsProps> = ({ orders }) => {
  const [openingFloat, setOpeningFloat] = useState<number>(10000); // e.g. Rs. 10,000 float
  const [actualCashCount, setActualCashCount] = useState<string>('');
  const [shiftClosed, setShiftClosed] = useState<boolean>(false);

  // Compute metrics from completed orders (and running orders for estimated revenue)
  const completedOrders = orders.filter(o => o.status === 'completed');

  const totalSales = completedOrders.reduce((sum, o) => sum + o.total, 0);
  const totalTax = completedOrders.reduce((sum, o) => sum + o.tax, 0);
  const totalServiceCharge = completedOrders.reduce((sum, o) => sum + o.serviceCharge, 0);
  const totalDiscounts = completedOrders.reduce((sum, o) => sum + o.discount, 0);

  const cashOrders = completedOrders.filter(o => o.paymentMethod === 'cash');
  const cardOrders = completedOrders.filter(o => o.paymentMethod === 'card');
  const qrOrders = completedOrders.filter(o => o.paymentMethod === 'qr');

  const cashTotal = cashOrders.reduce((sum, o) => sum + o.total, 0);
  const cardTotal = cardOrders.reduce((sum, o) => sum + o.total, 0);
  const qrTotal = qrOrders.reduce((sum, o) => sum + o.total, 0);

  const dineInOrders = orders.filter(o => o.type === 'dine-in');
  const takeawayOrders = orders.filter(o => o.type === 'takeaway');
  const deliveryOrders = orders.filter(o => o.type === 'delivery');

  // Top selling items
  const itemCounts: Record<string, { name: string; qty: number; revenue: number }> = {};
  orders.forEach(o => {
    o.items.forEach(item => {
      if (!itemCounts[item.name]) {
        itemCounts[item.name] = { name: item.name, qty: 0, revenue: 0 };
      }
      itemCounts[item.name].qty += item.quantity;
      itemCounts[item.name].revenue += item.price * item.quantity;
    });
  });

  const topItems = Object.values(itemCounts)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  // Cash Drawer calculations
  const expectedCashInDrawer = openingFloat + cashTotal;
  const countedCash = parseFloat(actualCashCount) || 0;
  const cashDifference = countedCash - expectedCashInDrawer;

  const handlePrintZReport = () => {
    window.print();
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-950 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-white">Daily Sales & Shift Reports (දෛනික වාර්තා)</h2>
            <span className="px-2 py-0.5 text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded">
              Z-Report
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Reconcile register, view payment channels and food performance analytics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintZReport}
            className="py-2 px-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow"
          >
            <Printer className="w-4 h-4" />
            <span>Print Shift Z-Report</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase">Total Revenue</span>
            <div className="text-2xl font-black text-orange-400 font-mono mt-1">
              Rs. {totalSales.toLocaleString()}
            </div>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
              <TrendingUp className="w-3 h-3" />
              <span>Today's Settled Bills</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
            <Coins className="w-6 h-6" />
          </div>
        </div>

        {/* Orders Count */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase">Total Orders</span>
            <div className="text-2xl font-black text-white font-mono mt-1">
              {orders.length}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {completedOrders.length} Paid &bull; {orders.length - completedOrders.length} Open
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Cash Collected */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase">Cash Collected</span>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
              Rs. {cashTotal.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {cashOrders.length} Cash Receipts
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Banknote className="w-6 h-6" />
          </div>
        </div>

        {/* Card & Digital */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase">Card & Digital Pay</span>
            <div className="text-2xl font-black text-sky-400 font-mono mt-1">
              Rs. {(cardTotal + qrTotal).toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {cardOrders.length + qrOrders.length} POS Electronic Trans
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Row 2: Payment Breakdown & Channel Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-orange-400" />
            <span>Revenue by Payment Method (ගෙවීම් ක්‍රම)</span>
          </h3>

          <div className="space-y-3">
            {/* Cash */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Banknote className="w-4 h-4 text-emerald-400" />
                  <span>Cash Payments ({cashOrders.length})</span>
                </span>
                <span className="font-mono text-emerald-400 font-bold">
                  Rs. {cashTotal.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className="bg-emerald-500 h-2 rounded-full"
                  style={{ width: `${totalSales > 0 ? (cashTotal / totalSales) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Card */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <CreditCard className="w-4 h-4 text-sky-400" />
                  <span>Credit / Debit Card ({cardOrders.length})</span>
                </span>
                <span className="font-mono text-sky-400 font-bold">
                  Rs. {cardTotal.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className="bg-sky-500 h-2 rounded-full"
                  style={{ width: `${totalSales > 0 ? (cardTotal / totalSales) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* LankaQR / Online */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <QrCode className="w-4 h-4 text-purple-400" />
                  <span>LankaQR / Mobile Pay ({qrOrders.length})</span>
                </span>
                <span className="font-mono text-purple-400 font-bold">
                  Rs. {qrTotal.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: `${totalSales > 0 ? (qrTotal / totalSales) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Tax & Service summary */}
          <div className="pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Service Charge</span>
              <span className="font-mono font-bold text-slate-200">Rs. {totalServiceCharge.toLocaleString()}</span>
            </div>
            <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Govt VAT/Tax</span>
              <span className="font-mono font-bold text-slate-200">Rs. {totalTax.toLocaleString()}</span>
            </div>
            <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Discounts</span>
              <span className="font-mono font-bold text-rose-400">Rs. {totalDiscounts.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Top 5 Dishes */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Top Selling Food & Drink Items (වැඩිපුරම අලෙවි වූ කෑම)</span>
          </h3>

          <div className="space-y-2.5">
            {topItems.length === 0 ? (
              <p className="text-xs text-slate-500">No items sold yet today</p>
            ) : (
              topItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-orange-600/20 text-orange-400 font-mono font-black text-xs flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="font-bold text-slate-200">{item.name}</div>
                      <span className="text-[10px] text-slate-400">
                        {item.qty} portions sold today
                      </span>
                    </div>
                  </div>

                  <span className="font-mono font-black text-orange-400">
                    Rs. {item.revenue.toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Row 3: Cash Register Shift Closing / Drawer Reconciliation */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-black text-base text-white flex items-center gap-2">
              <Coins className="w-5 h-5 text-amber-400" />
              <span>Cash Register Drawer Shift Closing (මුදල් පෙට්ටිය සමතුලිත කිරීම)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Cashier: <strong className="text-slate-200">{RESTAURANT_CONFIG.cashier}</strong> &bull; End of shift reconciliation
            </p>
          </div>

          {shiftClosed && (
            <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-xs flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" />
              <span>Shift Closed Successfully</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Opening Float */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-semibold">Opening Cash Float</span>
            <input
              type="number"
              value={openingFloat}
              onChange={e => setOpeningFloat(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-900 border border-slate-700 font-mono font-bold text-white text-base px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-orange-500"
            />
            <span className="text-[10px] text-slate-500">Starting change in register</span>
          </div>

          {/* Cash Sales Added */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-semibold">+ Cash Sales Collected</span>
            <div className="font-mono font-black text-emerald-400 text-lg py-1.5">
              Rs. {cashTotal.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-500">From {cashOrders.length} cash receipts</span>
          </div>

          {/* Expected Drawer Total */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-semibold">= Expected in Drawer</span>
            <div className="font-mono font-black text-orange-400 text-lg py-1.5">
              Rs. {expectedCashInDrawer.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-500">Float + Cash sales</span>
          </div>

          {/* Cashier Counted Cash */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-semibold">Actual Physical Cash Count</span>
            <input
              type="number"
              placeholder="Count & enter..."
              value={actualCashCount}
              onChange={e => setActualCashCount(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 font-mono font-bold text-white text-base px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-orange-500"
            />
            {actualCashCount && (
              <span
                className={`text-[11px] font-bold block ${
                  cashDifference === 0
                    ? 'text-emerald-400'
                    : cashDifference > 0
                    ? 'text-sky-400'
                    : 'text-rose-400'
                }`}
              >
                Difference: {cashDifference >= 0 ? `+ Rs. ${cashDifference}` : `- Rs. ${Math.abs(cashDifference)}`}
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => {
              setShiftClosed(true);
              alert('Shift closing summary recorded. Register closed for current cashier.');
            }}
            disabled={!actualCashCount || shiftClosed}
            className="py-2.5 px-5 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-40 text-white font-black text-xs transition shadow-lg shadow-orange-600/30 flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Confirm & Close Shift (දවස අවසන් කරන්න)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
