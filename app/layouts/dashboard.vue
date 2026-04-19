<template>
  <div
    class="h-screen w-full flex bg-light-surface dark:bg-dark-bg text-gray-900 dark:text-white transition-colors duration-300"
  >
    <aside
      class="w-64 flex flex-col bg-white dark:bg-dark-surface border-r border-gray-200 dark:border-gray-800"
    >
      <div
        class="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800"
      >
        <UIcon
          name="i-heroicons-cube-transparent"
          class="w-6 h-6 text-primary mr-2"
        />
        <h1 class="text-xl font-extrabold tracking-tight">
          POS <span class="text-primary">Seragam</span>
        </h1>
      </div>

      <nav class="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
        <NuxtLink
          v-for="item in menu"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          active-class="!bg-primary/10 !text-primary dark:!text-primary"
        >
          <UIcon :name="item.icon" class="w-5 h-5" />
          {{ item.name }}
        </NuxtLink>
      </nav>

      <div class="p-4 border-t border-gray-200 dark:border-gray-800">
        <UButton
          block
          color="gray"
          variant="ghost"
          icon="i-heroicons-arrow-right-on-rectangle"
          @click="handleLogout"
          class="justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
        >
          Logout Sistem
        </UButton>
      </div>
    </aside>

    <div class="flex-1 flex flex-col overflow-hidden">
      <header
        class="h-16 bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-gray-800 flex items-center px-6 justify-between"
      >
        <h2 class="font-semibold text-lg text-gray-800 dark:text-gray-200">
          Modul Gudang
        </h2>

        <div class="flex items-center gap-3">
          <div class="text-right hidden sm:block">
            <p class="text-sm font-medium">{{ user?.email || "User" }}</p>
            <p class="text-xs text-primary capitalize">Akses: Gudang</p>
          </div>
          <UAvatar
            icon="i-heroicons-user-circle"
            size="sm"
            class="bg-primary/20 text-primary"
          />
        </div>
      </header>

      <main class="flex-1 overflow-y-auto p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();
const user = useSupabaseUser();

// Daftar Menu Sidebar
// Daftar Menu Sidebar (Update sementara biar Vue Router nggak panik)
const menu = [
  { name: "Dashboard", to: "/gudang", icon: "i-heroicons-home" },
  {
    name: "Master Produk",
    to: "#", // <- Ubah ke # dulu sebelum halamannya kita bikin
    icon: "i-heroicons-archive-box",
  },
  {
    name: "Stok Masuk",
    to: "#", // <- Ubah ke # dulu sebelum halamannya kita bikin
    icon: "i-heroicons-arrow-down-tray",
  },
];

// Logic Logout
const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (!error) {
    navigateTo("/login");
  }
};
</script>
