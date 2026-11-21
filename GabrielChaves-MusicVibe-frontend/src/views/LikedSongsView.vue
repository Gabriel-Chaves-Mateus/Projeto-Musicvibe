<script setup>
import { getLikedSongs } from '../services/likeService';
import { useAsyncData } from '../composables/useAsyncData';

import SongCard from '../components/SongCard.vue';

const { data: songs, error, isLoading } = useAsyncData(() => getLikedSongs());
</script>

<template>
  <div class="container py-4">
    <h1 class="h3 mb-4 text-musicvibe">
      <i class="bi bi-heart me-2"></i>Músicas Curtidas
    </h1>

    <p v-if="isLoading">Carregando...</p>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div
      v-if="!isLoading && !error && songs && songs.length === 0"
      class="text-center text-muted py-5"
    >
      <p class="mb-2">Você ainda não curtiu nenhuma música.</p>
      <router-link to="/feed" class="btn btn-musicvibe">Explorar o Feed</router-link>
    </div>

    <div class="row g-3">
      <div v-for="song in songs ?? []" :key="song.id" class="col-6 col-md-4 col-lg-3">
        <SongCard :song="song" />
      </div>
    </div>
  </div>
</template>
