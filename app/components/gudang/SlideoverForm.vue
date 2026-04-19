<template>
  <USlideover
    v-model:open="isOpen"
    :title="isEdit ? 'Edit Barang' : 'Tambah Barang Baru'"
    :description="
      isEdit
        ? 'Ubah detail barang di bawah ini.'
        : 'Isi form di bawah untuk menambah stok ke gudang.'
    "
  >
    <template #body>
      <form id="form-barang" @submit.prevent="submitForm" class="space-y-4">
        <UFormField label="Nama Produk" name="name" required>
          <UInput
            v-model="state.name"
            placeholder="Contoh: Seragam SD Merah Putih"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Kategori" name="category" required>
          <USelect
            v-model="state.category"
            :items="['SD', 'SMP', 'SMA', 'Pramuka', 'Aksesoris']"
            placeholder="Pilih Kategori"
            class="w-full"
          />
        </UFormField>

        <div class="my-6 border-t border-gray-200 dark:border-gray-800"></div>
        <h4 class="text-sm font-medium mb-3 text-gray-900 dark:text-white">
          Detail Varian
        </h4>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Ukuran" name="size" required>
            <UInput
              v-model="state.size"
              placeholder="Contoh: XL"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Stok" name="stock" required>
            <UInput
              v-model="state.stock"
              type="number"
              min="0"
              class="w-full"
            />
          </UFormField>
        </div>

        <UFormField label="Harga Jual" name="price" required>
          <UInput v-model="state.price" type="number" min="0" class="w-full">
            <template #leading>
              <span class="text-gray-500 dark:text-gray-400 sm:text-sm"
                >Rp</span
              >
            </template>
          </UInput>
        </UFormField>

        <button type="submit" class="hidden"></button>
      </form>
    </template>

    <template #footer>
      <div class="flex justify-end gap-3 w-full">
        <UButton
          color="gray"
          variant="ghost"
          class="cursor-pointer"
          @click="isOpen = false"
          >Batal</UButton
        >

        <UButton
          type="submit"
          form="form-barang"
          color="primary"
          class="cursor-pointer"
          :loading="isLoading"
        >
          {{ isEdit ? "Simpan Perubahan" : "Simpan Data" }}
        </UButton>
      </div>
    </template>
  </USlideover>
</template>

<script setup lang="ts">
const isOpen = defineModel<boolean>("open");
const emit = defineEmits(["refresh"]);

// Definisi Props untuk menerima mode dan data dari parent (index.vue)
interface Props {
  mode?: "add" | "edit";
  initialData?: any;
}
const props = withDefaults(defineProps<Props>(), {
  mode: "add",
  initialData: null,
});

// Computed bantu biar if-else lebih rapi
const isEdit = computed(() => props.mode === "edit");

const supabase = useSupabaseClient();
const toast = useToast();
const isLoading = ref(false);

const state = reactive({
  name: "",
  category: "",
  size: "",
  price: 0,
  stock: 0,
});

// MAGIC-nya Vue: Pantau kalau slideover kebuka, langsung isi data (kalau mode edit)
watch(
  () => isOpen.value,
  (newVal) => {
    if (newVal) {
      if (isEdit.value && props.initialData) {
        state.name = props.initialData.nama_produk;
        state.category = props.initialData.category;
        state.size = props.initialData.size;
        state.price = props.initialData.raw_price;
        state.stock = props.initialData.stock;
      } else {
        // Kalau mode 'add', bersihin sisa isian sebelumnya
        state.name = "";
        state.category = "";
        state.size = "";
        state.price = 0;
        state.stock = 0;
      }
    }
  },
);

const submitForm = async () => {
  if (!state.name || !state.category || !state.size || state.price <= 0) {
    toast.add({
      title: "Gagal",
      description: "Pastikan semua field terisi dan harga valid!",
      color: "red",
    });
    return;
  }

  isLoading.value = true;

  try {
    if (isEdit.value) {
      // --- LOGIC UPDATE (EDIT) ---
      // 1. Update tabel products
      const { error: productError } = await supabase
        .from("products")
        .update({ name: state.name, category: state.category })
        .eq("id", props.initialData.product_id);
      if (productError) throw productError;

      // 2. Update tabel variants
      const { error: variantError } = await supabase
        .from("variants")
        .update({ size: state.size, price: state.price, stock: state.stock })
        .eq("id", props.initialData.id);
      if (variantError) throw variantError;

      toast.add({
        title: "Sukses",
        description: "Data barang berhasil diperbarui!",
        color: "green",
      });
    } else {
      // --- LOGIC INSERT (TAMBAH) ---
      const { data: productData, error: productError } = await supabase
        .from("products")
        .insert([{ name: state.name, category: state.category }])
        .select("id")
        .single();
      if (productError) throw productError;

      const { error: variantError } = await supabase.from("variants").insert([
        {
          product_id: productData.id,
          size: state.size,
          price: state.price,
          stock: state.stock,
        },
      ]);
      if (variantError) throw variantError;

      toast.add({
        title: "Sukses",
        description: "Barang baru berhasil ditambahkan!",
        color: "green",
      });
    }

    isOpen.value = false;
    emit("refresh");
  } catch (error: any) {
    console.error("Error proses data:", error.message);
    toast.add({
      title: "Error",
      description: "Gagal memproses data ke database.",
      color: "red",
    });
  } finally {
    isLoading.value = false;
  }
};
</script>
