<template>
  <div class="p-6">
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Inventori Gudang
        </h1>
        <p class="text-gray-500 text-sm mt-1">
          Kelola stok produk dan varian seragam.
        </p>
      </div>

      <div class="flex items-center gap-3 w-full md:w-auto">
        <UInput
          v-model="searchQuery"
          icon="i-heroicons-magnifying-glass"
          placeholder="Cari produk atau ukuran..."
          class="w-full md:w-64"
        />
        <UButton
          icon="i-heroicons-plus"
          color="primary"
          class="font-bold cursor-pointer shrink-0"
          @click="openAddModal"
        >
          Tambah Barang
        </UButton>
      </div>
    </div>

    <UCard class="w-full shadow-sm border-none bg-white dark:bg-dark-surface">
      <UTable
        :data="filteredInventory"
        :columns="columns"
        :loading="pending"
        class="w-full"
      >
        <template #image-cell="{ row }">
          <div
            class="flex items-center justify-center w-10 h-10 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          >
            <img
              v-if="row.original.image_url"
              :src="row.original.image_url"
              alt="Foto Produk"
              class="object-cover w-full h-full"
            />
            <UIcon
              v-else
              name="i-heroicons-photo"
              class="w-5 h-5 text-gray-400"
            />
          </div>
        </template>
        <template #actions-cell="{ row }">
          <div class="flex gap-2">
            <UTooltip text="Edit Barang">
              <UButton
                size="xs"
                color="gray"
                variant="ghost"
                icon="i-heroicons-pencil-square"
                class="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                @click="editItem(row.original || row)"
              />
            </UTooltip>
            <UTooltip text="Hapus Barang">
              <UButton
                size="xs"
                color="red"
                variant="ghost"
                icon="i-heroicons-trash"
                class="cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                @click="confirmDelete(row.original || row)"
              />
            </UTooltip>
          </div>
        </template>
      </UTable>
    </UCard>

    <ClientOnly>
      <GudangSlideoverForm
        v-model:open="isSlideoverOpen"
        :mode="formMode"
        :initial-data="selectedItemToForm"
        @refresh="refreshData"
      />

      <UiConfirmModal
        v-model:open="isConfirmOpen"
        title="Hapus Data Barang"
        :description="`Yakin mau hapus produk ${selectedItem?.nama_produk} ukuran ${selectedItem?.size}? Tindakan ini tidak bisa dibatalkan.`"
        confirmText="Ya, Hapus"
        confirmColor="red"
        :isLoading="isDeleting"
        @confirm="executeDelete"
      />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
// Tambahin lang="ts" biar fitur TypeScriptnya nyala
definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

const supabase = useSupabaseClient();
const toast = useToast();
const isConfirmOpen = ref(false);
const isDeleting = ref(false);
const selectedItem = ref<any>(null);
const formMode = ref<"add" | "edit">("add");
const selectedItemToForm = ref<any>(null); // Beda dengan selectedItem buat delete ya

// 1. Definisi Tipe Data (Interface)
interface Product {
  name: string;
  category: string;
  image_url: string | null;
}

interface Variant {
  id: string;
  product_id: string;
  size: string;
  price: number;
  stock: number;
  products: Product;
}

// 2. State Management
const searchQuery = ref("");
const isSlideoverOpen = ref(false);

// 3. Definisi Kolom UTable
const columns = [
  { accessorKey: "image", header: "Foto" },
  { accessorKey: "nama_produk", header: "Nama Produk" },
  { accessorKey: "size", header: "Ukuran" },
  { accessorKey: "price_format", header: "Harga" },
  { accessorKey: "stock", header: "Stok (Pcs)" },
  { accessorKey: "actions", header: "Aksi" },
];

// 4. Fetch Data dari Supabase
const { data: rawInventory, pending } = await useAsyncData<Variant[]>(
  "inventory",
  async () => {
    // Ingat skema kita: products (id, name, dll) & variants (id, product_id, size, price, stock)
    const { data, error } = await supabase
      .from("variants")
      .select(
        `
        id,
        product_id,
        size,
        price,
        stock,
        products (
          name,
          category,
          image_url
        )
      `,
      )
      .order("stock", { ascending: true }) // Aturan 1: Urutkan dari stok terkecil (biar gampang lihat yg mau habis)
      .order("id", { ascending: true });

    if (error) {
      console.error("Gagal menarik data:", error.message);
      return [];
    }
    // Casting tipe data biar TS nggak bawel
    return data as unknown as Variant[];
  },
);

const refreshData = () => {
  refreshNuxtData("inventory");
};

// 5. Mapping Data biar rapi
// 5. Mapping Data biar rapi
const formattedInventory = computed(() => {
  if (!rawInventory.value) return [];

  return rawInventory.value.map((item) => ({
    id: item.id,
    product_id: item.product_id,
    // Kita simpan URL gambar di root object biar gampang diakses UTable
    image_url: item.products?.image_url || null,
    nama_produk: item.products?.name || "Produk Tidak Diketahui",
    category: item.products?.category || "",
    size: item.size || "-",
    price_format: item.price
      ? `Rp ${item.price.toLocaleString("id-ID")}`
      : "Rp 0",
    stock: item.stock || 0,
    raw_price: item.price,
  }));
});

// 6. Logika Search/Filter
const filteredInventory = computed(() => {
  if (!searchQuery.value) return formattedInventory.value;

  const query = searchQuery.value.toLowerCase();
  return formattedInventory.value.filter(
    (item) =>
      item.nama_produk.toLowerCase().includes(query) ||
      item.size.toLowerCase().includes(query),
  );
});

// 7. Function Handlers (Sementara di-console.log dulu biar nggak error)
const openAddModal = () => {
  formMode.value = "add";
  selectedItemToForm.value = null;
  isSlideoverOpen.value = true;
};

const editItem = (item: any) => {
  formMode.value = "edit";
  selectedItemToForm.value = item;
  isSlideoverOpen.value = true;
};

const confirmDelete = (item: any) => {
  selectedItem.value = item;
  isConfirmOpen.value = true;
};

const executeDelete = async () => {
  if (!selectedItem.value) return;

  isDeleting.value = true;

  try {
    const { error } = await supabase
      .from("variants")
      .delete()
      .eq("id", selectedItem.value.id);

    // TANGKAP ERROR FOREIGN KEY DI SINI
    if (error) {
      if (error.code === "23503") {
        throw new Error(
          "Barang ini tidak bisa dihapus karena sudah ada riwayat transaksinya di Kasir (Laporan bisa rusak). Saran: Edit barang dan ubah stoknya menjadi 0.",
        );
      }
      throw error; // Lempar error lain kalau bukan 23503
    }

    toast.add({
      title: "Berhasil",
      description: "Data barang berhasil dihapus dari sistem.",
      color: "green",
    });

    // Tutup modal dan bersihin state
    isConfirmOpen.value = false;
    selectedItem.value = null;
    refreshData();
  } catch (error: any) {
    console.error("Gagal hapus data:", error.message);
    toast.add({
      title: "Ditolak Sistem 🛑",
      description: error.message || "Gagal menghapus data dari database.",
      color: "red",
      timeout: 6000, // Biar notifnya agak lama dikit biar bisa dibaca
    });
  } finally {
    isDeleting.value = false;
    isConfirmOpen.value = false; // Pastikan modal tertutup meski error
  }
};
</script>
