<script setup>
import { ref } from 'vue';

import { reportSong } from '../services/reportService';
import { REPORT_REASONS } from '../config/constants';

import BaseModal from './base/BaseModal.vue';
import BaseButton from './base/BaseButton.vue';

const props = defineProps({
  songId: { type: Number, required: true }
});

const open = defineModel('open', { type: Boolean, default: false });
const emit = defineEmits(['reported']);

const FORM_ID = 'report-song-form';

const reason = ref('');
const reasonError = ref('');
const apiError = ref('');
const isSubmitting = ref(false);

async function handleSubmit() {
  apiError.value = '';
  reasonError.value = '';

  // Motivo obrigatório: avisa aqui, sem chamar a API.
  if (!reason.value) {
    reasonError.value = 'Escolha um motivo para continuar.';
    return;
  }

  if (isSubmitting.value) return;

  isSubmitting.value = true;

  try {
    await reportSong(props.songId, reason.value);
    emit('reported');
  } catch (error) {
    // Erro da API (inclusive o 409 "Você já denunciou...") fica DENTRO do modal.
    apiError.value = error.message;
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <BaseModal v-model:open="open" title="Denunciar música">
    <form :id="FORM_ID" novalidate @submit.prevent="handleSubmit">
      <!-- fieldset disabled: trava os cinco rádios durante o envio -->
      <fieldset :disabled="isSubmitting">
        <legend class="h6">Qual é o problema?</legend>

        <div v-for="item in REPORT_REASONS" :key="item.key" class="form-check mb-1">
          <input
            :id="`report-reason-${item.key}`"
            v-model="reason"
            type="radio"
            name="report-reason"
            class="form-check-input"
            :value="item.key"
          />
          <label :for="`report-reason-${item.key}`" class="form-check-label">{{ item.label }}</label>
        </div>

        <div v-if="reasonError" class="text-danger small mt-2">{{ reasonError }}</div>
      </fieldset>

      <div v-if="apiError" class="alert alert-danger mt-3 mb-0" role="alert">{{ apiError }}</div>
    </form>

    <template #footer>
      <button
        type="button"
        class="btn btn-outline-secondary"
        :disabled="isSubmitting"
        @click="open = false"
      >
        Cancelar
      </button>
      <BaseButton type="submit" :form="FORM_ID" :loading="isSubmitting" loading-text="Enviando...">
        Denunciar
      </BaseButton>
    </template>
  </BaseModal>
</template>
