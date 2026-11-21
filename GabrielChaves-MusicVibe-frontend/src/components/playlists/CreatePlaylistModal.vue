<script setup>
import { reactive, ref } from 'vue';

import { createPlaylist } from '../../services/playlistService';
import { LIMITS } from '../../config/constants';

import BaseModal from '../base/BaseModal.vue';
import BaseInput from '../base/BaseInput.vue';
import BaseButton from '../base/BaseButton.vue';

const open = defineModel('open', { type: Boolean, default: false });
const emit = defineEmits(['created']);

const FORM_ID = 'create-playlist-form';

const form = reactive({ title: '', description: '', isPublic: false });
const errors = reactive({ title: '', description: '' });
const isSubmitting = ref(false);
// Erro vindo da API: aparece AQUI dentro, não em toast (o service é silent).
const apiError = ref('');

function validate() {
  errors.title = '';
  errors.description = '';

  // valida o texto SEM os espaços das pontas (como a API faz)
  const title = form.title.trim();

  if (title.length < LIMITS.PLAYLIST_TITLE_MIN || title.length > LIMITS.PLAYLIST_TITLE_MAX) {
    errors.title = `O título deve ter entre ${LIMITS.PLAYLIST_TITLE_MIN} e ${LIMITS.PLAYLIST_TITLE_MAX} caracteres.`;
  }

  if (form.description.trim().length > LIMITS.PLAYLIST_DESCRIPTION_MAX) {
    errors.description = `A descrição deve ter no máximo ${LIMITS.PLAYLIST_DESCRIPTION_MAX} caracteres.`;
  }

  return !errors.title && !errors.description;
}

async function handleSubmit() {
  apiError.value = '';

  if (!validate() || isSubmitting.value) {
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await createPlaylist({
      title: form.title.trim(),
      description: form.description.trim(),
      isPublic: form.isPublic
    });

    emit('created', response.data);
    open.value = false;
  } catch (error) {
    apiError.value = error.message;
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <BaseModal v-model:open="open" title="Nova playlist">
    <!-- novalidate: a validação é a nossa (mensagem em português, no campo) -->
    <form :id="FORM_ID" novalidate @submit.prevent="handleSubmit">
      <BaseInput
        id="playlist-title"
        v-model="form.title"
        label="Título"
        :error="errors.title"
        :maxlength="LIMITS.PLAYLIST_TITLE_MAX + 20"
        autocomplete="off"
      />

      <BaseInput
        id="playlist-description"
        v-model="form.description"
        type="textarea"
        label="Descrição (opcional)"
        rows="3"
        :error="errors.description"
        :hint="`${form.description.length}/${LIMITS.PLAYLIST_DESCRIPTION_MAX}`"
      />

      <div class="form-check mb-1">
        <input id="playlist-public" v-model="form.isPublic" type="checkbox" class="form-check-input" />
        <label for="playlist-public" class="form-check-label">
          Pública (qualquer pessoa com o link pode ver)
        </label>
      </div>
      <div class="form-text">Sem marcar, a playlist fica privada: só você vê.</div>

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
      <!-- o botão fica FORA do <form> (no rodapé): o atributo form liga os dois -->
      <BaseButton type="submit" :form="FORM_ID" :loading="isSubmitting" loading-text="Criando...">
        Criar
      </BaseButton>
    </template>
  </BaseModal>
</template>
