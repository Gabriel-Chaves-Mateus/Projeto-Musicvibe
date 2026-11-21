<script setup>
// Alcançabilidade (ADR-012): Sidebar → item "Seguindo" → /following (esta tela).
// Estado vazio com link para o Feed geral.
import { getFollowingSongs } from '../services/followService';
import { usePaginatedList } from '../composables/usePaginatedList';

import SongCard from '../components/SongCard.vue';
import BaseButton from '../components/base/BaseButton.vue';

const { items: songs, hasMore, error, isLoading, isLoadingMore, loadMore } =
  usePaginatedList((page, limit) => getFollowingSongs(page, limit));
</script>

<template>
  <div class="container py-4">
    <h1 class="h3 mb-4 text-musicvibe">
      <i class="bi bi-people me-2"></i>Seguindo
    </h1>

    <p v-if="isLoading">Carregando músicas...</p>

    <div v-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <p v-if="!isLoading && !error && songs.length === 0" class="text-muted">
      Nada por aqui ainda. Siga pessoas para ver as músicas delas, ou volte ao
      <router-link to="/feed">Feed</router-link>.
    </p>

    <div class="row g-3">
      <div
        v-for="song in songs"
        :key="song.id"
        class="col-6 col-md-4 col-lg-3"
      >
        <SongCard :song="song" />
      </div>
    </div>

    <div v-if="hasMore" class="text-center mt-4">
      <BaseButton
        variant="outline"
        :loading="isLoadingMore"
        loading-text="Carregando..."
        @click="loadMore"
      >
        Carregar mais
      </BaseButton>
    </div>
  </div>
</template>
