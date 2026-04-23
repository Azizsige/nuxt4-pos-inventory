<template>
  <div
    class="h-screen w-full flex bg-light-surface dark:bg-dark-bg text-gray-900 dark:text-white transition-colors duration-300 overflow-hidden relative"
  >
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
      @click="isSidebarOpen = false"
    ></div>

    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-white dark:bg-dark-surface border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <div
        class="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800 shrink-0"
      >
        <div class="flex items-center">
          <UIcon
            name="i-heroicons-cube-transparent"
            class="w-6 h-6 text-primary mr-2"
          />
          <h1 class="text-xl font-extrabold tracking-tight">
            POS <span class="text-primary">Seragam</span>
          </h1>
        </div>
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-x-mark"
          class="lg:hidden"
          @click="isSidebarOpen = false"
        />
      </div>

      <nav class="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
        <NuxtLink
          v-for="item in filteredMenu"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          exact-active-class="bg-primary/10 text-primary dark:text-primary font-bold shadow-sm ring-1 ring-primary/20"
          @click="closeSidebarOnMobile"
        >
          <UIcon :name="item.icon" class="w-5 h-5" />
          {{ item.name }}
        </NuxtLink>
      </nav>

      <div class="p-4 border-t border-gray-200 dark:border-gray-800 shrink-0">
        <UButton
          block
          color="gray"
          variant="ghost"
          icon="i-heroicons-arrow-right-on-rectangle"
          :loading="isLoggingOut"
          @click="executeLogout"
          class="justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 font-bold"
        >
          Logout Sistem
        </UButton>
      </div>
    </aside>

    <div class="flex-1 flex flex-col min-w-0 overflow-hidden relative">
      <header
        class="h-16 bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-gray-800 flex items-center px-4 lg:px-6 justify-between shrink-0 z-30"
      >
        <div class="flex items-center gap-3">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-bars-3"
            class="lg:hidden"
            @click="isSidebarOpen = true"
          />
          <h2
            class="font-semibold text-lg text-gray-800 dark:text-gray-200 hidden sm:block"
          >
            Sistem Informasi
          </h2>
        </div>

        <div class="flex items-center gap-3">
          <div class="text-right hidden sm:block">
            <p class="text-sm font-bold">{{ user?.email || "User" }}</p>
            <p class="text-xs text-primary capitalize font-medium">
              Akses: {{ userRole }}
            </p>
          </div>
          <UAvatar
            icon="i-heroicons-user-solid"
            size="sm"
            class="bg-primary/20 text-primary ring-2 ring-primary/30"
          />
        </div>
      </header>

      <main
        class="flex-1 overflow-y-auto p-4 lg:p-6 bg-slate-50 dark:bg-dark-bg"
      >
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();
const toast = useToast();

const isSidebarOpen = ref(false);
const isLoggingOut = ref(false);

// 1. STATE ROLE (Default ambil dari token KTP)
const userRole = ref(user.value?.user_metadata?.role || "kasir");
console.log("userRole :", user.value);

// 2. TARIK PAKSA DATA DARI DATABASE (Abaikan Cache Nuxt)
const fetchRealRole = async () => {
  if (!user.value) return;

  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.value.sub) // ✅ UBAH JADI .sub SAMA KAYA DI AUTH.TS
    .single();

  if (data && !error) {
    userRole.value = data.role;
  }
};

// Jalankan fungsi narik paksa saat layar dimuat
onMounted(() => {
  fetchRealRole();
});

// 3. DAFTAR SEMUA MENU
const allMenus = [
  {
    name: "Katalog B2C",
    to: "/",
    icon: "i-heroicons-building-storefront",
    roles: ["admin", "kasir", "gudang"],
  },
  {
    name: "Kasir POS",
    to: "/kasir",
    icon: "i-heroicons-shopping-cart",
    roles: ["admin", "kasir"],
  },
  {
    name: "Gudang",
    to: "/gudang",
    icon: "i-heroicons-archive-box",
    roles: ["admin", "gudang"],
  },
  {
    name: "Dashboard Bos",
    to: "/admin",
    icon: "i-heroicons-chart-bar",
    roles: ["admin"],
  },
];

// 4. FILTER MENU OTOMATIS
const filteredMenu = computed(() => {
  return allMenus.filter((item) => item.roles.includes(userRole.value));
});

// 5. FUNGSI LOGOUT & SIDEBAR MOBILE
const closeSidebarOnMobile = () => {
  if (window.innerWidth < 1024) {
    isSidebarOpen.value = false;
  }
};

const executeLogout = async () => {
  isLoggingOut.value = true;
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    await router.push("/login");
    isSidebarOpen.value = false;
  } catch (error) {
    toast.add({
      title: "Gagal Logout",
      description: error.message,
      color: "red",
    });
  } finally {
    isLoggingOut.value = false;
  }
};
</script>
