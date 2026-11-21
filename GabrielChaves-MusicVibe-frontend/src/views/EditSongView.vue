<script setup>
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';

import { getSongForEdit, updateSong } from '../services/songService';
import { LIMITS } from '../config/constants';
import { getSongCoverUrl } from '../utils/media';

import FormCard from '../components/base/FormCard.vue';
import BaseInput from '../components/base/BaseInput.vue';
import BaseButton from '../components/base/BaseButton.vue';

const route = useRoute();

const form = reactive({ title: '', description: '' });
const errors = reactive({ title: '', description: '', cover: '' });

const currentCover = ref('');
const coverFile = ref(null);
const coverPreview = ref(null);
const fileInputKey = ref(0);

const loading = ref(true);
const saving = ref(false);
const loadError = ref('');
const apiErrorMessage = ref('');
const successMessage = ref('');

function clearPreview() {
  if (coverPreview.value) {
    URL.revokeObjectURL(coverPreview.value);
    coverPreview.value = null;
  }
}

onBeforeUnmount(clearPreview);

onMounted(async () => {
  try {
    const response = await getSongForEdit(route.params.id);

    form.title = response.data.title;
    form.description = response.data.description || '';
    currentCover.value = response.data.cover;
  } catch (error) {
    // 403 (não é seu) e 404 (não existe) chegam aqui com a mensagem da API
    loadError.value = error.message;
  } finally {
    loading.value = false;
  }
});

function handleCoverChange(event) {
  const file = event.target.files[0] || null;

  coverFile.value = file;
  errors.cover = '';
  clearPreview();

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
    errors.description = `A descrição deve ter no máximo ${LIMITS.DESCRIPTION_MAX} caracteres.`;
  }

  if (coverFile.value && !LIMITS.COVER_TYPES.includes(coverFile.value.type)) {
    errors.cover = 'Formato de capa inválido. Use JPG, PNG ou WEBP.';
  }

  return Object.values(errors).every((message) => message === '');
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

  // A capa só vai na requisição se a pessoa escolheu uma nova
  if (coverFile.value) {
    formData.append('cover', coverFile.value);
  }

  saving.value = true;

  try {
    const response = await updateSong(route.params.id, formData);

    currentCover.value = response.data.cover;
    coverFile.value = null;
    clearPreview();
    fileInputKey.value++;

    successMessage.value = 'Música atualizada com sucesso!';
  } catch (error) {
    apiErrorMessage.value = error.message;
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <FormCard title="Editar Música" icon="bi-pencil-square" wide>
    <p v-if="loading" class="text-center mb-0">Carregando...</p>

    <div v-else-if="loadError" class="alert alert-danger mb-0">
      {{ loadError }}
      <router-link to="/my-songs" class="alert-link ms-2">Voltar a Meus Itens</router-link>
    </div>

    <form v-else @submit.prevent="handleSubmit" novalidate>
      <div class="text-center mb-3">
        <img
          :src="coverPreview || getSongCoverUrl(currentCover)"
          alt="Capa"
          class="thumbnail-preview"
        />
      </div>

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
        id="cover"
        :key="`cover-${fileInputKey}`"
        type="file"
        label="Trocar capa (opcional)"
        accept="image/png,image/jpeg,image/webp"
        :error="errors.cover"
        hint="O áudio não pode ser trocado: exclua a música e envie de novo."
        @change="handleCoverChange"
      />

      <div v-if="successMessage" class="alert alert-success">
        {{ successMessage }}
        <router-link to="/my-songs" class="alert-link ms-1">Ir para Meus Itens</router-link>
      </div>

      <div v-if="apiErrorMessage" class="alert alert-danger">
        {{ apiErrorMessage }}
      </div>

      <BaseButton
        type="submit"
        block
        :loading="saving"
        loading-text="Salvando..."
      >
        Salvar alterações
      </BaseButton>
    </form>
  </FormCard>
</template>
