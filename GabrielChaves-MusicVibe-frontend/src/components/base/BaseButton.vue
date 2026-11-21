<script setup>
defineProps({
  type: { type: String, default: 'button' },
  loading: { type: Boolean, default: false },
  loadingText: { type: String, default: 'Aguarde...' },
  block: { type: Boolean, default: false },
  // 'brand' = cor de marca; 'outline' = contorno; 'danger' = ação destrutiva
  variant: { type: String, default: 'brand' }
});
</script>

<template>
  <button
    :type="type"
    class="btn"
    :class="[
      {
        'btn-musicvibe': variant === 'brand',
        'btn-outline-secondary': variant === 'outline',
        'btn-danger': variant === 'danger'
      },
      { 'w-100': block }
    ]"
    :disabled="loading"
  >
    <span
      v-if="loading"
      class="spinner-border spinner-border-sm me-2"
      aria-hidden="true"
    ></span>
    <slot v-if="!loading" />
    <template v-else>{{ loadingText }}</template>
  </button>
</template>
