import { defineStore } from "pinia";

// Definisi Interface biar TypeScript nggak bingung
interface CartItem {
  variant_id: string;
  nama_produk: string;
  size: string;
  price: number;
  qty: number;
  max_stock: number;
}

export const useCart = defineStore("cart", {
  // 1. STATE: Tempat penyimpanan data sementara di browser
  state: () => ({
    items: [] as CartItem[],
  }),

  // 2. GETTERS: Fungsi untuk menghitung data secara otomatis (computed)
  getters: {
    // Total jumlah barang di keranjang
    totalItems: (state) =>
      state.items.reduce((total, item) => total + item.qty, 0),
    // Total harga yang harus dibayar
    totalPrice: (state) =>
      state.items.reduce((total, item) => total + item.price * item.qty, 0),
  },

  // 3. ACTIONS: Logika untuk mengubah isi keranjang
  actions: {
    // Fungsi nambah barang ke keranjang
    addItem(variant: any) {
      const existingItem = this.items.find(
        (item) => item.variant_id === variant.id,
      );

      if (existingItem) {
        // Cek stok gudang dulu sebelum nambah qty
        if (existingItem.qty < variant.stock) {
          existingItem.qty++;
        } else {
          // Kasih peringatan kalau stok habis (Opsional)
          const toast = useToast();
          toast.add({
            title: "Stok Terbatas",
            description: "Jumlah di keranjang sudah maksimal.",
            color: "orange",
          });
        }
      } else {
        // Jika barang belum ada di keranjang, push data baru
        this.items.push({
          variant_id: variant.id,
          nama_produk: variant.products?.name || "Produk Tidak Diketahui",
          size: variant.size,
          price: variant.price,
          qty: 1,
          max_stock: variant.stock,
        });
      }
    },

    // Fungsi hapus barang dari keranjang
    removeItem(variant_id: string) {
      this.items = this.items.filter((item) => item.variant_id !== variant_id);
    },

    // Fungsi update qty (misal input manual atau klik plus/minus)
    updateQty(variant_id: string, qty: number) {
      const item = this.items.find((i) => i.variant_id === variant_id);

      if (item) {
        if (qty <= 0) {
          this.removeItem(variant_id);
        } else if (qty <= item.max_stock) {
          item.qty = qty;
        }
      }
    },

    // Reset keranjang (setelah transaksi sukses)
    clearCart() {
      this.items = [];
    },
  },
});
