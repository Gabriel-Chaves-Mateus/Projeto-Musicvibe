<script setup>
import { reactive, ref, onBeforeUnmount } from 'vue';

import { createSong } from '../services/songService';
import { LIMITS } from '../config/constants';

import FormCard from '../components/base/FormCard.vue';
import BaseInput from '../components/base/BaseInput.vue';
import BaseButton from '../components/base/BaseButton.vue';

const form = reactive({
  title: '',
  description: ''
});

const errors = reactive({
  title: '',
  description: '',
  audio: '',
  cover: ''
});

const audioFile = ref(null);
const coverFile = ref(null);
const coverPreview = ref(null);

const fileInputKey = ref(0);

const isSubmitting = ref(false);
const progress = ref(0);
const successMessage = ref('');
const apiErrorMessage = ref('');

function clearPreview() {
  if (coverPreview.value) {
    URL.revokeObjectURL(coverPreview.value);
    coverPreview.value = null;
  }
}

onBeforeUnmount(clearPreview);

function handleAudioChange(event) {
  audioFile.value = event.target.files[0] || null;
  errors.audio = '';
}

function handleCoverChange(event) {
  const file = event.target.files[0] || null;

  coverFile.value = file;
  errors.cover = '';
  clearPreview();

  // Prévia local: não faz nenhuma chamada de rede.
  if (file && LIMITS.COVER_TYPES.includes(file.type)) {
    coverPreview.value = URL.createObjectURL(file);
  }
}

function validate() {
  Object.keys(errors).forEach((key) => (errors[key] = ''));

  if (!form.title.trim()) {
    errors.title = 'O título é obrigatório.';
  } else if (form.title.trim().length > LIMITS.TITLE_MAX) {
    errors.title = `O título deve ter no máximo ${LIMITS.TITLE_MAX} caracteres.`;
  }

  if (form.description.length > LIMITS.DESCRIPTION_MAX) {
    errors.description =
      `A descrição deve ter no máximo ${LIMITS.DESCRIPTION_MAX} caracteres.`;
  }

  if (!audioFile.value) {
    errors.audio = 'Selecione o arquivo de áudio.';
  } else if (!LIMITS.AUDIO_TYPES.includes(audioFile.value.type)) {
    errors.audio = 'Formato de áudio inválido. Use MP3, WAV ou OGG.';
  } else if (audioFile.value.size > LIMITS.AUDIO_MAX_MB * 1024 * 1024) {
    errors.audio = `O áudio deve ter no máximo ${LIMITS.AUDIO_MAX_MB} MB.`;
  }

  if (!coverFile.value) {
    errors.cover = 'Selecione a imagem de capa.';
  } else if (!LIMITS.COVER_TYPES.includes(coverFile.value.type)) {
    errors.cover = 'Formato de capa inválido. Use JPG, PNG ou WEBP.';
  }

  return Object.values(errors).every((message) => message === '');
}

// onUploadProgress recebe um evento com "loaded" (bytes já enviados)
// e "total" (bytes totais). A porcentagem é loaded / total * 100.
function handleProgress(event) {
  if (event.total) {
    progress.value = Math.round((event.loaded * 100) / event.total);
  }
}

function resetForm() {
  form.title = '';
  form.description = '';
  audioFile.value = null;
  coverFile.value = null;
  clearPreview();
  // troca a key para limpar os <input type="file"> (não aceitam v-model)
  fileInputKey.value++;
}

async function handleSubmit() {
  successMessage.value = '';
  apiErrorMessage.value = '';

  if (!validate()) {
    return;
  }

  const formData = new FormData();
  formData.append('title', form.title.trim());
  formData.append('description', form.description.trim());
  formData.append('audio', audioFile.value);
  formData.append('cover', coverFile.value);

  progress.value = 0;
  isSubmitting.value = true;

  try {
    await createSong(formData, handleProgress);

    successMessage.value = 'Música enviada com sucesso!';
    resetForm();
  } catch (error) {
    apiErrorMessage.value = error.message;
    progress.value = 0;
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <FormCard title="Enviar Música" icon="bi-cloud-upload" wide>
    <form @submit.prevent="handleSubmit" novalidate>
      <BaseInput
        id="title"
        v-model="form.title"
        label="Título"
        :maxlength="LIMITS.TITLE_MAX"
        :error="errors.title"
      />

      <BaseInput
        id="description"
        v-model="form.description"
        type="textarea"
        label="Descrição (opcional)"
        rows="3"
        :error="errors.description"
        :hint="`${form.description.length}/${LIMITS.DESCRIPTION_MAX}`"
      />

      <BaseInput
        id="audio"
        :key="`audio-${fileInputKey}`"
        type="file"
        label="Arquivo de áudio"
        accept="audio/mpeg,audio/wav,audio/ogg"
        :error="errors.audio"
        :hint="`MP3, WAV ou OGG, até ${LIMITS.AUDIO_MAX_MB} MB`"
        @change="handleAudioChange"
      />

      <BaseInput
        id="cover"
        :key="`cover-${fileInputKey}`"
        type="file"
        label="Capa"
        accept="image/png,image/jpeg,image/webp"
        :error="errors.cover"
        hint="JPG, PNG ou WEBP"
        @change="handleCoverChange"
      />

      <div v-if="coverPreview" class="text-center mb-3">
        <img
          :src="coverPreview"
          alt="Prévia da capa"
          class="thumbnail-preview"
        />
      </div>

      <div v-if="isSubmitting || progress > 0" class="mb-3">
        <div class="progress">
          <div
            class="progress-bar"
            role="progressbar"
            :style="{ width: progress + '%' }"
            :aria-valuenow="progress"
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {{ progress }}%
          </div>
        </div>
      </div>

      <div v-if="successMessage" class="alert alert-success">
        {{ successMessage }}
        <router-link to="/my-songs" class="alert-link ms-1">Ver em Meus Itens</router-link>
      </div>

      <div v-if="apiErrorMessage" class="alert alert-danger">
        {{ apiErrorMessage }}
      </div>

      <BaseButton
        type="submit"
        block
        :loading="isSubmitting"
        loading-text="Enviando..."
      >
        <i class="bi bi-cloud-upload me-1"></i>Enviar música
      </BaseButton>
    </form>
  </FormCard>
</template>
