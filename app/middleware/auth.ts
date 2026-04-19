export default defineNuxtRouteMiddleware(async (to, from) => {
  // INI DIA PENANGKAL RACUNNYA!
  // Suruh Server Nuxt diem, biar Browser aja yang jadi Satpamnya.
  if (import.meta.server) return;

  const user = useSupabaseUser();
  const supabase = useSupabaseClient();

  // 1. GUEST GUARD: Kalau udah login, haram hukumnya balik ke /login
  if (user.value && to.path === "/login") {
    return navigateTo("/", { replace: true });
  }

  // 2. AUTH GUARD: Kalau belum login, haram masuk ke halaman dalam
  if (!user.value && to.path !== "/login") {
    return navigateTo("/login", { replace: true });
  }

  // JURUS PENANGKAP ID
  const userId = user.value?.id || user.value?.sub;

  if (userId && to.path !== "/login") {
    const { data: userData, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", userId)
      .single();

    if (error || !userData) {
      if (to.path !== "/unauthorized")
        return navigateTo("/unauthorized", { replace: true });
      return;
    }

    const userRole = userData.role;

    // 3. ROLE GUARD: Cek izin kamar masing-masing
    if (to.path.startsWith("/admin") && userRole !== "admin") {
      return navigateTo("/unauthorized", { replace: true });
    }

    if (
      to.path.startsWith("/gudang") &&
      !["admin", "gudang"].includes(userRole as string)
    ) {
      return navigateTo("/unauthorized", { replace: true });
    }

    if (
      to.path.startsWith("/kasir") &&
      !["admin", "kasir"].includes(userRole as string)
    ) {
      return navigateTo("/unauthorized", { replace: true });
    }
  }
});
