<script setup>
import { useToast } from '../composables/useToast';

const { toasts, dismiss } = useToast();

const ICONS = {
  success: 'bi-check-circle-fill',
  error: 'bi-exclamation-triangle-fill',
  info: 'bi-info-circle-fill'
};

const COLORS = {
  success: 'text-bg-success',
  error: 'text-bg-danger',
  info: 'text-bg-secondary'
};
</script>

<template>
  <!-- z-index acima do modal do Bootstrap (1055): o toast aparece na frente dele -->
  <div class="toast-stack" aria-live="polite" aria-atomic="true">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="toast show align-items-center border-0 mb-2"
      :class="COLORS[toast.type]"
      :role="toast.type === 'error' ? 'alert' : 'status'"
    >
      <div class="d-flex">
        <div class="toast-body">
          <i class="bi me-2" :class="ICONS[toast.type]"></i>{{ toast.message }}
        </div>
        <button
          type="button"
          class="btn-close btn-close-white me-2 m-auto"
          aria-label="Fechar"
          @click="dismiss(toast.id)"
        ></button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.toast-stack {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 2000;
  width: min(360px, calc(100vw - 2rem));
}
</style>
