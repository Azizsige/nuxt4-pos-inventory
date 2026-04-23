import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  // Mengaktifkan struktur dan fitur Nuxt 4
  future: {
    compatibilityVersion: 4,
  },

  // Memastikan kompatibilitas versi terbaru
  compatibilityDate: "2024-04-03",

  // Mendaftarkan root CSS
  css: ["~/assets/css/app.css"],

  // Mendaftarkan module Nuxt
  modules: ["@nuxt/ui", "@pinia/nuxt", "@nuxtjs/supabase", "@vueuse/nuxt"],

  supabase: {
    redirect: false, // Mematikan paksaan redirect ke /login
  },

  // Konfigurasi Vite untuk Tailwind v4
  vite: {
    plugins: [tailwindcss()],
  },

  runtimeConfig: {
    public: {
      whatsappNumber: "6281234567890", // Ganti pake nomor klien lu nanti
    },
  },

  // Konfigurasi devtools (opsional tapi disarankan)
  devtools: { enabled: true },
});
