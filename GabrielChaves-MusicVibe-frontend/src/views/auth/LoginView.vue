<script setup>
import { reactive, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import { useAuth } from '../../composables/useAuth';
import FormCard from '../../components/base/FormCard.vue';
import BaseInput from '../../components/base/BaseInput.vue';
import BaseButton from '../../components/base/BaseButton.vue';

const router = useRouter();
const route = useRoute();
const { login } = useAuth();

const form = reactive({
  email: '',
  password: ''
});

const errorMessage = ref('');
const isSubmitting = ref(false);

async function handleSubmit() {
  errorMessage.value = '';
  isSubmitting.value = true;

  try {
    await login({
      email: form.email.trim(),
      password: form.password
    });

    const redirect =
      route.query.redirect || '/feed';

    router.push(redirect);

  } catch (error) {
    errorMessage.value = error.message;

  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <FormCard title="Entrar no MusicVibe" icon="bi-box-arrow-in-right">
    <form @submit.prevent="handleSubmit">
      <BaseInput
        id="email"
        v-model="form.email"
        type="email"
        label="E-mail"
        required
      />

      <BaseInput
        id="password"
        v-model="form.password"
        type="password"
        label="Senha"
        required
      />

      <div v-if="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>

      <BaseButton
        type="submit"
        block
        :loading="isSubmitting"
        loading-text="Entrando..."
      >
        Entrar
      </BaseButton>
    </form>

    <template #footer>
      Ainda não tem conta?
      <router-link to="/register">Criar conta</router-link>
    </template>
  </FormCard>
</template>
