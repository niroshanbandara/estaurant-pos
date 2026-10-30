# 🍽️ SpiceLounge Restaurant POS & Kitchen Display System

Modern, fast, and responsive Point of Sale (POS) application built for Restaurants, Cafes, and Food Outlets.

---

## 🚀 Features

- **🛒 Cashier POS Terminal**:
  - Dine-in, Takeaway & Delivery order switching.
  - Quick menu search in English & Sinhala (සිංහල).
  - Add-ons and custom cooking instructions (e.g. *Less spicy*, *No onions*).
  - Flexible discount input, 10% Service charge, and 2.5% VAT calculation.
  - Cash, Card, and LankaQR / digital payment support.

- **🪑 Table Floor Management (මේස කළමනාකරණය)**:
  - Real-time visual floor plan (Main Hall, AC VIP Rooms, Outdoor Garden, Rooftop).
  - Table statuses: Available (Green), Occupied (Red), Reserved (Yellow), Billing (Blue).
  - One-click seat guests, add items to running checks, or settle bills.

- **🍳 Kitchen Display System (KDS) & KOT (කුස්සියේ තිරය)**:
  - Real-time orders ticket board for chefs with elapsed time warnings (Green $\to$ Amber $\to$ Red).
  - Interactive checklists to mark individual dishes done while cooking.
  - Status progression: Queued $\to$ Cooking $\to$ Ready to Serve.
  - Printable Kitchen Order Ticket (KOT).

- **🖨️ 80mm / 58mm Thermal Bill Printing**:
  - Standard thermal receipt layout ready with `window.print()`.
  - Itemized breakdowns, tax invoices, cash tendered & change return calculations.

- **📊 Daily Sales Reports & Cash Register Shift Closing (Z-Report)**:
  - Daily gross revenue, sales by payment type (Cash vs Card vs QR).
  - Top 5 best-selling food items leaderboard.
  - Cash drawer reconciliation calculator (Opening float + cash sales vs physical cash count).

---

## 💻 How to Run

1. Open your terminal in this directory:
   ```bash
   cd /Users/niroshanjayarathna/.gemini/antigravity/scratch/restaurant-pos
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Open in your browser:
   - Cashier PC / Local: **`http://localhost:3000`**
   - Tablets & Kitchen Screens on the same Wi-Fi: **`http://192.168.8.196:3000`**

---

## ⚙️ Customization

- Edit restaurant name, address, telephone, and tax rates in:
  `src/data/mockData.ts` -> `RESTAURANT_CONFIG`
- Add or modify food items, prices, and categories in:
  `src/data/mockData.ts` -> `INITIAL_MENU_ITEMS`
