export type OrderType = 'dine-in' | 'takeaway' | 'delivery';

export type OrderStatus = 'pending' | 'in-kitchen' | 'ready' | 'completed' | 'cancelled';

export type PaymentMethod = 'cash' | 'card' | 'qr';

export type TableStatus = 'available' | 'occupied' | 'reserved' | 'billing';

export interface Category {
  id: string;
  name: string;
  nameSi?: string;
  icon: string;
}

export interface MenuItem {
  id: string;
  name: string;
  nameSi?: string;
  categoryId: string;
  price: number;
  image?: string;
  description?: string;
  available: boolean;
  preparationTime?: number; // minutes
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

export interface DiningTable {
  id: string;
  number: number;
  name: string;
  capacity: number;
  status: TableStatus;
  currentOrderId?: string;
  section: 'Main Hall' | 'AC VIP Room' | 'Outdoor Garden' | 'Rooftop';
}

export interface Order {
  id: string;
  orderNumber: number;
  type: OrderType;
  tableId?: string;
  tableName?: string;
  customerName?: string;
  customerPhone?: string;
  deliveryAddress?: string;
  items: OrderItem[];
  status: OrderStatus;
  subtotal: number;
  serviceCharge: number; // e.g. 10%
  tax: number; // e.g. 2.5%
  discount: number;
  total: number;
  paymentMethod?: PaymentMethod;
  amountReceived?: number;
  change?: number;
  createdAt: string;
  completedAt?: string;
  waiterName?: string;
  cashierName?: string;
  kotPrinted?: boolean;
}

export interface DailySummary {
  date: string;
  totalSales: number;
  orderCount: number;
  dineInCount: number;
  takeawayCount: number;
  deliveryCount: number;
  cashTotal: number;
  cardTotal: number;
  qrTotal: number;
}
