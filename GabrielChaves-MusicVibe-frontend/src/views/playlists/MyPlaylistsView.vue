<script setup>
// Alcançabilidade: menu do avatar (Minhas Playlists) e Sidebar (Playlists) -> /playlists.
// Criar e excluir acontecem aqui (modal / confirmação); clicar no cartão abre o detalhe.
import { ref } from 'vue';

import { getMyPlaylists, deletePlaylist } from '../../services/playlistService';
import { useAsyncData } from '../../composables/useAsyncData';
import { useToast } from '../../composables/useToast';

import CreatePlaylistModal from '../../components/playlists/CreatePlaylistModal.vue';
import BaseModal from '../../components/base/BaseModal.vue';
import BaseButton from '../../components/base/BaseButton.vue';

const toast = useToast();

// initialData: [] -> o template usa v-for direto, sem checar null
const { data: playlists, error, isLoading } = useAsyncData(() => getMyPlaylists(), {
  initialData: []
});

// dois controles de modal: o de criar e o de excluir (qual playlist)
const isCreating = ref(false);
const playlistToDelete = ref(null);
const deleteOpen = ref(false);
const isDeleting = ref(false);

function handleCreated(playlist) {
  // array NOVO (spread): a mais nova entra no topo, como a API ordena
  playlists.value = [playlist, ...playlists.value];
  toast.success('Playlist criada.');
}

function askDelete(playlist) {
  playlistToDelete.value = playlist;
  deleteOpen.value = true;
}

async function confirmDelete() {
  isDeleting.value = true;

  try {
    await deletePlaylist(playlistToDelete.value.id);

    playlists.value = playlists.value.filter((p) => p.id !== playlistToDelete.value.id);
    deleteOpen.value = false;
    toast.success('Playlist excluída.');
  } catch {
    // O toast vermelho é do interceptor (ação). O modal continua aberto.
  } finally {
    isDeleting.value = false;
  }
}

const pluralSongs = (count) => `${count} ${count === 1 ? 'música' : 'músicas'}`;
</script>

<template>
  <div class="container py-4">
    <div class="d-flex align-items-center mb-4">
      <h1 class="h3 mb-0 text-musicvibe">
        <i class="bi bi-collection-play me-2"></i>Minhas Playlists
      </h1>
      <button type="button" class="btn btn-musicvibe ms-auto" @click="isCreating = true">
        <i class="bi bi-plus-lg me-1"></i>Nova playlist
      </button>
    </div>

    <p v-if="isLoading">Carregando suas playlists...</p>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-else-if="playlists.length === 0" class="text-center text-muted py-5">
      <p class="mb-2">Você ainda não tem nenhuma playlist.</p>
      <p class="mb-3 small">Clique em <strong>Nova playlist</strong> para criar a primeira e depois use o botão <strong>Salvar</strong> numa música.</p>
    </div>

    <div class="row g-3">
      <div v-for="playlist in playlists" :key="playlist.id" class="col-12 col-md-6 col-lg-4">
        <!-- cartão inteiro clicável (stretched-link); o botão Excluir fica POR CIMA -->
        <div class="card h-100 shadow-sm position-relative">
          <div class="card-body">
            <div class="d-flex align-items-start gap-2 mb-1">
              <h2 class="h6 mb-0 text-truncate">
                <router-link
                  :to="{ name: 'playlist-detail', params: { id: playlist.id } }"
                  class="stretched-link text-dark text-decoration-none"
                >
                  {{ playlist.title }}
                </router-link>
              </h2>
              <span
                class="badge ms-auto"
                :class="playlist.isPublic ? 'text-bg-success' : 'text-bg-secondary'"
              >
                <i class="bi me-1" :class="playlist.isPublic ? 'bi-globe2' : 'bi-lock-fill'"></i>
                {{ playlist.isPublic ? 'Pública' : 'Privada' }}
              </span>
            </div>
            <p v-if="playlist.description" class="small text-muted mb-2 text-truncate">
              {{ playlist.description }}
            </p>
            <div class="small text-muted">
              <i class="bi bi-music-note-list me-1"></i>{{ pluralSongs(playlist.songsCount) }}
            </div>
          </div>

          <div class="card-footer bg-white p-2 text-end">
            <button
              type="button"
              class="btn btn-sm btn-outline-danger position-relative"
              style="z-index: 2;"
              @click="askDelete(playlist)"
            >
              <i class="bi bi-trash me-1"></i>Excluir
            </button>
          </div>
        </div>
      </div>
    </div>

    <CreatePlaylistModal v-if="isCreating" v-model:open="isCreating" @created="handleCreated" />

    <BaseModal v-model:open="deleteOpen" title="Excluir playlist">
      <p class="mb-0">
        Tem certeza que quer excluir <strong>{{ playlistToDelete?.title }}</strong>?
        As músicas continuam existindo; só a playlist é apagada.
      </p>
      <template #footer>
        <button type="button" class="btn btn-outline-secondary" :disabled="isDeleting" @click="deleteOpen = false">
          Cancelar
        </button>
        <BaseButton variant="danger" :loading="isDeleting" loading-text="Excluindo..." @click="confirmDelete">
          Excluir
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>
