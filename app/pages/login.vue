<template>
  <div
    class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg transition-colors duration-300 px-4"
  >
    <UCard
      class="w-full max-w-sm shadow-xl border-none bg-white dark:bg-dark-surface"
    >
      <template #header>
        <div class="text-center">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
            Login POS
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Sistem Inventori Seragam
          </p>
        </div>
      </template>

      <div v-if="isSuccess" class="text-center py-6">
        <UIcon
          name="i-heroicons-check-badge"
          class="w-20 h-20 text-primary mx-auto mb-4 animate-bounce"
        />
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">
          Akses Diterima!
        </h3>
        <p class="text-sm text-gray-500 mt-2 mb-6">Menyinkronkan sesi lu...</p>

        <UButton loading block color="primary" size="lg" class="font-bold">
          Mengalihkan...
        </UButton>
      </div>

      <UForm v-else :state="state" @submit="handleLogin" class="space-y-6">
        <UFormField label="Email" name="email">
          <UInput
            v-model="state.email"
            type="email"
            placeholder="admin@mail.com"
            icon="i-heroicons-envelope"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Password" name="password">
          <UInput
            v-model="state.password"
            type="password"
            icon="i-heroicons-lock-closed"
            class="w-full"
          />
        </UFormField>

        <UButton
          type="submit"
          block
          color="primary"
          :loading="loading"
          class="font-bold py-2.5 cursor-pointer"
        >
          Masuk Sekarang
        </UButton>
      </UForm>
    </UCard>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false,
  // Pastikan middleware auth dipanggil kalau lu belum ubah auth.ts jadi auth.global.ts
  middleware: "auth",
});

const supabase = useSupabaseClient();
const user = useSupabaseUser();

// 👇 CCTV PENJAGA TAMU (GUEST GUARD) 👇
// Ini bakal jalan di browser. Kalau lu iseng buka /login padahal udah punya tiket,
// dia bakal langsung nendang lu balik ke dashboard tanpa ampun!
watchEffect(() => {
  if (user.value) {
    navigateTo("/", { replace: true });
  }
});

const loading = ref(false);
const isSuccess = ref(false);

const state = reactive({
  email: "",
  password: "",
});

const handleLogin = async () => {
  if (!state.email || !state.password) return;

  loading.value = true;

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: state.email,
      password: state.password,
    });

    if (error) throw error;

    loading.value = false;
    isSuccess.value = true;

    // Tunggu sebentar buat kasih lihat UI Sukses, lalu tembak!
    setTimeout(async () => {
      await navigateTo("/gudang", { replace: true });
    }, 1000);
  } catch (err) {
    alert("Gagal Login: " + err.message);
    loading.value = false;
    isSuccess.value = false;
  }
};
</script>
