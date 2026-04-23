<template>
  <div class="min-h-screen bg-gray-50 dark:bg-dark-bg font-sans">
    <header class="bg-white dark:bg-dark-surface shadow-sm sticky top-0 z-50">
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
      >
        <div class="flex items-center gap-2">
          <div class="bg-primary/10 p-2 rounded-lg">
            <UIcon
              name="i-heroicons-building-storefront"
              class="w-6 h-6 text-primary"
            />
          </div>
          <h1
            class="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight"
          >
            Toko Seragam <span class="text-primary">Hildamr</span>
          </h1>
        </div>
      </div>
    </header>

    <div
      class="relative bg-primary/5 py-12 md:py-20 overflow-hidden border-b border-primary/10"
    >
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
      >
        <UBadge color="primary" variant="subtle" class="mb-4"
          >Live Real-time Stock 🟢</UBadge
        >
        <h2
          class="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight"
        >
          Cek Stok Seragam<br class="hidden md:block" />
          Sebelum Datang ke Toko
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Hemat waktu Anda! Pastikan ukuran seragam yang dicari masih tersedia
          di toko kami. Etalase ini terhubung langsung dengan sistem kasir kami.
        </p>
      </div>
    </div>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div
        class="flex flex-col sm:flex-row gap-3 mb-10 max-w-3xl mx-auto bg-white dark:bg-dark-surface p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800"
      >
        <UInput
          v-model="searchQuery"
          icon="i-heroicons-magnifying-glass"
          placeholder="Cari nama seragam atau ukuran (misal: SD M)..."
          size="xl"
          class="flex-1"
          :ui="{ icon: { trailing: { pointer: '' } } }"
        >
          <template #trailing>
            <UButton
              v-show="searchQuery !== ''"
              color="gray"
              variant="link"
              icon="i-heroicons-x-mark-20-solid"
              :padded="false"
              @click="searchQuery = ''"
            />
          </template>
        </UInput>
        <USelect
          v-model="selectedCategory"
          :items="[
            'Semua Kategori',
            'SD',
            'SMP',
            'SMA',
            'Pramuka',
            'Aksesoris',
          ]"
          size="xl"
          class="w-full sm:w-56 shrink-0"
        />
      </div>

      <div
        v-if="pending"
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
      >
        <USkeleton v-for="i in 10" :key="i" class="h-64 w-full rounded-2xl" />
      </div>

      <div v-else-if="filteredProducts.length === 0" class="text-center py-20">
        <div
          class="bg-gray-100 dark:bg-gray-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <UIcon
            name="i-heroicons-archive-box-x-mark"
            class="w-12 h-12 text-gray-400"
          />
        </div>
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">
          Waduh, barangnya nggak ketemu!
        </h3>
        <p class="text-gray-500 mt-2">
          Coba cari dengan kata kunci lain atau pilih kategori Semua.
        </p>
      </div>

      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6"
      >
        <UCard
          v-for="variant in filteredProducts"
          :key="variant.id"
          :class="[
            'transition-all duration-300 rounded-2xl overflow-hidden flex flex-col border border-gray-100 dark:border-gray-800 bg-white dark:bg-dark-surface',
            variant.stock > 0
              ? 'group hover:-translate-y-1.5 hover:shadow-2xl cursor-pointer'
              : 'opacity-75 cursor-not-allowed grayscale-[30%]',
          ]"
          :ui="{ body: { padding: 'p-0 sm:p-0' } }"
          @click="orderViaWhatsApp(variant)"
        >
          <div
            class="aspect-square bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center justify-center relative overflow-hidden"
          >
            <img
              v-if="variant.products?.image_url"
              :src="variant.products.image_url"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
              alt="Foto Produk"
            />
            <UIcon
              v-else
              name="i-heroicons-photo"
              class="w-16 h-16 text-gray-300"
            />

            <div
              class="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent pointer-events-none"
            ></div>

            <div
              class="absolute top-3 right-3 flex flex-col items-end gap-1.5 z-10"
            >
              <UBadge
                v-if="variant.stock > 10"
                color="green"
                variant="solid"
                class="shadow-md font-bold px-2.5 py-1 text-xs"
              >
                Tersedia
              </UBadge>
              <UBadge
                v-else-if="variant.stock > 0"
                color="orange"
                variant="solid"
                class="shadow-md font-bold px-2.5 py-1 text-xs animate-pulse"
              >
                Sisa {{ variant.stock }}
              </UBadge>
              <UBadge
                v-else
                color="red"
                variant="solid"
                class="shadow-md font-extrabold px-3 py-1 text-xs ring-2 ring-white dark:ring-gray-900"
              >
                HABIS
              </UBadge>
            </div>

            <span
              class="absolute bottom-3 left-3 text-[11px] bg-white/90 dark:bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md font-bold uppercase text-gray-700 dark:text-gray-200 shadow-sm z-10"
            >
              {{ variant.products?.category || "Umum" }}
            </span>
          </div>

          <div class="p-5 flex flex-col flex-1 justify-between">
            <div>
              <h4
                class="font-extrabold text-gray-900 dark:text-white line-clamp-2 text-base leading-snug group-hover:text-primary transition-colors"
              >
                {{ variant.products?.name }}
              </h4>
              <div
                class="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <UIcon name="i-heroicons-tag" class="w-4 h-4 text-primary" />
                <span
                  class="text-sm font-bold text-gray-700 dark:text-gray-300"
                >
                  Size {{ variant.size }}
                </span>
              </div>
            </div>

            <div
              class="mt-5 pt-4 border-t border-dashed border-gray-200 dark:border-gray-700 flex items-end justify-between"
            >
              <div class="flex flex-col">
                <span class="text-xs text-gray-500 font-semibold mb-0.5"
                  >Harga</span
                >
                <span class="text-primary font-black text-xl tracking-tight">
                  Rp {{ variant.price.toLocaleString("id-ID") }}
                </span>
              </div>

              <div
                class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors text-primary"
              >
                <UIcon name="i-heroicons-shopping-bag" class="w-4 h-4" />
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </main>

    <footer
      class="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-dark-surface py-8 mt-10"
    >
      <div class="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
        &copy; {{ new Date().getFullYear() }} Toko Seragam Hildamr. Sistem
        Informasi POS & Katalog by GarisKode.
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// INGAT: Tidak ada middleware 'auth' dan layout 'dashboard' di sini!

const supabase = useSupabaseClient();
const searchQuery = ref("");
const selectedCategory = ref("Semua Kategori");

// --- FETCH DATA (Ambil semua stok, termasuk yang habis biar emak-emak tau) ---
const { data: rawProducts, pending } = await useAsyncData(
  "public-katalog",
  async () => {
    const { data, error } = await supabase
      .from("variants")
      .select(
        `
        id, size, price, stock,
        products ( name, category, image_url ) // <-- TAMBAHIN image_url DI SINI
      `,
      )
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

    // Pecah query jadi beberapa kata biar pencarian lebih pintar (contoh: "SD M")
    const searchTerms = searchQuery.value
      .toLowerCase()
      .split(" ")
      .filter((term) => term.length > 0);

    // Cek apakah semua kata kunci ada di nama produk atau size
    const matchSearch = searchTerms.every(
      (term) =>
        productName.includes(term) || v.size.toLowerCase().includes(term),
    );

    const matchCat =
      selectedCategory.value === "Semua Kategori" ||
      categoryName === selectedCategory.value;

    return matchSearch && matchCat;
  });
});

const config = useRuntimeConfig();

const orderViaWhatsApp = (variant: any) => {
  // ⛔ LOGIC GUARD: Kalau stok 0, jangan lakuin apa-apa!
  if (variant.stock <= 0) return;

  const waNumber = config.public.whatsappNumber;
  const productName = variant.products?.name;
  const size = variant.size;
  const price = variant.price.toLocaleString("id-ID");

  const text = `Halo Toko Seragam Hildamr, saya tertarik dengan produk ini:
  
*Produk:* ${productName}
*Ukuran:* ${size}
*Harga:* Rp ${price}

Apakah stoknya masih tersedia? Terima kasih.`;

  const encodedText = encodeURIComponent(text);
  window.open(`https://wa.me/${waNumber}?text=${encodedText}`, "_blank");
};

// Setting Title Meta untuk SEO
useHead({
  title: "Katalog Seragam - Toko Hildamr",
  meta: [
    {
      name: "description",
      content:
        "Cek stok dan harga seragam sekolah terlengkap secara real-time.",
    },
  ],
});
</script>
