<script setup>
import BaseModal from './BaseModal.vue';

// Confirmação genérica de ações destrutivas. Quem usa decide quando ele existe
// (v-if no pai) e o que acontece em "confirm"; aqui só há o visual e os dois eventos.
defineProps({
  title: { type: String, required: true },
  message: { type: String, required: true },
  confirmLabel: { type: String, default: 'Confirmar' },
  confirmVariant: { type: String, default: 'danger' },
  busy: { type: Boolean, default: false }
});

const emit = defineEmits(['confirm', 'close']);
</script>

<template>
  <BaseModal :open="true" :title="title" @update:open="(isOpen) => !isOpen && emit('close')">
    <p class="mb-0" style="white-space: pre-line;">{{ message }}</p>

    <template #footer>
      <button type="button" class="btn btn-outline-secondary" :disabled="busy" @click="emit('close')">
        Cancelar
      </button>
      <button
        type="button"
        class="btn"
        :class="`btn-${confirmVariant}`"
        :disabled="busy"
        @click="emit('confirm')"
      >
        {{ busy ? 'Aguarde...' : confirmLabel }}
      </button>
    </template>
  </BaseModal>
</template>
