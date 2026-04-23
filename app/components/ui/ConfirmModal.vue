<template>
  <UModal v-model:open="isOpen" :title="title" :description="description">
    <template #footer>
      <div class="flex justify-end gap-3 w-full">
        <UButton
          color="gray"
          variant="ghost"
          class="cursor-pointer"
          :disabled="isLoading"
          @click="handleCancel"
        >
          {{ cancelText }}
        </UButton>
        <UButton
          :color="confirmColor"
          class="cursor-pointer"
          :loading="isLoading"
          @click="handleConfirm"
        >
          {{ confirmText }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
// Ngatur buka-tutup modal
const isOpen = defineModel<boolean>("open", { default: false });

// Props biar modal ini dinamis bisa dipakai di mana aja
interface Props {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: any; // Nuxt UI color type
  isLoading?: boolean;
}

withDefaults(defineProps<Props>(), {
  title: "Konfirmasi",
  description: "Apakah Anda yakin ingin melanjutkan aksi ini?",
  confirmText: "Ya, Lanjutkan",
  cancelText: "Batal",
  confirmColor: "red",
  isLoading: false,
});

const emit = defineEmits(["confirm", "cancel"]);

const handleConfirm = () => {
  emit("confirm");
};

const handleCancel = () => {
  isOpen.value = false;
  emit("cancel");
};
</script>
