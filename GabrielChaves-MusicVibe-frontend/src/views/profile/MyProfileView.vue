<script setup>
import { LIMITS } from '../../config/constants';
import {
  ref,
  reactive,
  onMounted
} from 'vue';

import {
  getMyProfile,
  updateProfile
} from '../../services/authService';

import {
  getProfileImageUrl
} from '../../utils/media';

import FormCard from '../../components/base/FormCard.vue';
import BaseInput from '../../components/base/BaseInput.vue';
import BaseButton from '../../components/base/BaseButton.vue';

const form = reactive({
  fullName: '',
  bio: ''
});

const currentPicture = ref(
  'default-profile.png'
);

const selectedFile = ref(null);
const previewUrl = ref(null);

const loading = ref(true);
const saving = ref(false);

const successMessage = ref('');
const errorMessage = ref('');

onMounted(async () => {
  try {
    const response = await getMyProfile();

    form.fullName =
      response.data.fullName || '';

    form.bio =
      response.data.bio || '';

    currentPicture.value =
      response.data.profilePicture ||
      'default-profile.png';

  } catch (error) {
    errorMessage.value =
      error.message;
  } finally {
    loading.value = false;
  }
});

function handleFileChange(event) {
  const file = event.target.files[0];

  if (!file) {
    return;
  }

  selectedFile.value = file;

  if (previewUrl.value) {
    URL.revokeObjectURL(
      previewUrl.value
    );
  }

  previewUrl.value =
    URL.createObjectURL(file);
}

async function handleSubmit() {
  successMessage.value = '';
  errorMessage.value = '';

  if (!form.fullName.trim()) {
    errorMessage.value =
      'O nome completo é obrigatório.';
    return;
  }

  if (form.bio.length > LIMITS.BIO_MAX) {
    errorMessage.value =
      `A bio deve ter no máximo ${LIMITS.BIO_MAX} caracteres.`;
    return;
  }

  const formData = new FormData();

  formData.append(
    'fullName',
    form.fullName.trim()
  );

  formData.append(
    'bio',
    form.bio
  );

  if (selectedFile.value) {
    formData.append(
      'profilePicture',
      selectedFile.value
    );
  }

  saving.value = true;

  try {
    const response =
      await updateProfile(formData);

    currentPicture.value =
      response.data.profilePicture;

    selectedFile.value = null;

    if (previewUrl.value) {
      URL.revokeObjectURL(
        previewUrl.value
      );

      previewUrl.value = null;
    }

    successMessage.value =
      'Perfil atualizado com sucesso.';

  } catch (error) {
    errorMessage.value =
      error.message;
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <FormCard title="Meu Perfil" icon="bi-person-circle" wide>
    <p v-if="loading" class="text-center mb-0">
      Carregando perfil...
    </p>

    <form v-else @submit.prevent="handleSubmit">
      <div class="text-center mb-4">
        <img
          :src="previewUrl || getProfileImageUrl(currentPicture)"
          alt="Foto de perfil"
          class="rounded-circle"
          width="150"
          height="150"
          style="object-fit: cover;"
        />
      </div>

      <BaseInput
        id="profilePicture"
        type="file"
        label="Foto de perfil"
        accept="image/png,image/jpeg,image/webp"
        @change="handleFileChange"
      />

      <BaseInput
        id="fullName"
        v-model="form.fullName"
        label="Nome completo"
        required
      />

      <BaseInput
        id="bio"
        v-model="form.bio"
        type="textarea"
        label="Bio"
        rows="4"
        :maxlength="LIMITS.BIO_MAX"
        :hint="`${form.bio.length}/${LIMITS.BIO_MAX}`"
      />

      <div v-if="successMessage" class="alert alert-success">
        {{ successMessage }}
      </div>

      <div v-if="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>

      <BaseButton
        type="submit"
        :loading="saving"
        loading-text="Salvando..."
      >
        Salvar alterações
      </BaseButton>
    </form>
  </FormCard>
</template>
