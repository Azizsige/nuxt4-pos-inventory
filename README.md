# 🛍️ Enterprise POS & Inventory System - Toko Seragam Hildamr

Sebuah sistem Point of Sales (POS) dan Manajemen Inventaris skala menengah-atas yang dibangun menggunakan **Nuxt 4** dan **Supabase**. Dirancang dengan arsitektur modern, UI/UX responsif, serta keamanan Role-Based Access Control (RBAC) berlapis.

## ✨ Fitur Utama

Sistem ini memisahkan hak akses menjadi 3 peran utama (Admin, Kasir, Gudang) dan 1 halaman publik:

### 🌐 1. Katalog B2C (Publik)

- **Real-time Stock:** Pelanggan dapat melihat ketersediaan stok secara langsung.
- **Smart Badge:** Indikator visual pintar (Tersedia, Sisa X, HABIS).
- **WhatsApp Order:** Pemesanan terintegrasi langsung ke WhatsApp dengan format pesan otomatis. Barang "Habis" otomatis dikunci dari interaksi.

### 🛒 2. Modul Kasir (POS)

- Sistem antarmuka kasir yang cepat dan responsif.
- **Auto-Deduct Inventory:** Stok gudang otomatis berkurang secara _real-time_ saat transaksi berhasil.
- Price Snapshot logic untuk riwayat harga transaksi yang akurat.

### 📦 3. Modul Gudang

- Manajemen Master Produk dan Varian (Ukuran S, M, L, dll).
- Kontrol stok fisik dan pembaruan harga.
- Akses terisolasi (Staf gudang tidak dapat melihat omset toko).

### 👑 4. Dashboard Admin (Pemilik)

- **Analitik & Metrik:** Pantau total omset, transaksi, barang terjual, dan stok kritis.
- **Filter Waktu:** Laporan dinamis berdasarkan rentang tanggal kalender.
- **Transaction Modal:** Rincian detail item per nota transaksi.
- **Advanced Export:** Menggunakan `ExcelJS` untuk men-generate file `.xlsx` berisi 3 Sheet (Ringkasan Omset, Rincian Barang Terjual, dan Daftar Stok Kritis).

### 🛡️ Keamanan & Infrastruktur

- **Strict RBAC:** Middleware Nuxt Route Guard & Supabase Row Level Security (RLS).
- **Dynamic Sidebar:** Menu UI beradaptasi sesuai _role_ user yang login.

---

## 🛠️ Tech Stack

- **Framework:** [Nuxt 4](https://nuxt.com/) (Vue.js)
- **UI Library:** [Nuxt UI v3](https://ui.nuxt.com/) & Tailwind CSS v4
- **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL)
- **State Management:** Nuxt `useState` & Supabase Composables
- **Export Tool:** `exceljs`

---

## 🚀 Roadmap Development (100% Completed)

- [x] **Step 1: Setup & Inisialisasi Project**
  - [x] Inisialisasi Nuxt 4 & integrasi Tailwind v4
  - [x] Setup Design System & Instalasi Nuxt UI v3
  - [x] Patch keamanan Export (Migrasi ke ExcelJS)

- [x] **Step 2: Setup Database & Authentication**
  - [x] SQL Schema (`users`, `products`, `variants`, `transactions`, `transaction_items`)
  - [x] Setup Supabase Auth & Row Level Security (RLS)
  - [x] Role-Based Middleware (`app/middleware/auth.ts`)

- [x] **Step 3: Base Layouting & Routing**
  - [x] Setup layout dinamis (Sidebar & Header) menyesuaikan Role
  - [x] Routing setup (`/admin`, `/kasir`, `/gudang`, `/`)

- [x] **Step 4: Pengembangan Fitur Inti**
  - [x] Katalog B2C dengan filter pencarian pintar
  - [x] Modul POS Kasir & Keranjang Belanja
  - [x] Modul Manajemen Gudang & Varian

- [x] **Step 5: Reporting, Security & Export**
  - [x] Dashboard Analitik Admin dengan Filter Tanggal
  - [x] Export Laporan Multi-sheet via ExcelJS
  - [x] Final Polish (UI Bug Fixes, RLS Synchronization)

---

## 💻 Cara Menjalankan Project (Local Development)

1. **Clone repository ini:**

   ```bash
   git clone [https://github.com/Azizsige/nuxt4-pos-inventory.git](https://github.com/Azizsige/nuxt4-pos-inventory.git)
   cd nuxt4-pos-inventory
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Setup environment variables:**
   Buat file `.env` di root project dengan isi:

   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   ```

4. **Jalankan development server:**
   ```bash
   npm run dev
   ```
