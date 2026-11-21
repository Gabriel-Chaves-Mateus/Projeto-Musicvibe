<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

import { useAuth } from '../composables/useAuth';
import { getComments, createComment } from '../services/commentService';
import { formatRelativeDate } from '../utils/format';
import { useAsyncData } from '../composables/useAsyncData';
import { LIMITS } from '../config/constants';
import { getProfileImageUrl } from '../utils/media';

import BaseButton from './base/BaseButton.vue';

const props = defineProps({
  songId: { type: [Number, String], required: true }
});

const emit = defineEmits(['created']);

const route = useRoute();
const { isAuthenticated } = useAuth();

// Leitura ao montar: a lista de comentários
const { data: comments, error: loadError, isLoading: loading } = useAsyncData(
  () => getComments(props.songId)
);

const content = ref('');
const fieldError = ref('');
const apiError = ref('');
const sending = ref(false);

async function handleSubmit() {
  fieldError.value = '';
  apiError.value = '';

  const text = content.value.trim();

  if (!text) {
    fieldError.value = 'Escreva um comentário.';
    return;
  }

  if (text.length > LIMITS.COMMENT_MAX) {
    fieldError.value = `O comentário deve ter no máximo ${LIMITS.COMMENT_MAX} caracteres.`;
    return;
  }

  sending.value = true;

  try {
    const response = await createComment(props.songId, text);

    // O comentário novo entra no topo, sem recarregar a lista
    comments.value.unshift(response.data);
    content.value = '';
    emit('created');
  } catch (error) {
    apiError.value = error.message;
  } finally {
    sending.value = false;
  }
}
</script>

<template>
  <section class="mt-4">
    <h2 class="h5 mb-3">
      <i class="bi bi-chat-left-text me-2"></i>Comentários
    </h2>

    <form v-if="isAuthenticated" class="mb-4" novalidate @submit.prevent="handleSubmit">
      <textarea
        v-model="content"
        class="form-control"
        :class="{ 'is-invalid': fieldError }"
        rows="3"
        placeholder="Escreva um comentário..."
        aria-label="Comentário"
      ></textarea>

      <div class="d-flex align-items-start mt-1">
        <div v-if="fieldError" class="invalid-feedback d-block">{{ fieldError }}</div>
        <small
          class="ms-auto"
          :class="content.length > LIMITS.COMMENT_MAX ? 'text-danger' : 'text-muted'"
        >
          {{ content.length }}/{{ LIMITS.COMMENT_MAX }}
        </small>
      </div>

      <div v-if="apiError" class="alert alert-danger mt-2 mb-0">{{ apiError }}</div>

      <BaseButton
        type="submit"
        class="mt-2"
        :loading="sending"
        loading-text="Enviando..."
      >
        Comentar
      </BaseButton>
    </form>

    <p v-else class="text-muted">
      <router-link :to="{ name: 'login', query: { redirect: route.fullPath } }">
        Entre
      </router-link>
      para comentar.
    </p>

    <p v-if="loading" class="text-muted">Carregando comentários...</p>

    <div v-else-if="loadError" class="alert alert-danger">{{ loadError }}</div>

    <p v-else-if="!comments || comments.length === 0" class="text-muted">
      Ainda não há comentários. Seja a primeira pessoa a comentar!
    </p>

    <ul v-else class="list-unstyled mb-0">
      <li v-for="comment in comments" :key="comment.id" class="d-flex gap-3 mb-3">
        <router-link :to="{ name: 'public-profile', params: { username: comment.author.username } }">
          <img
            :src="getProfileImageUrl(comment.author.profilePicture)"
            alt=""
            class="rounded-circle"
            width="40"
            height="40"
            style="object-fit: cover;"
          />
        </router-link>

        <div class="flex-grow-1">
          <div class="small">
            <router-link
              :to="{ name: 'public-profile', params: { username: comment.author.username } }"
              class="fw-semibold text-decoration-none"
            >
              {{ comment.author.fullName || comment.author.username }}
            </router-link>
            <span class="text-muted ms-2">{{ formatRelativeDate(comment.createdAt) }}</span>
          </div>

          <!-- {{ }} escapa o HTML (vira texto); v-html executaria tags e scripts
               digitados por qualquer pessoa. pre-wrap preserva as quebras de linha. -->
          <p class="comment-text mb-0">{{ comment.content }}</p>
        </div>
      </li>
    </ul>
  </section>
</template>
