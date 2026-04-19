<template>
  <div
    class="h-screen flex flex-col items-center justify-center text-center bg-slate-50 dark:bg-dark-bg p-6"
  >
    <div class="p-4 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
      <UIcon
        name="i-heroicons-shield-exclamation"
        class="w-16 h-16 text-red-500"
      />
    </div>
    <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
      Akses Ditolak
    </h1>
    <p class="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
      Maaf bro, role akun lu nggak punya izin buat liat halaman ini. Silakan
      balik ke dashboard utama.
    </p>
    <UButton to="/" size="lg" color="gray" variant="solid">
      Kembali ke Dashboard
    </UButton>
  </div>
</template>
