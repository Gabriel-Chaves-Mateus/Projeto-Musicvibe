<script setup>
import { useAsyncData } from '../../composables/useAsyncData';
import { getAdminDashboard } from '../../services/adminService';

const { data: stats, error, isLoading, execute } = useAsyncData(getAdminDashboard);

// Cartões iguais: um v-for em vez de seis blocos copiados. `key` é a chave do objeto da API.
const cards = [
  { key: 'users', label: 'Usuários', icon: 'bi-people' },
  { key: 'blockedUsers', label: 'Usuários bloqueados', icon: 'bi-slash-circle' },
  { key: 'songs', label: 'Músicas', icon: 'bi-music-note-list' },
  { key: 'comments', label: 'Comentários', icon: 'bi-chat-left-text' },
  { key: 'likes', label: 'Curtidas', icon: 'bi-heart' },
  { key: 'reviewedReports', label: 'Denúncias revisadas', icon: 'bi-check2-circle' }
];
</script>

<template>
  <section>
    <div class="d-flex align-items-center mb-3">
      <h2 class="h5 mb-0">Visão geral</h2>
      <button type="button" class="btn btn-outline-secondary btn-sm ms-auto" :disabled="isLoading" @click="execute">
        <i class="bi bi-arrow-clockwise me-1"></i>Atualizar
      </button>
    </div>

    <p v-if="isLoading && !stats">Carregando números...</p>

    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-else-if="stats" class="row g-3">
      <div v-for="card in cards" :key="card.key" class="col-6 col-md-4">
        <div class="card h-100">
          <div class="card-body">
            <div class="text-muted small"><i class="bi me-1" :class="card.icon"></i>{{ card.label }}</div>
            <div class="display-6">{{ stats[card.key] }}</div>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-6">
        <router-link
          :to="{ name: 'admin-reports' }"
          class="card h-100 text-decoration-none text-white bg-danger"
        >
          <div class="card-body">
            <div class="small"><i class="bi bi-flag-fill me-1"></i>Denúncias pendentes</div>
            <div class="display-5">{{ stats.pendingReports }}</div>
            <div class="small">Ver denúncias <i class="bi bi-arrow-right"></i></div>
          </div>
        </router-link>
      </div>
    </div>
  </section>
</template>
