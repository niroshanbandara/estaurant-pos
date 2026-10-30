import { Category, MenuItem, DiningTable, Order } from '../types/pos';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-all', name: 'All Items', nameSi: 'සියල්ල', icon: 'Utensils' },
  { id: 'cat-rice', name: 'Rice & Curry / Biryani', nameSi: 'බත් සහ බුරියානි', icon: 'Soup' },
  { id: 'cat-kottu', name: 'Kottu Rotti', nameSi: 'කොත්තු', icon: 'Flame' },
  { id: 'cat-burgers', name: 'Burgers & Wraps', nameSi: 'බර්ගර් සහ රැප්', icon: 'Sandwich' },
  { id: 'cat-appetizers', name: 'Appetizers & Bites', nameSi: 'ඇපටයිසර් / බයිට්ස්', icon: 'Drumstick' },
  { id: 'cat-beverages', name: 'Beverages & Juices', nameSi: 'බීම වර්ග', icon: 'Coffee' },
  { id: 'cat-desserts', name: 'Desserts', nameSi: 'ඩෙසර්ට්', icon: 'IceCream' },
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // Rice & Curry / Biryani
  {
    id: 'item-1',
    name: 'Special Chicken Fried Rice',
    nameSi: 'ස්පෙෂල් චිකන් ෆ්‍රයිඩ් රයිස්',
    categoryId: 'cat-rice',
    price: 1350,
    available: true,
    description: 'Basmati rice with shredded chicken, egg, veggies & chilli paste',
    preparationTime: 12
  },
  {
    id: 'item-2',
    name: 'Mixed Seafood Fried Rice',
    nameSi: 'සීෆුඩ් මික්ස්ඩ් ෆ්‍රයිඩ් රයිස්',
    categoryId: 'cat-rice',
    price: 1650,
    available: true,
    description: 'Prawns, calamari, fish fillets, egg & fresh scallions',
    preparationTime: 15
  },
  {
    id: 'item-3',
    name: 'Dum Chicken Biryani',
    nameSi: 'චිකන් දම් බුරියානි',
    categoryId: 'cat-rice',
    price: 1550,
    available: true,
    description: 'Aromatic long-grain basmati, tender chicken leg, boiled egg, mint sambol & raita',
    preparationTime: 10
  },
  {
    id: 'item-4',
    name: 'Sri Lankan Village Rice & Curry',
    nameSi: 'ගමේ රතු බත් සහ කරි',
    categoryId: 'cat-rice',
    price: 950,
    available: true,
    description: 'Steamed red rice, dhal, pol sambol, fried fish / chicken, greens & papadam',
    preparationTime: 8
  },

  // Kottu
  {
    id: 'item-5',
    name: 'Cheese Chicken Kottu',
    nameSi: 'චීස් චිකන් කොත්තු',
    categoryId: 'cat-kottu',
    price: 1450,
    available: true,
    description: 'Chopped godamba rotti, rich melted mozzarella cheese, roast chicken & gravy',
    preparationTime: 12
  },
  {
    id: 'item-6',
    name: 'Egg & Vegetable Kottu',
    nameSi: 'බිත්තර සහ එළවළු කොත්තු',
    categoryId: 'cat-kottu',
    price: 900,
    available: true,
    description: 'Rotti sautéed with fresh leeks, carrots, onions and 2 farm fresh eggs',
    preparationTime: 10
  },
  {
    id: 'item-7',
    name: 'Beef Dolphin Kottu',
    nameSi: 'බීෆ් ඩොල්ෆින් කොත්තු',
    categoryId: 'cat-kottu',
    price: 1600,
    available: true,
    description: 'Chunk parotta pieces tossed with spicy beef strips, capsicum & devilled gravy',
    preparationTime: 14
  },

  // Burgers & Wraps
  {
    id: 'item-8',
    name: 'Crispy Zinger Chicken Burger',
    nameSi: 'ක්‍රිස්පි චිකන් බර්ගර්',
    categoryId: 'cat-burgers',
    price: 1200,
    available: true,
    description: 'Deep fried crispy chicken breast, spicy mayo, lettuce & cheddar in brioche bun',
    preparationTime: 10
  },
  {
    id: 'item-9',
    name: 'Double Beef Cheese Burger',
    nameSi: 'ඩබල් බීෆ් චීස් බර්ගර්',
    categoryId: 'cat-burgers',
    price: 1750,
    available: true,
    description: 'Two smashed beef patties, double cheddar, caramelized onions & BBQ sauce',
    preparationTime: 12
  },

  // Bites & Appetizers
  {
    id: 'item-10',
    name: 'Hot Butter Cuttlefish (HBC)',
    nameSi: 'හොට් බටර් කට්ල්ෆිෂ්',
    categoryId: 'cat-appetizers',
    price: 1850,
    available: true,
    description: 'Famous Sri Lankan crispy batter squid rings tossed in seasoned butter & chillies',
    preparationTime: 15
  },
  {
    id: 'item-11',
    name: 'Devilled Chicken Wings (6 pcs)',
    nameSi: 'ඩෙවිල්ඩ් චිකන් වින්ග්ස්',
    categoryId: 'cat-appetizers',
    price: 1250,
    available: true,
    description: 'Golden fried wings glazed in sweet & spicy Sri Lankan devilled chilli sauce',
    preparationTime: 12
  },
  {
    id: 'item-12',
    name: 'French Fries (Large with Mayo)',
    nameSi: 'ෆ්‍රෙන්ච් ෆ්‍රයිස්',
    categoryId: 'cat-appetizers',
    price: 750,
    available: true,
    description: 'Crispy salted shoestring potatoes with tomato dip and garlic mayo',
    preparationTime: 6
  },

  // Beverages
  {
    id: 'item-13',
    name: 'Fresh Lime & Mint Juice',
    nameSi: 'දෙහි සහ මින්ට් ජූස්',
    categoryId: 'cat-beverages',
    price: 450,
    available: true,
    description: 'Fresh squeezed Ceylon lime with crushed mint leaves and ice',
    preparationTime: 4
  },
  {
    id: 'item-14',
    name: 'Falooda with Ice Cream',
    nameSi: 'අයිස්ක්‍රීම් ෆලූඩා',
    categoryId: 'cat-beverages',
    price: 650,
    available: true,
    description: 'Rose syrup, basil seeds, vermicelli, chilled milk topped with vanilla scoop',
    preparationTime: 5
  },
  {
    id: 'item-15',
    name: 'Ceylon Milk Tea (Cardamom)',
    nameSi: 'එනසාල් කිරි තේ',
    categoryId: 'cat-beverages',
    price: 250,
    available: true,
    description: 'Authentic brewed Ceylon tea with fresh condensed milk and spices',
    preparationTime: 3
  },
  {
    id: 'item-16',
    name: 'Avocado Milk Smoothie',
    nameSi: 'අලිගැටපේර ස්මූති',
    categoryId: 'cat-beverages',
    price: 700,
    available: true,
    description: 'Creamy fresh avocado blended with condensed milk and honey',
    preparationTime: 5
  },

  // Desserts
  {
    id: 'item-17',
    name: 'Watalappam with Cashew',
    nameSi: 'කජු වටලප්පන්',
    categoryId: 'cat-desserts',
    price: 480,
    available: true,
    description: 'Traditional spiced coconut jaggery pudding infused with nutmeg and cardamom',
    preparationTime: 2
  },
  {
    id: 'item-18',
    name: 'Chocolate Lava Cake with Vanilla Gelato',
    nameSi: 'චොකලට් ලාවා කේක්',
    categoryId: 'cat-desserts',
    price: 850,
    available: true,
    description: 'Warm molten chocolate core served with Madagascar vanilla ice cream',
    preparationTime: 8
  }
];

export const INITIAL_TABLES: DiningTable[] = [
  { id: 'tbl-1', number: 1, name: 'Table 1', capacity: 2, status: 'occupied', currentOrderId: 'ord-101', section: 'Main Hall' },
  { id: 'tbl-2', number: 2, name: 'Table 2', capacity: 4, status: 'available', section: 'Main Hall' },
  { id: 'tbl-3', number: 3, name: 'Table 3', capacity: 4, status: 'occupied', currentOrderId: 'ord-102', section: 'Main Hall' },
  { id: 'tbl-4', number: 4, name: 'Table 4', capacity: 6, status: 'reserved', section: 'Main Hall' },
  { id: 'tbl-5', number: 5, name: 'Table 5', capacity: 2, status: 'available', section: 'Main Hall' },
  { id: 'tbl-6', number: 6, name: 'Table 6', capacity: 8, status: 'billing', currentOrderId: 'ord-103', section: 'Main Hall' },
  { id: 'tbl-7', number: 7, name: 'VIP Suite 1', capacity: 10, status: 'available', section: 'AC VIP Room' },
  { id: 'tbl-8', number: 8, name: 'VIP Suite 2', capacity: 6, status: 'occupied', currentOrderId: 'ord-104', section: 'AC VIP Room' },
  { id: 'tbl-9', number: 9, name: 'Garden 1', capacity: 4, status: 'available', section: 'Outdoor Garden' },
  { id: 'tbl-10', number: 10, name: 'Garden 2', capacity: 4, status: 'available', section: 'Outdoor Garden' },
  { id: 'tbl-11', number: 11, name: 'Rooftop T1', capacity: 4, status: 'available', section: 'Rooftop' },
  { id: 'tbl-12', number: 12, name: 'Rooftop T2', capacity: 6, status: 'available', section: 'Rooftop' },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 101,
    type: 'dine-in',
    tableId: 'tbl-1',
    tableName: 'Table 1',
    customerName: 'Kamal Perera',
    waiterName: 'Sunil',
    cashierName: 'Nimal',
    items: [
      { id: 'oi-1', menuItemId: 'item-1', name: 'Special Chicken Fried Rice', price: 1350, quantity: 2, notes: 'Extra spicy paste' },
      { id: 'oi-2', menuItemId: 'item-13', name: 'Fresh Lime & Mint Juice', price: 450, quantity: 2 }
    ],
    status: 'in-kitchen',
    subtotal: 3600,
    serviceCharge: 360,
    tax: 90,
    discount: 0,
    total: 4050,
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    kotPrinted: true
  },
  {
    id: 'ord-102',
    orderNumber: 102,
    type: 'dine-in',
    tableId: 'tbl-3',
    tableName: 'Table 3',
    customerName: 'Dr. Fernando',
    waiterName: 'Sunil',
    cashierName: 'Nimal',
    items: [
      { id: 'oi-3', menuItemId: 'item-5', name: 'Cheese Chicken Kottu', price: 1450, quantity: 1, notes: 'Less gravy' },
      { id: 'oi-4', menuItemId: 'item-10', name: 'Hot Butter Cuttlefish (HBC)', price: 1850, quantity: 1 },
      { id: 'oi-5', menuItemId: 'item-14', name: 'Falooda with Ice Cream', price: 650, quantity: 1 }
    ],
    status: 'pending',
    subtotal: 3950,
    serviceCharge: 395,
    tax: 98,
    discount: 0,
    total: 4443,
    createdAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    kotPrinted: false
  },
  {
    id: 'ord-103',
    orderNumber: 103,
    type: 'dine-in',
    tableId: 'tbl-6',
    tableName: 'Table 6',
    customerName: 'Shanuka Silva',
    waiterName: 'Asela',
    cashierName: 'Nimal',
    items: [
      { id: 'oi-6', menuItemId: 'item-3', name: 'Dum Chicken Biryani', price: 1550, quantity: 4 },
      { id: 'oi-7', menuItemId: 'item-17', name: 'Watalappam with Cashew', price: 480, quantity: 4 }
    ],
    status: 'ready',
    subtotal: 8120,
    serviceCharge: 812,
    tax: 203,
    discount: 500,
    total: 8635,
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    kotPrinted: true
  },
  {
    id: 'ord-104',
    orderNumber: 104,
    type: 'dine-in',
    tableId: 'tbl-8',
    tableName: 'VIP Suite 2',
    customerName: 'Anura Dias & Family',
    waiterName: 'Asela',
    cashierName: 'Nimal',
    items: [
      { id: 'oi-8', menuItemId: 'item-2', name: 'Mixed Seafood Fried Rice', price: 1650, quantity: 3 },
      { id: 'oi-9', menuItemId: 'item-10', name: 'Hot Butter Cuttlefish (HBC)', price: 1850, quantity: 2 },
      { id: 'oi-10', menuItemId: 'item-16', name: 'Avocado Milk Smoothie', price: 700, quantity: 3 }
    ],
    status: 'in-kitchen',
    subtotal: 10750,
    serviceCharge: 1075,
    tax: 268,
    discount: 0,
    total: 12093,
    createdAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    kotPrinted: true
  },
  {
    id: 'ord-100',
    orderNumber: 100,
    type: 'takeaway',
    customerName: 'Kasun Bandara',
    customerPhone: '077 123 4567',
    cashierName: 'Nimal',
    items: [
      { id: 'oi-11', menuItemId: 'item-8', name: 'Crispy Zinger Chicken Burger', price: 1200, quantity: 2 },
      { id: 'oi-12', menuItemId: 'item-12', name: 'French Fries (Large with Mayo)', price: 750, quantity: 1 }
    ],
    status: 'completed',
    subtotal: 3150,
    serviceCharge: 0,
    tax: 78,
    discount: 0,
    total: 3228,
    paymentMethod: 'cash',
    amountReceived: 5000,
    change: 1772,
    createdAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    kotPrinted: true
  }
];

export const RESTAURANT_CONFIG = {
  name: 'SpiceLounge Restaurant & Cafe',
  branch: 'Colombo 03 Central',
  tagline: 'Authentic Flavors & Gourmet Dining',
  address: 'No. 142 Galle Road, Kollupitiya, Colombo 03',
  phone: '+94 11 234 5678 / +94 77 987 6543',
  vatNumber: 'VAT-88492019-7000',
  currency: 'Rs.',
  serviceChargePercent: 10,
  taxPercent: 2.5,
  wifiName: 'SpiceLounge_Guest',
  wifiPassword: 'spicyfood2026',
  footerNote: 'Thank you for dining with us! Come again soon.',
  cashier: 'Nimal Perera (Shift #1)'
};
