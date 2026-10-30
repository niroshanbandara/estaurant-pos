import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { PosTerminal } from './components/PosTerminal';
import { TableManagement } from './components/TableManagement';
import { KitchenDisplay } from './components/KitchenDisplay';
import { OrdersHistory } from './components/OrdersHistory';
import { DailyReports } from './components/DailyReports';
import { ReceiptModal } from './components/ReceiptModal';
import { KOTModal } from './components/KOTModal';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_MENU_ITEMS, 
  INITIAL_TABLES, 
  INITIAL_ORDERS 
} from './data/mockData';
import { Order, DiningTable, OrderStatus } from './types/pos';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pos' | 'tables' | 'kitchen' | 'orders' | 'reports'>('pos');
  const [tables, setTables] = useState<DiningTable[]>(INITIAL_TABLES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [activeTableId, setActiveTableId] = useState<string | null>(null);

  // Modals
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);
  const [kotOrder, setKotOrder] = useState<Order | null>(null);

  // Count active kitchen tickets
  const activeKitchenCount = orders.filter(
    o => o.status === 'pending' || o.status === 'in-kitchen' || o.status === 'ready'
  ).length;

  // Count occupied tables
  const occupiedTablesCount = tables.filter(t => t.status === 'occupied').length;

  // Handle new order sent to kitchen (KOT)
  const handleSendToKitchen = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);

    // If dine-in, link to table
    if (newOrder.tableId) {
      setTables(prev =>
        prev.map(tbl =>
          tbl.id === newOrder.tableId
            ? { ...tbl, status: 'occupied', currentOrderId: newOrder.id }
            : tbl
        )
      );
    }

    // Auto open KOT preview for kitchen ticket printing
    setKotOrder(newOrder);
  };

  // Handle bill payment completed
  const handleCompletePayment = (paidOrder: Order) => {
    setOrders(prev => {
      const exists = prev.some(o => o.id === paidOrder.id);
      if (exists) {
        return prev.map(o => (o.id === paidOrder.id ? paidOrder : o));
      }
      return [paidOrder, ...prev];
    });

    // Free the table if it was assigned
    if (paidOrder.tableId) {
      setTables(prev =>
        prev.map(tbl =>
          tbl.id === paidOrder.tableId
            ? { ...tbl, status: 'available', currentOrderId: undefined }
            : tbl
        )
      );
    }

    // Open receipt modal for printing
    setReceiptOrder(paidOrder);
  };

  // Table actions
  const handleOpenOrderForTable = (tableId: string) => {
    setActiveTableId(tableId);
    setActiveTab('pos');
  };

  const handleSettleBillForTable = (order: Order) => {
    setReceiptOrder(order);
  };

  const handleUpdateTableStatus = (tableId: string, status: DiningTable['status']) => {
    setTables(prev =>
      prev.map(tbl =>
        tbl.id === tableId
          ? {
              ...tbl,
              status,
              currentOrderId: status === 'available' ? undefined : tbl.currentOrderId
            }
          : tbl
      )
    );
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status } : o))
    );

    // If order was marked completed, and was attached to a table, mark table available
    if (status === 'completed') {
      const order = orders.find(o => o.id === orderId);
      if (order?.tableId) {
        setTables(prev =>
          prev.map(tbl =>
            tbl.id === order.tableId
              ? { ...tbl, status: 'available', currentOrderId: undefined }
              : tbl
          )
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeKitchenOrdersCount={activeKitchenCount}
        occupiedTablesCount={occupiedTablesCount}
      />

      {/* Main View Router */}
      <main className="flex-1 flex overflow-hidden">
        {activeTab === 'pos' && (
          <PosTerminal
            categories={INITIAL_CATEGORIES}
            menuItems={INITIAL_MENU_ITEMS}
            tables={tables}
            activeTableId={activeTableId}
            onSelectTable={setActiveTableId}
            onSendToKitchen={handleSendToKitchen}
            onCompletePayment={handleCompletePayment}
          />
        )}

        {activeTab === 'tables' && (
          <TableManagement
            tables={tables}
            orders={orders}
            onOpenOrderForTable={handleOpenOrderForTable}
            onSettleBillForTable={handleSettleBillForTable}
            onUpdateTableStatus={handleUpdateTableStatus}
          />
        )}

        {activeTab === 'kitchen' && (
          <KitchenDisplay
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onPrintKOT={order => setKotOrder(order)}
          />
        )}

        {activeTab === 'orders' && (
          <OrdersHistory
            orders={orders}
            onViewReceipt={order => setReceiptOrder(order)}
            onPrintKOT={order => setKotOrder(order)}
          />
        )}

        {activeTab === 'reports' && (
          <DailyReports orders={orders} />
        )}
      </main>

      {/* Bill Receipt Thermal Modal */}
      {receiptOrder && (
        <ReceiptModal
          order={receiptOrder}
          onClose={() => setReceiptOrder(null)}
        />
      )}

      {/* Kitchen KOT Modal */}
      {kotOrder && (
        <KOTModal
          order={kotOrder}
          onClose={() => setKotOrder(null)}
        />
      )}
    </div>
  );
};

export default App;
