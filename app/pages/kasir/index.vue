<template>
  <div>
    <div
      class="relative flex h-[calc(100vh-64px)] w-full overflow-hidden bg-gray-50 dark:bg-dark-bg"
    >
      <div
        class="flex-1 flex flex-col p-4 md:p-6 overflow-hidden pb-24 lg:pb-6"
      >
        <div class="flex flex-col sm:flex-row gap-4 mb-6">
          <UInput
            v-model="searchQuery"
            icon="i-heroicons-magnifying-glass"
            placeholder="Cari produk atau ukuran..."
            size="lg"
            class="flex-1"
          />
          <USelect
            v-model="selectedCategory"
            :items="['Semua', 'SD', 'SMP', 'SMA', 'Pramuka', 'Aksesoris']"
            placeholder="Kategori"
            size="lg"
            class="w-full sm:w-48"
          />
        </div>

        <div class="flex-1 overflow-y-auto pr-2">
          <div
            v-if="pending"
            class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            <USkeleton v-for="i in 8" :key="i" class="h-48 w-full rounded-xl" />
          </div>

          <div
            v-else-if="filteredProducts.length === 0"
            class="flex flex-col items-center justify-center h-full text-gray-500"
          >
            <UIcon name="i-heroicons-inbox" class="w-16 h-16 mb-2 opacity-50" />
            <p>Produk tidak ditemukan atau stok habis.</p>
          </div>

          <div
            v-else
            class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            <UCard
              v-for="variant in filteredProducts"
              :key="variant.id"
              class="group cursor-pointer hover:ring-2 hover:ring-primary transition-all duration-200 shadow-sm rounded-xl overflow-hidden flex flex-col"
              :ui="{ body: { padding: 'p-0 sm:p-0' } }"
              @click="cart.addItem(variant)"
            >
              <div
                class="h-24 sm:h-32 bg-gray-200 dark:bg-gray-800 flex flex-col items-center justify-center relative"
              >
                <UIcon
                  name="i-heroicons-cube-transparent"
                  class="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 dark:text-gray-600 mb-1"
                />
                <UBadge
                  color="primary"
                  variant="solid"
                  class="absolute top-2 right-2 text-[10px] sm:text-xs"
                >
                  Stok: {{ variant.stock }}
                </UBadge>
              </div>

              <div class="p-2 sm:p-3 flex flex-col flex-1 justify-between">
                <div>
                  <h4
                    class="font-bold text-gray-900 dark:text-white line-clamp-2 text-xs sm:text-sm"
                  >
                    {{ variant.products?.name }}
                  </h4>
                  <p
                    class="text-[10px] sm:text-xs text-gray-500 mt-1 uppercase font-semibold"
                  >
                    Size: {{ variant.size }}
                  </p>
                </div>
                <p class="text-primary font-bold text-xs sm:text-base mt-2">
                  Rp {{ variant.price.toLocaleString("id-ID") }}
                </p>
              </div>
            </UCard>
          </div>
        </div>
      </div>
      <div
        class="lg:hidden absolute bottom-0 left-0 w-full bg-white dark:bg-dark-surface border-t border-gray-200 dark:border-gray-800 p-4 z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] flex justify-between items-center transition-transform duration-300"
      >
        <div class="flex flex-col">
          <span class="text-xs text-gray-500 font-semibold uppercase"
            >Total ({{ cart.totalItems }} Pcs)</span
          >
          <span class="text-lg font-bold text-primary"
            >Rp {{ cart.totalPrice.toLocaleString("id-ID") }}</span
          >
        </div>
        <UButton
          size="lg"
          color="primary"
          class="font-bold shadow-md"
          icon="i-heroicons-shopping-bag"
          @click="isMobileCartOpen = true"
        >
          Lihat Keranjang
        </UButton>
      </div>

      <div
        v-if="isMobileCartOpen"
        class="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity backdrop-blur-sm"
        @click="isMobileCartOpen = false"
      ></div>
      <aside
        :class="[
          'absolute right-0 top-0 h-full z-50 w-full sm:w-96 flex flex-col shadow-2xl bg-white dark:bg-dark-surface border-l border-gray-200 dark:border-gray-800 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0',
          isMobileCartOpen ? 'translate-x-0' : 'translate-x-full',
        ]"
      >
        <div
          class="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-dark-bg/50"
        >
          <h3 class="font-bold text-lg flex items-center gap-2">
            <UIcon
              name="i-heroicons-shopping-cart"
              class="text-primary w-5 h-5"
            />
            Keranjang
          </h3>
          <div class="flex items-center gap-2">
            <UTooltip text="Kosongkan Keranjang">
              <UButton
                v-if="cart.items.length > 0"
                color="red"
                variant="ghost"
                icon="i-heroicons-trash"
                size="sm"
                class="cursor-pointer"
                @click="cart.clearCart()"
              />
            </UTooltip>
            <UButton
              icon="i-heroicons-x-mark"
              color="gray"
              variant="ghost"
              class="lg:hidden cursor-pointer"
              @click="isMobileCartOpen = false"
            />
          </div>
        </div>

        <div
          class="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/30 dark:bg-dark-bg/30"
        >
          <div
            v-if="cart.items.length === 0"
            class="h-full flex flex-col items-center justify-center text-gray-400 opacity-70"
          >
            <UIcon name="i-heroicons-shopping-bag" class="w-16 h-16 mb-3" />
            <p class="text-sm">Belum ada barang dipilih</p>
          </div>

          <div
            v-for="item in cart.items"
            :key="item.variant_id"
            class="bg-white dark:bg-dark-surface p-3 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-2"
          >
            <div class="flex justify-between items-start">
              <div class="pr-2">
                <p
                  class="text-sm font-bold text-gray-900 dark:text-white line-clamp-1"
                >
                  {{ item.nama_produk }}
                </p>
                <p class="text-xs text-gray-500">Size: {{ item.size }}</p>
              </div>
              <UButton
                icon="i-heroicons-x-mark"
                size="2xs"
                color="gray"
                variant="ghost"
                class="cursor-pointer -mr-1 -mt-1 shrink-0"
                @click="cart.removeItem(item.variant_id)"
              />
            </div>

            <div class="flex items-center justify-between mt-1">
              <p class="text-sm font-bold text-primary">
                Rp {{ (item.price * item.qty).toLocaleString("id-ID") }}
              </p>
              <div
                class="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5"
              >
                <UButton
                  icon="i-heroicons-minus"
                  size="2xs"
                  color="gray"
                  variant="ghost"
                  class="cursor-pointer"
                  @click="cart.updateQty(item.variant_id, item.qty - 1)"
                />
                <span class="text-xs font-bold w-6 text-center">{{
                  item.qty
                }}</span>
                <UButton
                  icon="i-heroicons-plus"
                  size="2xs"
                  color="gray"
                  variant="ghost"
                  class="cursor-pointer"
                  @click="cart.updateQty(item.variant_id, item.qty + 1)"
                />
              </div>
            </div>
          </div>
        </div>

        <div
          class="p-4 bg-white dark:bg-dark-surface border-t border-gray-200 dark:border-gray-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]"
        >
          <div class="space-y-2 mb-4">
            <div
              class="flex justify-between text-sm text-gray-600 dark:text-gray-400"
            >
              <span>Total Item</span><span>{{ cart.totalItems }} Pcs</span>
            </div>
            <div
              class="flex justify-between font-extrabold text-xl text-gray-900 dark:text-white"
            >
              <span>Subtotal</span
              ><span class="text-primary"
                >Rp {{ cart.totalPrice.toLocaleString("id-ID") }}</span
              >
            </div>
          </div>

          <UButton
            block
            size="xl"
            color="primary"
            class="font-bold cursor-pointer transition-transform active:scale-95"
            :disabled="cart.items.length === 0"
            :loading="isCheckoutLoading"
            @click="processCheckout"
          >
            Proses Pembayaran
          </UButton>
        </div>
      </aside>
    </div>
    <ClientOnly>
      <UModal
        v-model:open="isReceiptOpen"
        title="Transaksi Berhasil! 🎉"
        description="Pembayaran telah diterima dan stok berhasil dipotong."
        prevent-close
      >
        <template #body>
          <div
            class="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg flex justify-center w-full my-4"
          >
            <div
              class="bg-white text-black p-4 w-full max-w-xs font-mono text-sm shadow-md border-t-4 border-gray-400"
            >
              <div
                class="text-center mb-4 border-b border-dashed border-gray-400 pb-2"
              >
                <p class="font-bold">TOKO SERAGAM HILDAMR</p>
                <p class="text-xs">Preview Struk</p>
              </div>
              <div class="text-xs space-y-1 mb-4">
                <p>Kasir: {{ receiptData?.cashier }}</p>
                <p>
                  Total: Rp {{ receiptData?.total?.toLocaleString("id-ID") }}
                </p>
              </div>
              <p class="text-center text-xs text-gray-500 mt-4">
                *Klik Cetak untuk melihat format penuh*
              </p>
            </div>
          </div>
        </template>

        <template #footer>
          <div class="flex justify-end gap-3 w-full">
            <UButton
              color="gray"
              variant="ghost"
              class="cursor-pointer"
              @click="isReceiptOpen = false"
              >Tutup Lanjut Jualan</UButton
            >
            <UButton
              color="primary"
              icon="i-heroicons-printer"
              class="cursor-pointer"
              @click="printReceipt"
              >Cetak Struk</UButton
            >
          </div>
        </template>
      </UModal>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
// --- SETUP & STATE ---
definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

const cart = useCart();
const supabase = useSupabaseClient();
const toast = useToast();
const user = useSupabaseUser();

// --- STATE MANAGEMENT ---
const isCheckoutLoading = ref(false);
const isReceiptOpen = ref(false);
const receiptData = ref<any>(null);
const isMobileCartOpen = ref(false);
const searchQuery = ref("");
const selectedCategory = ref("Semua");

// --- FETCH DATA ---
const { data: rawProducts, pending } = await useAsyncData(
  "pos-katalog",
  async () => {
    const { data, error } = await supabase
      .from("variants")
      .select(
        `
        id, size, price, stock,
        products ( name, category )
      `,
      )
      .gt("stock", 0)
      .order("stock", { ascending: false });

    if (error) {
      console.error("Gagal load katalog:", error);
      return [];
    }
    return data;
  },
);

// --- SEARCH & FILTER LOGIC ---
const filteredProducts = computed(() => {
  if (!rawProducts.value) return [];
  return rawProducts.value.filter((v) => {
    const productName = v.products?.name?.toLowerCase() || "";
    const categoryName = v.products?.category || "";
    const matchSearch =
      productName.includes(searchQuery.value.toLowerCase()) ||
      v.size.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchCat =
      selectedCategory.value === "Semua" ||
      categoryName === selectedCategory.value;
    return matchSearch && matchCat;
  });
});

// --- CHECKOUT HANDLER ---
const processCheckout = async () => {
  if (cart.items.length === 0) return;
  isCheckoutLoading.value = true;

  try {
    const { data: trxData, error: trxError } = await supabase
      .from("transactions")
      .insert([
        {
          cashier_id: user.value?.id,
          total_amount: cart.totalPrice,
        },
      ])
      .select("id")
      .single();

    if (trxError) throw trxError;
    const transactionId = trxData.id;

    const trxItems = [];
    const invLogs = [];

    for (const item of cart.items) {
      trxItems.push({
        transaction_id: transactionId,
        variant_id: item.variant_id,
        qty: item.qty,
        price_at_transaction: item.price,
        subtotal: item.price * item.qty,
      });

      invLogs.push({
        variant_id: item.variant_id,
        user_id: user.value?.id,
        change_type: "out",
        qty_changed: item.qty,
      });

      const newStock = item.max_stock - item.qty;
      const { error: updateError } = await supabase
        .from("variants")
        .update({ stock: newStock })
        .eq("id", item.variant_id);

      if (updateError) throw updateError;
    }

    const { error: itemsError } = await supabase
      .from("transaction_items")
      .insert(trxItems);
    if (itemsError) throw itemsError;

    const { error: logsError } = await supabase
      .from("inventory_logs")
      .insert(invLogs);
    if (logsError) throw logsError;

    // --- SETUP DATA STRUK SEBELUM KERANJANG DIHAPUS ---
    receiptData.value = {
      transactionId: transactionId,
      date: new Date().toLocaleString("id-ID"),
      cashier: user.value?.email?.split("@")[0] || "Kasir",
      items: JSON.parse(JSON.stringify(cart.items)),
      total: cart.totalPrice,
    };

    isReceiptOpen.value = true;

    // --- RESET STATE ---
    cart.clearCart();
    isMobileCartOpen.value = false;
    refreshNuxtData("pos-katalog");
  } catch (error: any) {
    console.error("Gagal Checkout:", error.message);
    toast.add({
      title: "Checkout Gagal",
      description: error.message,
      color: "red",
    });
  } finally {
    isCheckoutLoading.value = false;
  }
};

// --- FUNGSI CETAK STRUK THERMAL ---
const printReceipt = () => {
  const printWindow = window.open("", "_blank", "width=400,height=600");
  if (!printWindow) return;

  const html = `
    <html>
      <head>
        <title>Struk Pembayaran</title>
        <style>
          body { font-family: 'Courier New', Courier, monospace; padding: 10px; color: black; font-size: 12px; width: 100%; max-width: 300px; margin: 0 auto; }
          .text-center { text-align: center; }
          .fw-bold { font-weight: bold; }
          .divider { border-bottom: 1px dashed black; margin: 10px 0; }
          .flex-between { display: flex; justify-content: space-between; }
          .item-detail { margin: 0 0 5px 0; }
          p { margin: 3px 0; }
        </style>
      </head>
      <body>
        <div class="text-center">
          <h2 style="margin-bottom: 5px;">TOKO SERAGAM HILDAMR</h2>
          <p>Jl. Teknologi No. 99, Jakarta</p>
        </div>
        
        <div class="divider"></div>
        <p>No TRX: ${receiptData.value.transactionId.substring(0, 8).toUpperCase()}</p>
        <p>Waktu : ${receiptData.value.date}</p>
        <p>Kasir : ${receiptData.value.cashier}</p>
        <div class="divider"></div>

        ${receiptData.value.items
          .map(
            (item: any) => `
          <p class="fw-bold">${item.nama_produk} (${item.size})</p>
          <p class="flex-between item-detail">
            <span>${item.qty} x ${item.price.toLocaleString("id-ID")}</span>
            <span>${(item.qty * item.price).toLocaleString("id-ID")}</span>
          </p>
        `,
          )
          .join("")}

        <div class="divider"></div>
        <div class="flex-between fw-bold" style="font-size: 14px;">
          <span>TOTAL</span>
          <span>Rp ${receiptData.value.total.toLocaleString("id-ID")}</span>
        </div>
        <div class="divider"></div>

        <div class="text-center" style="margin-top: 15px;">
          <p>Terima Kasih!</p>
          <p style="font-size: 10px;">Barang yang sudah dibeli tidak dapat ditukar/dikembalikan.</p>
        </div>

        <script>
          window.onload = () => { 
            window.print(); 
            window.close(); 
          }
        <\/script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};
</script>
