export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useSupabaseUser();
  const supabase = useSupabaseClient(); // Panggil mesin database

  if (!user.value && to.path !== "/login") {
    return navigateTo("/login");
  }

  if (user.value) {
    // 💡 MAGIC NYA DI SINI: Kita tarik role langsung dari tabel yang lu edit!
    const { data } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.value.sub)
      .single();

    console.log("Role user:", data.role); // Cek role yang didapat
    console.log("Role user:", user.value); // Cek role yang didapat
    const role = data?.role || "kasir";
    console.log("RoleN user:", role);

    // Kalau maksa buka halaman login padahal udah login
    if (to.path === "/login") {
      if (role === "admin") return navigateTo("/admin");
      if (role === "gudang") return navigateTo("/gudang");
      return navigateTo("/kasir");
    }

    // ATURAN HAK AKSES
    if (to.path.startsWith("/admin") && role !== "admin") {
      return navigateTo("/kasir");
    }
    if (to.path.startsWith("/gudang") && role === "kasir") {
      return navigateTo("/kasir");
    }
    if (to.path.startsWith("/kasir") && role === "gudang") {
      return navigateTo("/gudang");
    }
  }
});
