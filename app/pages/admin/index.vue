<template>
  <div class="p-2 sm:p-6 space-y-8">
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
    >
      <div>
        <h1
          class="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2"
        >
          <UIcon
            name="i-heroicons-chart-bar-square"
            class="text-primary w-8 h-8"
          />
          Dashboard Bos
        </h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Laporan detail penjualan dan inventaris.
        </p>
      </div>

      <div
        class="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto"
      >
        <div
          class="flex items-center gap-2 bg-white dark:bg-dark-surface p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm w-full sm:w-auto"
        >
          <UInput v-model="startDate" type="date" size="sm" variant="ghost" />
          <span class="text-gray-400 text-sm font-bold px-1">s/d</span>
          <UInput v-model="endDate" type="date" size="sm" variant="ghost" />
        </div>
        <UButton
          color="primary"
          icon="i-heroicons-document-arrow-down"
          :loading="isExporting"
          @click="downloadReport"
          class="font-bold cursor-pointer w-full sm:w-auto justify-center"
          >Export</UButton
        >
      </div>
    </div>

    <div
      v-if="pending"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
    >
      <USkeleton v-for="i in 4" :key="i" class="h-28 w-full rounded-xl" />
    </div>
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
    >
      <UCard
        class="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-none shadow-lg"
      >
        <p class="text-green-100 text-sm font-medium mb-1">Total Omset</p>
        <h3 class="text-3xl font-black">
          Rp {{ dashboard?.stats.omset.toLocaleString("id-ID") }}
        </h3>
      </UCard>
      <UCard
        class="bg-white dark:bg-dark-surface border border-gray-100 dark:border-gray-800"
      >
        <p class="text-gray-500 text-sm font-medium mb-1">Total Nota</p>
        <h3 class="text-3xl font-black text-gray-900 dark:text-white">
          {{ dashboard?.stats.transaksi }}
        </h3>
      </UCard>
      <UCard
        class="bg-white dark:bg-dark-surface border border-gray-100 dark:border-gray-800"
      >
        <p class="text-gray-500 text-sm font-medium mb-1">Item Terjual</p>
        <h3 class="text-3xl font-black text-gray-900 dark:text-white">
          {{ dashboard?.stats.barangTerjual }}
        </h3>
      </UCard>
      <UCard
        class="bg-white dark:bg-dark-surface border border-gray-100 dark:border-gray-800"
      >
        <p class="text-gray-500 text-sm font-medium mb-1">Stok Kritis</p>
        <h3 class="text-3xl font-black text-red-600">
          {{ dashboard?.stats.stokKritis }}
        </h3>
      </UCard>
    </div>

    <UCard class="shadow-sm border-none bg-white dark:bg-dark-surface">
      <template #header>
        <h3 class="font-bold text-gray-900 dark:text-white">
          Daftar Penjualan
        </h3>
      </template>
      <UTable
        :data="dashboard?.lastTransactions || []"
        :columns="trxColumns"
        :loading="pending"
      >
        <template #actions-cell="{ row }">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-eye"
            size="sm"
            @click="openDetail(row.original || row)"
          />
        </template>
      </UTable>
    </UCard>

    <UModal v-model:open="isModalOpen">
      <template #content>
        <UCard
          :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }"
        >
          <template #header>
            <div class="flex items-center justify-between">
              <h3
                class="text-base font-bold text-gray-900 dark:text-white leading-6"
              >
                Detail Nota: {{ selectedTrx?.id }}
              </h3>
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-x-mark-20-solid"
                class="-my-1"
                @click="isModalOpen = false"
              />
            </div>
          </template>

          <div class="p-4 space-y-4">
            <div
              v-for="(item, index) in selectedTrx?.rawItems"
              :key="index"
              class="flex justify-between items-center border-b border-gray-50 dark:border-gray-800 pb-3"
            >
              <div>
                <p class="font-bold text-sm">
                  {{ item.variants.products.name }}
                </p>
                <p class="text-xs text-gray-500">
                  Size: {{ item.variants.size }} | {{ item.qty }} x Rp
                  {{ item.price_at_transaction.toLocaleString("id-ID") }}
                </p>
              </div>
              <p class="font-bold text-primary">
                Rp
                {{
                  (item.qty * item.price_at_transaction).toLocaleString("id-ID")
                }}
              </p>
            </div>
            <div class="pt-2 flex justify-between items-center">
              <p class="font-black text-lg">Total Pembayaran</p>
              <p class="font-black text-lg text-primary">
                Rp {{ selectedTrx?.rawTotal.toLocaleString("id-ID") }}
              </p>
            </div>
          </div>
        </UCard>
      </template>
    </UModal>
  </div>
</template>

<script setup>
import ExcelJS from "exceljs";
definePageMeta({ layout: "dashboard", middleware: "auth" });

const supabase = useSupabaseClient();
const toast = useToast();
const isExporting = ref(false);
const isModalOpen = ref(false);
const selectedTrx = ref(null);

const startDate = ref(new Date().toISOString().split("T")[0]);
const endDate = ref(new Date().toISOString().split("T")[0]);

const trxColumns = [
  { accessorKey: "id", header: "ID Nota" },
  { accessorKey: "time", header: "Waktu" },
  { accessorKey: "total", header: "Total" },
  { accessorKey: "actions", header: "Opsi" }, // Kolom buat tombol Detail
];

// --- FETCH DATA COMPREHENSIVE ---
const { data: dashboard, pending } = await useAsyncData(
  "dashboard-data",
  async () => {
    const startStr = new Date(startDate.value + "T00:00:00Z").toISOString();
    const endStr = new Date(endDate.value + "T23:59:59Z").toISOString();

    const { data: trxInRange } = await supabase
      .from("transactions")
      .select(
        `
      id, total_amount, created_at,
      transaction_items (
        qty, price_at_transaction,
        variants ( size, products ( name ) )
      )
    `,
      )
      .gte("created_at", startStr)
      .lte("created_at", endStr)
      .order("created_at", { ascending: false });

    const omset = (trxInRange || []).reduce(
      (acc, curr) => acc + (curr.total_amount || 0),
      0,
    );
    const { data: lowStock } = await supabase
      .from("variants")
      .select("id, size, stock, products(name)")
      .lt("stock", 5);

    return {
      stats: {
        omset,
        transaksi: trxInRange?.length || 0,
        barangTerjual: (trxInRange || []).reduce(
          (acc, t) => acc + t.transaction_items.reduce((a, b) => a + b.qty, 0),
          0,
        ),
        stokKritis: lowStock?.length || 0,
      },
      lowStock: (lowStock || []).map((i) => ({
        id: i.id,
        name: i.products.name,
        size: i.size,
        stock: i.stock,
      })),
      lastTransactions: (trxInRange || []).map((trx) => ({
        id: `TRX-${trx.id.substring(0, 5).toUpperCase()}`,
        time: new Date(trx.created_at).toLocaleString("id-ID"),
        total: `Rp ${trx.total_amount.toLocaleString("id-ID")}`,
        rawItems: trx.transaction_items, // Data buat Modal
        rawTotal: trx.total_amount,
      })),
    };
  },
  { watch: [startDate, endDate] },
);

const openDetail = (row) => {
  selectedTrx.value = row;
  isModalOpen.value = true;
};

const downloadReport = async () => {
  if (!dashboard.value) return;
  isExporting.value = true;
  try {
    const workbook = new ExcelJS.Workbook();
    // Sheet 1: Ringkasan
    const s1 = workbook.addWorksheet("Ringkasan");
    s1.addRow(["TOTAL OMSET", dashboard.value.stats.omset]);
    // Sheet 2: Daftar Penjualan Detail (Per Barang)
    const s2 = workbook.addWorksheet("Detail Barang Terjual");
    s2.addRow(["ID Nota", "Nama Barang", "Size", "Qty", "Subtotal"]);
    dashboard.value.lastTransactions.forEach((trx) => {
      trx.rawItems.forEach((item) => {
        s2.addRow([
          trx.id,
          item.variants.products.name,
          item.variants.size,
          item.qty,
          item.qty * item.price_at_transaction,
        ]);
      });
    });
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = `Laporan_Sangat_Lengkap.xlsx`;
    a.click();
  } catch (e) {
    toast.add({ title: "Gagal", color: "red" });
  } finally {
    isExporting.value = false;
  }
};
</script>
