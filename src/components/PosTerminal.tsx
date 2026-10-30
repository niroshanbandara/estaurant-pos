import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  ChefHat, 
  CreditCard, 
  Banknote, 
  QrCode, 
  Utensils, 
  ShoppingBag, 
  Truck, 
  FileText, 
  Check, 
  X,
  AlertCircle,
  Tag
} from 'lucide-react';
import { 
  OrderType, 
  MenuItem, 
  OrderItem, 
  DiningTable, 
  Order, 
  PaymentMethod 
} from '../types/pos';
import { RESTAURANT_CONFIG } from '../data/mockData';

interface PosTerminalProps {
  categories: { id: string; name: string; nameSi?: string; icon: string }[];
  menuItems: MenuItem[];
  tables: DiningTable[];
  activeTableId?: string | null;
  onSelectTable: (tableId: string | null) => void;
  onSendToKitchen: (order: Order) => void;
  onCompletePayment: (order: Order) => void;
}

export const PosTerminal: React.FC<PosTerminalProps> = ({
  categories,
  menuItems,
  tables,
  activeTableId,
  onSelectTable,
  onSendToKitchen,
  onCompletePayment
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('cat-all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [orderType, setOrderType] = useState<OrderType>(activeTableId ? 'dine-in' : 'dine-in');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [serviceChargeEnabled, setServiceChargeEnabled] = useState<boolean>(true);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [editingNoteItemId, setEditingNoteItemId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState<string>('');

  // Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [amountReceived, setAmountReceived] = useState<string>('');

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesCategory = selectedCategory === 'cat-all' || item.categoryId === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        item.name.toLowerCase().includes(q) || 
        (item.nameSi && item.nameSi.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  // Cart calculations
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartItems]);

  const serviceCharge = useMemo(() => {
    if (!serviceChargeEnabled || orderType !== 'dine-in') return 0;
    return (subtotal * RESTAURANT_CONFIG.serviceChargePercent) / 100;
  }, [subtotal, serviceChargeEnabled, orderType]);

  const tax = useMemo(() => {
    return (subtotal * RESTAURANT_CONFIG.taxPercent) / 100;
  }, [subtotal]);

  const total = useMemo(() => {
    const afterDiscount = Math.max(0, subtotal - discountAmount);
    return Math.round(afterDiscount + serviceCharge + tax);
  }, [subtotal, discountAmount, serviceCharge, tax]);

  // Add item to cart
  const addToCart = (item: MenuItem) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.menuItemId === item.id);
      if (existing) {
        return prev.map(i =>
          i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          id: `cart-${Date.now()}-${Math.random()}`,
          menuItemId: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          notes: ''
        }
      ];
    });
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCartItems(prev => {
      return prev
        .map(i => {
          if (i.id === cartItemId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as OrderItem[];
    });
  };

  const removeCartItem = (cartItemId: string) => {
    setCartItems(prev => prev.filter(i => i.id !== cartItemId));
  };

  const saveItemNote = (cartItemId: string) => {
    setCartItems(prev =>
      prev.map(i => (i.id === cartItemId ? { ...i, notes: tempNote } : i))
    );
    setEditingNoteItemId(null);
    setTempNote('');
  };

  const currentTable = tables.find(t => t.id === activeTableId);

  // Send to Kitchen handler
  const handleSendToKitchen = () => {
    if (cartItems.length === 0) return;
    if (orderType === 'dine-in' && !activeTableId) {
      alert('කරුණාකර මේසයක් තෝරන්න (Please select a table for Dine-in orders)');
      return;
    }

    const order: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: Math.floor(100 + Math.random() * 900),
      type: orderType,
      tableId: activeTableId || undefined,
      tableName: currentTable?.name,
      customerName: customerName || (orderType === 'dine-in' ? `Guest @ ${currentTable?.name}` : 'Walk-in Customer'),
      customerPhone,
      items: cartItems,
      status: 'in-kitchen',
      subtotal,
      serviceCharge,
      tax,
      discount: discountAmount,
      total,
      createdAt: new Date().toISOString(),
      waiterName: 'Captain Silva',
      cashierName: RESTAURANT_CONFIG.cashier,
      kotPrinted: true
    };

    onSendToKitchen(order);
    // Reset cart
    setCartItems([]);
    setCustomerName('');
    setCustomerPhone('');
  };

  // Open Payment Modal
  const handleOpenPayment = () => {
    if (cartItems.length === 0) return;
    if (orderType === 'dine-in' && !activeTableId) {
      alert('කරුණාකර මේසයක් තෝරන්න (Please select a table for Dine-in orders)');
      return;
    }
    setAmountReceived(total.toString());
    setIsPaymentModalOpen(true);
  };

  // Submit Payment
  const handleSubmitPayment = () => {
    const tendered = parseFloat(amountReceived) || total;
    const change = Math.max(0, tendered - total);

    const order: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: Math.floor(100 + Math.random() * 900),
      type: orderType,
      tableId: activeTableId || undefined,
      tableName: currentTable?.name,
      customerName: customerName || (orderType === 'dine-in' ? `Guest @ ${currentTable?.name}` : 'Counter Customer'),
      customerPhone,
      items: cartItems,
      status: 'completed',
      subtotal,
      serviceCharge,
      tax,
      discount: discountAmount,
      total,
      paymentMethod,
      amountReceived: tendered,
      change,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      cashierName: RESTAURANT_CONFIG.cashier,
      waiterName: 'Captain Silva',
      kotPrinted: true
    };

    onCompletePayment(order);
    setIsPaymentModalOpen(false);
    setCartItems([]);
    setCustomerName('');
    setCustomerPhone('');
    onSelectTable(null);
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-65px)] overflow-hidden bg-slate-950">
      {/* LEFT COLUMN: Menu & Selection (Flex 1) */}
      <div className="flex-1 flex flex-col overflow-hidden border-r border-slate-800">
        {/* Top Controls: Order Type & Table Bar */}
        <div className="p-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          {/* Order Type Toggle */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setOrderType('dine-in')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                orderType === 'dine-in' ? 'bg-orange-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Dine-In (කෑම ශාලාව)</span>
            </button>
            <button
              onClick={() => {
                setOrderType('takeaway');
                onSelectTable(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                orderType === 'takeaway' ? 'bg-orange-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Takeaway (පාර්සල්)</span>
            </button>
            <button
              onClick={() => {
                setOrderType('delivery');
                onSelectTable(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                orderType === 'delivery' ? 'bg-orange-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Delivery</span>
            </button>
          </div>

          {/* Table or Customer Context */}
          {orderType === 'dine-in' ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Table:</span>
              <select
                value={activeTableId || ''}
                onChange={e => onSelectTable(e.target.value || null)}
                className="bg-slate-950 border border-slate-700 text-slate-200 text-xs font-bold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-orange-500"
              >
                <option value="">-- මේසයක් තෝරන්න (Select Table) --</option>
                {tables.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.capacity} seats) {t.status === 'occupied' ? '🔴 Occupied' : '🟢 Free'}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-1 max-w-xs">
              <input
                type="text"
                placeholder="Customer Name / Ph..."
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 w-full focus:outline-none focus:border-orange-500"
              />
            </div>
          )}
        </div>

        {/* Search & Category Tabs */}
        <div className="p-3 bg-slate-900/60 border-b border-slate-800 space-y-2.5">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search food by English or Sinhala name... (e.g. kottu, fried rice, කොත්තු)"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Categories Pill Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-orange-500 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <span>{cat.name}</span>
                {cat.nameSi && <span className="opacity-70 text-[10px]">({cat.nameSi})</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="flex-1 overflow-y-auto p-3.5">
          {filteredItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
              <AlertCircle className="w-8 h-8 opacity-40" />
              <p className="text-sm">No items found matching "{searchQuery}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredItems.map(item => {
                const inCart = cartItems.find(i => i.menuItemId === item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => addToCart(item)}
                    className="group bg-slate-900 border border-slate-800 hover:border-orange-500/60 rounded-xl p-3 flex flex-col justify-between cursor-pointer transition-all duration-150 hover:shadow-lg hover:shadow-orange-500/10 active:scale-[0.98] relative overflow-hidden"
                  >
                    {inCart && (
                      <div className="absolute top-2 right-2 bg-orange-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow">
                        {inCart.quantity}
                      </div>
                    )}

                    <div>
                      <h3 className="font-bold text-sm text-slate-100 group-hover:text-orange-400 transition-colors line-clamp-1">
                        {item.name}
                      </h3>
                      {item.nameSi && (
                        <p className="text-[11px] text-slate-400 line-clamp-1 font-medium mt-0.5">
                          {item.nameSi}
                        </p>
                      )}
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="font-extrabold text-orange-400 font-mono text-sm">
                        Rs. {item.price.toLocaleString()}
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-slate-800 group-hover:bg-orange-600 text-slate-300 group-hover:text-white flex items-center justify-center transition">
                        <Plus className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Order Cart / Summary (Fixed Width on Desktop) */}
      <div className="w-full lg:w-[410px] bg-slate-900 flex flex-col border-t lg:border-t-0 border-slate-800 shadow-2xl">
        {/* Cart Header */}
        <div className="p-3.5 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-sm uppercase tracking-wide text-white">
                Current Order
              </h2>
              <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 uppercase">
                {orderType}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {orderType === 'dine-in' ? (
                currentTable ? (
                  <span className="text-emerald-400 font-bold">Assigned to: {currentTable.name}</span>
                ) : (
                  <span className="text-amber-400">⚠️ No Table Selected</span>
                )
              ) : (
                <span>Customer: {customerName || 'Walk-in'}</span>
              )}
            </p>
          </div>

          {cartItems.length > 0 && (
            <button
              onClick={() => setCartItems([])}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 hover:underline"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2 p-6 text-center">
              <ShoppingBag className="w-12 h-12 opacity-30 text-orange-400" />
              <p className="text-sm font-medium text-slate-400">Cart is empty</p>
              <p className="text-xs text-slate-500">
                Click on any food or drink item to add it to the order
              </p>
            </div>
          ) : (
            cartItems.map(item => (
              <div
                key={item.id}
                className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-2.5 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-slate-100">{item.name}</h4>
                    <p className="text-[11px] text-orange-400 font-mono">
                      Rs. {item.price.toLocaleString()} x {item.quantity} ={' '}
                      <strong className="text-slate-100">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </strong>
                    </p>
                  </div>

                  <button
                    onClick={() => removeCartItem(item.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Notes Display or Editor */}
                {editingNoteItemId === item.id ? (
                  <div className="flex items-center gap-1.5 pt-1">
                    <input
                      type="text"
                      placeholder="e.g. Less spicy, no onions..."
                      value={tempNote}
                      onChange={e => setTempNote(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 text-[11px] rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-orange-500"
                    />
                    <button
                      onClick={() => saveItemNote(item.id)}
                      className="p-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setEditingNoteItemId(null)}
                      className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => {
                        setEditingNoteItemId(item.id);
                        setTempNote(item.notes || '');
                      }}
                      className="text-[10px] text-slate-400 hover:text-orange-400 flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3" />
                      <span>{item.notes ? `Note: "${item.notes}"` : '+ Add note / spice level'}</span>
                    </button>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-800">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="text-slate-400 hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono text-xs font-bold text-white w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="text-slate-400 hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Cart Calculations Summary */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800 space-y-2 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Subtotal</span>
            <span className="font-mono text-slate-200">Rs. {subtotal.toLocaleString()}</span>
          </div>

          {orderType === 'dine-in' && (
            <div className="flex items-center justify-between text-slate-400">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={serviceChargeEnabled}
                  onChange={e => setServiceChargeEnabled(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-orange-600 focus:ring-0"
                />
                <span>Service Charge ({RESTAURANT_CONFIG.serviceChargePercent}%)</span>
              </label>
              <span className="font-mono text-slate-200">Rs. {serviceCharge.toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between text-slate-400">
            <span>Govt Tax / VAT ({RESTAURANT_CONFIG.taxPercent}%)</span>
            <span className="font-mono text-slate-200">Rs. {tax.toLocaleString()}</span>
          </div>

          {/* Discount Input */}
          <div className="flex items-center justify-between text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <Tag className="w-3 h-3 text-emerald-400" />
              <span>Discount (Rs.)</span>
            </span>
            <input
              type="number"
              placeholder="0"
              value={discountAmount || ''}
              onChange={e => setDiscountAmount(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-20 bg-slate-900 border border-slate-700 text-right px-2 py-0.5 rounded text-xs text-emerald-400 font-mono focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
            <span className="font-black text-sm uppercase text-slate-200">Total Payable:</span>
            <span className="text-xl font-black text-orange-400 font-mono">
              Rs. {total.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 grid grid-cols-2 gap-2">
          <button
            onClick={handleSendToKitchen}
            disabled={cartItems.length === 0}
            className="py-3 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow"
          >
            <ChefHat className="w-4 h-4" />
            <span>KOT (කුස්සියට යවන්න)</span>
          </button>

          <button
            onClick={handleOpenPayment}
            disabled={cartItems.length === 0}
            className="py-3 px-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 disabled:opacity-40 text-white font-black text-xs flex items-center justify-center gap-1.5 transition shadow-lg shadow-orange-600/30"
          >
            <CreditCard className="w-4 h-4" />
            <span>Pay & Settle (බිල ගෙවන්න)</span>
          </button>
        </div>
      </div>

      {/* PAYMENT MODAL */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-black text-base text-white">Complete Payment (බිල්පත ගෙවීම)</h3>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Total Display */}
            <div className="bg-slate-950 p-4 rounded-xl text-center border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold">Total Amount Due</span>
              <div className="text-3xl font-black text-orange-400 font-mono mt-1">
                Rs. {total.toLocaleString()}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Payment Method:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1 text-xs font-bold transition ${
                    paymentMethod === 'cash'
                      ? 'bg-orange-600/20 border-orange-500 text-orange-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Banknote className="w-5 h-5" />
                  <span>Cash (මුදල්)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1 text-xs font-bold transition ${
                    paymentMethod === 'card'
                      ? 'bg-orange-600/20 border-orange-500 text-orange-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Card (කාඩ්පත්)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('qr')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1 text-xs font-bold transition ${
                    paymentMethod === 'qr'
                      ? 'bg-orange-600/20 border-orange-500 text-orange-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <QrCode className="w-5 h-5" />
                  <span>LankaQR / App</span>
                </button>
              </div>
            </div>

            {/* Cash Tender & Change Calculations */}
            {paymentMethod === 'cash' && (
              <div className="space-y-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-semibold">Cash Given by Customer (Rs.):</label>
                  <input
                    type="number"
                    value={amountReceived}
                    onChange={e => setAmountReceived(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white font-mono text-lg font-bold px-3 py-2 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Quick denomination pills */}
                <div className="flex gap-1.5 flex-wrap">
                  {[total, 1000, 2000, 5000, 10000].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAmountReceived(amt.toString())}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-[11px] font-mono rounded text-slate-200"
                    >
                      Rs. {amt.toLocaleString()}
                    </button>
                  ))}
                </div>

                {/* Change return calculation */}
                {parseFloat(amountReceived) >= total && (
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex justify-between items-center text-xs">
                    <span className="text-emerald-400 font-bold">Change Due (ඉතිරි මුදල):</span>
                    <span className="font-mono text-base font-extrabold text-emerald-400">
                      Rs. {(parseFloat(amountReceived) - total).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Submit */}
            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitPayment}
                className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs shadow-lg shadow-orange-600/30 flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Confirm & Print Bill</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
