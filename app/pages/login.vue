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

      <form @submit.prevent="handleLogin" class="space-y-6">
        <UFormField label="Email" name="email">
          <UInput
            v-model="email"
            type="email"
            placeholder="admin@mail.com"
            icon="i-heroicons-envelope"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Password" name="password">
          <UInput
            v-model="password"
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
          class="font-bold py-2.5"
        >
          Masuk Sekarang
        </UButton>
      </form>
    </UCard>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false, // Login biasanya tidak pakai sidebar
});

const email = ref("");
const password = ref("");
const loading = ref(false);
const supabase = useSupabaseClient();

const handleLogin = async () => {
  if (!email.value || !password.value) return;

  loading.value = true;
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  if (error) {
    alert("Gagal Login: " + error.message);
  } else {
    navigateTo("/");
  }
  loading.value = false;
};
</script>
