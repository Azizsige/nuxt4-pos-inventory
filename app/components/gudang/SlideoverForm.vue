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
        <UFormField
          label="Foto Produk"
          name="image"
          help="Format: JPG/PNG. Maks 2MB."
        >
          <div
            v-if="imagePreviewUrl"
            class="relative w-full h-48 rounded-xl overflow-hidden border-2 border-dashed border-primary/50 group bg-gray-50 dark:bg-gray-900 flex justify-center items-center"
          >
            <img
              :src="imagePreviewUrl"
              class="w-full h-full object-contain"
              alt="Preview"
            />
            <div
              class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2"
            >
              <UButton
                color="white"
                variant="solid"
                size="sm"
                icon="i-heroicons-arrow-path"
                class="cursor-pointer"
                @click="() => fileInput?.click()"
              >
                Ganti Foto
              </UButton>
              <UButton
                color="red"
                variant="soft"
                size="xs"
                icon="i-heroicons-trash"
                class="cursor-pointer"
                @click="removeImage"
              >
                Hapus
              </UButton>
            </div>
          </div>

          <div
            v-else
            class="w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            @click="() => fileInput?.click()"
          >
            <UIcon
              name="i-heroicons-photo"
              class="w-10 h-10 text-gray-400 mb-2"
            />
            <span class="text-sm font-medium text-primary"
              >Klik untuk memilih foto</span
            >
            <span class="text-xs text-gray-500 mt-1"
              >SVG, PNG, JPG (Maks. 2MB)</span
            >
          </div>

          <input
            type="file"
            ref="fileInput"
            accept="image/png, image/jpeg, image/jpg"
            class="hidden"
            @change="handleFileChange"
          />
        </UFormField>
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
        >
          Batal
        </UButton>

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

interface Props {
  mode?: "add" | "edit";
  initialData?: any;
}
const props = withDefaults(defineProps<Props>(), {
  mode: "add",
  initialData: null,
});

const isEdit = computed(() => props.mode === "edit");

const supabase = useSupabaseClient();
const toast = useToast();
const isLoading = ref(false);

// Ref buat ngambil elemen input file
const fileInput = ref<HTMLInputElement | null>(null);
const imagePreviewUrl = ref<string | null>(null); // State buat preview lokal

const state = reactive({
  name: "",
  category: "",
  size: "",
  price: 0,
  stock: 0,
  image_url: "",
});

// FUNGSI HANDLE PREVIEW LOKAL
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];

    // Validasi ukuran maks 2MB
    if (file.size > 2 * 1024 * 1024) {
      toast.add({
        title: "File Terlalu Besar",
        description: "Ukuran foto maksimal adalah 2MB.",
        color: "red",
      });
      target.value = ""; // Reset input
      return;
    }

    // Bikin URL lokal sementara untuk preview
    imagePreviewUrl.value = URL.createObjectURL(file);
  }
};

// Fungsi menghapus gambar dari preview
const removeImage = () => {
  imagePreviewUrl.value = null;
  state.image_url = ""; // Kosongkan state URL
  if (fileInput.value) fileInput.value.value = ""; // Reset input HTML
};

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
        state.image_url = props.initialData.image_url || "";
        imagePreviewUrl.value = props.initialData.image_url || null; // Set preview dengan URL Supabase
      } else {
        state.name = "";
        state.category = "";
        state.size = "";
        state.price = 0;
        state.stock = 0;
        state.image_url = "";
        imagePreviewUrl.value = null;
        if (fileInput.value) fileInput.value.value = "";
      }
    }
  },
);

// --- FUNGSI UPLOAD KE SUPABASE STORAGE ---
const uploadImage = async (file: File) => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from("products") // Pastikan lu udah bikin bucket "products"
    .upload(fileName, file);

  if (error) {
    console.error("Upload error:", error);
    throw new Error("Gagal upload gambar");
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("products").getPublicUrl(fileName);
  return publicUrl;
};

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
    // 1. Cek ada file baru yang mau diupload nggak?
    if (fileInput.value && fileInput.value.files && fileInput.value.files[0]) {
      state.image_url = await uploadImage(fileInput.value.files[0]);
    }

    if (isEdit.value) {
      // --- LOGIC UPDATE (EDIT) ---
      const updatePayload: any = { name: state.name, category: state.category };

      // Update image_url juga kalau ada foto baru atau fotonya dihapus
      // Kalau user klik tombol "Hapus", state.image_url bakal jadi string kosong
      if (state.image_url !== "") {
        updatePayload.image_url = state.image_url;
      } else if (imagePreviewUrl.value === null) {
        // Artinya gambar sengaja dihapus
        updatePayload.image_url = null;
      }

      const { error: productError } = await supabase
        .from("products")
        .update(updatePayload)
        .eq("id", props.initialData.product_id);
      if (productError) throw productError;

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
        .insert([
          {
            name: state.name,
            category: state.category,
            image_url: state.image_url || null, // Masukin URL foto
          },
        ])
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
      description: error.message || "Gagal memproses data ke database.",
      color: "red",
    });
  } finally {
    isLoading.value = false;
  }
};
</script>
