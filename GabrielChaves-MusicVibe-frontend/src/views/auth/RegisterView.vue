<script setup>
import { LIMITS } from '../../config/constants';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { register } from '../../services/authService';
import FormCard from '../../components/base/FormCard.vue';
import BaseInput from '../../components/base/BaseInput.vue';
import BaseButton from '../../components/base/BaseButton.vue';

const router = useRouter();

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  fullName: ''
});

const errors = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  fullName: ''
});

const isSubmitting = ref(false);
const apiErrorMessage = ref('');

function validate() {
  Object.keys(errors).forEach(
    (key) => (errors[key] = '')
  );

  if (!form.fullName.trim()) {
    errors.fullName = 'O nome completo é obrigatório.';
  }

  if (
    form.username.trim().length < LIMITS.USERNAME_MIN ||
    form.username.trim().length > LIMITS.USERNAME_MAX
  ) {
    errors.username =
      `O nome de usuário deve ter entre ${LIMITS.USERNAME_MIN} e ${LIMITS.USERNAME_MAX} caracteres.`;
  }

  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(form.email)) {
    errors.email = 'Informe um e-mail válido.';
  }

  if (form.password.length < LIMITS.PASSWORD_MIN) {
    errors.password =
      `A senha deve ter pelo menos ${LIMITS.PASSWORD_MIN} caracteres.`;
  }

  if (form.confirmPassword !== form.password) {
    errors.confirmPassword =
      'As senhas não coincidem.';
  }

  return Object.values(errors).every(
    (message) => message === ''
  );
}

async function handleSubmit() {
  apiErrorMessage.value = '';

  if (!validate()) {
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await register({
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
      confirmPassword: form.confirmPassword,
      fullName: form.fullName.trim()
    });

    console.log('Conta criada:', response.data);

    router.push({
      name: 'login'
    });

  } catch (error) {
    apiErrorMessage.value = error.message;

  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <FormCard title="Criar Conta" icon="bi-person-plus">
    <form @submit.prevent="handleSubmit" novalidate>
      <BaseInput
        id="fullName"
        v-model="form.fullName"
        label="Nome completo"
        :error="errors.fullName"
      />

      <BaseInput
        id="username"
        v-model="form.username"
        label="Usuário"
        :error="errors.username"
      />

      <BaseInput
        id="email"
        v-model="form.email"
        type="email"
        label="E-mail"
        :error="errors.email"
      />

      <BaseInput
        id="password"
        v-model="form.password"
        type="password"
        label="Senha"
        :error="errors.password"
      />

      <BaseInput
        id="confirmPassword"
        v-model="form.confirmPassword"
        type="password"
        label="Confirmar senha"
        :error="errors.confirmPassword"
      />

      <div v-if="apiErrorMessage" class="alert alert-danger">
        {{ apiErrorMessage }}
      </div>

      <BaseButton
        type="submit"
        block
        :loading="isSubmitting"
        loading-text="Criando conta..."
      >
        Criar Minha Conta
      </BaseButton>
    </form>

    <template #footer>
      Já tem conta?
      <router-link to="/login">Entrar</router-link>
    </template>
  </FormCard>
</template>
