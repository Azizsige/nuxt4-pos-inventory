<template>
  <div
    class="h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-dark-bg text-gray-900 dark:text-white transition-colors duration-300"
  >
    <UIcon
      name="i-heroicons-arrow-path"
      class="w-12 h-12 animate-spin text-primary mb-4"
    />
    <h2 class="text-xl font-semibold">Mengidentifikasi Akses...</h2>
    <p class="text-gray-500">Mengarahkan ke Dashboard lu bro...</p>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
});

const user = useSupabaseUser();
const supabase = useSupabaseClient();

console.log("user", user.value);

// Fix Bug: Mengeksekusi logic routing secara reaktif dan aman untuk SSR
if (user.value?.sub) {
  // Pakai useAsyncData biar data difetch saat SSR, mencegah kedipan halaman
  const { data: userData } = await useAsyncData("userRole", async () => {
    const { data } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.value.sub)
      .single();
    return data;
  });

  console.log("userData", userData.value);

  // Traffic Controller langsung melempar halaman tanpa delay browser
  if (userData.value) {
    const role = userData.value.role;
    if (role === "admin" || role === "gudang") {
      await navigateTo("/gudang");
    } else if (role === "kasir") {
      await navigateTo("/kasir");
    } else {
      await navigateTo("/unauthorized");
    }
  } else {
    await navigateTo("/unauthorized");
  }
} else {
  await navigateTo("/login");
}
</script>
