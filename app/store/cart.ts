import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [],
    isOpen: false,
  }),
  actions: {
    toggleCart() {
      this.isOpen = !this.isOpen;
    },
  },
});
