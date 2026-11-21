<script setup>
import { watch, onBeforeUnmount } from 'vue';

// Modal genérico: não sabe nada de músicas. Quem usa decide título,
// conteúdo (slot) e botões (slot footer).
const open = defineModel('open', { type: Boolean, default: false });

defineProps({
  title: { type: String, default: '' }
});

function close() {
  open.value = false;
}

function handleKeydown(event) {
  if (event.key === 'Escape') {
    close();
  }
}

watch(open, (isOpen) => {
  if (isOpen) {
    document.addEventListener('keydown', handleKeydown);
  } else {
    document.removeEventListener('keydown', handleKeydown);
  }
}, { immediate: true });

onBeforeUnmount(() => document.removeEventListener('keydown', handleKeydown));
</script>

<template>
  <!-- Teleport: o modal é renderizado no <body>, fora do card/da grade. -->
  <Teleport to="body">
    <div v-if="open" class="modal-backdrop-custom" @click.self="close">
      <div class="modal-box card shadow" role="dialog" aria-modal="true">
        <div class="card-header d-flex align-items-center">
          <h2 class="h5 mb-0">{{ title }}</h2>
          <button
            type="button"
            class="btn-close ms-auto"
            aria-label="Fechar"
            @click="close"
          ></button>
        </div>

        <div class="card-body">
          <slot />
        </div>

        <div v-if="$slots.footer" class="card-footer d-flex justify-content-end gap-2">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
