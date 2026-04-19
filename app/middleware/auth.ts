export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useSupabaseUser();
  const supabase = useSupabaseClient();

  // 1. Jika belum login, paksa ke /login
  if (!user.value && to.path !== "/login") {
    return navigateTo("/login");
  }

  // Jika sudah login tapi mau ke /login lagi, balikkan ke home
  if (user.value && to.path === "/login") {
    return navigateTo("/");
  }

  // 2. Cek Role dari tabel public.users
  if (user.value) {
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.value.id)
      .single();

    const userRole = userData?.role;

    // 3. Proteksi Path berdasarkan Role
    if (to.path.startsWith("/admin") && userRole !== "admin") {
      return navigateTo("/unauthorized");
    }

    if (
      to.path.startsWith("/gudang") &&
      !["admin", "gudang"].includes(userRole as string)
    ) {
      return navigateTo("/unauthorized");
    }

    if (
      to.path.startsWith("/kasir") &&
      !["admin", "kasir"].includes(userRole as string)
    ) {
      return navigateTo("/unauthorized");
    }
  }
});
