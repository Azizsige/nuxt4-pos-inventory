## 🚀 Roadmap Development

- [x] **Step 1: Setup & Inisialisasi Project**
  - [x] Inisialisasi Nuxt 4 & aktivasi struktur `app/`
  - [x] Integrasi Tailwind v4 via Vite `@theme`
  - [x] Setup Design System (Nuxt Official Palette: Green, Vulcan, Slate)
  - [x] Instalasi Module (Nuxt UI v3, Pinia, Supabase, VueUse)
  - [x] Patch keamanan (Migrasi dari SheetJS/xlsx ke ExcelJS)

- [ ] **Step 2: Setup Database (Supabase) & Authentication**
  - [ ] SQL Schema Definition (`users`, `products`, `variants`, `transactions`, `transaction_items`, `inventory_logs` dengan FK)
  - [ ] Setup Supabase Auth (Email/Password) di Dashboard
  - [ ] Role-Based Middleware (`app/middleware/auth.ts` untuk proteksi role admin/gudang/kasir)

- [ ] **Step 3: Base Layouting & Routing**
  - [ ] Setup layout Admin (Sidebar & Header)
  - [ ] Setup layout Kasir & Gudang
  - [ ] Konfigurasi Nuxt Pages (`/admin`, `/kasir`, `/gudang`, `/katalog`)

- [ ] **Step 4: Pengembangan Fitur Inti**
  - [ ] Katalog B2C (Real-time stock)
  - [ ] Modul POS Kasir & Keranjang Belanja (Pinia)
  - [ ] Modul Manajemen Gudang (Master produk & Varian)

- [ ] **Step 5: Reporting & Export**
  - [ ] Dashboard Analitik Admin
  - [ ] Export Laporan (PDF via jsPDF & Excel via ExcelJS)
