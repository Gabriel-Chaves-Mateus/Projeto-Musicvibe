<script setup>
import { ref } from 'vue';

import { getAdminSongs, deleteAdminSong } from '../../services/adminService';
import { usePaginatedList } from '../../composables/usePaginatedList';
import { useDebouncedValue } from '../../composables/useDebouncedValue';
import { useToast } from '../../composables/useToast';
import { SEARCH } from '../../config/constants';
import { getSongCoverUrl } from '../../utils/media';

import ConfirmModal from '../../components/base/ConfirmModal.vue';

const toast = useToast();

const typedText = ref('');
const term = useDebouncedValue(typedText, SEARCH.DEBOUNCE_MS);

const { items, hasMore, error, isLoading, isLoadingMore, loadMore, reload } = usePaginatedList(
  (page, limit) => getAdminSongs(term.value.trim(), page, limit),
  { itemsKey: 'songs', watch: term }
);

const songToDelete = ref(null); // o interruptor E o dado do modal
const isDeleting = ref(false);

// PESSIMISTA: só depois do sucesso a linha sai da lista e o modal fecha.
async function confirmDelete() {
  if (isDeleting.value) return;

  isDeleting.value = true;

  try {
    const response = await deleteAdminSong(songToDelete.value.id);
    const deletedId = songToDelete.value.id;

    items.value = items.value.filter((song) => song.id !== deletedId);
    toast.success(response.message);
    songToDelete.value = null;
  } catch {
    // o toast de erro é do interceptor; o modal continua aberto
  } finally {
    isDeleting.value = false;
  }
}
</script>

<template>
  <section>
    <div class="d-flex flex-wrap gap-2 mb-3">
      <input
        v-model="typedText"
        type="search"
        class="form-control"
        style="max-width: 360px;"
        placeholder="Buscar músicas pelo título"
        aria-label="Buscar músicas"
      />
      <button type="button" class="btn btn-outline-secondary btn-sm ms-auto align-self-center" :disabled="isLoading" @click="reload">
        <i class="bi bi-arrow-clockwise me-1"></i>Atualizar
      </button>
    </div>

    <p v-if="isLoading && items.length === 0">Carregando músicas...</p>

    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
      <button type="button" class="btn btn-link alert-link p-0 ms-2" @click="reload">Tentar de novo</button>
    </div>

    <p v-else-if="items.length === 0" class="text-muted">Nenhuma música encontrada.</p>

    <template v-else>
      <ul class="list-group">
        <li v-for="song in items" :key="song.id" class="list-group-item d-flex gap-3 align-items-center">
          <router-link :to="{ name: 'music-detail', params: { id: song.id } }">
            <img :src="getSongCoverUrl(song.cover)" alt="" width="56" height="56" class="rounded" style="object-fit: cover;" />
          </router-link>

          <div class="flex-grow-1">
            <div class="d-flex flex-wrap align-items-center gap-2">
              <router-link :to="{ name: 'music-detail', params: { id: song.id } }" class="fw-bold text-decoration-none">
                {{ song.title }}
              </router-link>
              <span v-if="song.pendingReportsCount > 0" class="badge text-bg-danger">
                {{ song.pendingReportsCount }}
                {{ song.pendingReportsCount === 1 ? 'denúncia pendente' : 'denúncias pendentes' }}
              </span>
            </div>
            <div class="small text-muted">de @{{ song.author?.username }}</div>
          </div>

          <button type="button" class="btn btn-sm btn-outline-danger" @click="songToDelete = song">
            <i class="bi bi-trash me-1"></i>Excluir
          </button>
        </li>
      </ul>

      <div v-if="hasMore" class="text-center mt-3">
        <button type="button" class="btn btn-outline-secondary" :disabled="isLoadingMore" @click="loadMore">
          {{ isLoadingMore ? 'Carregando...' : 'Carregar mais' }}
        </button>
      </div>
    </template>

    <ConfirmModal
      v-if="songToDelete"
      title="Excluir música"
      :message="`Excluir “${songToDelete.title}”?\nSerão apagados também os comentários, as curtidas, as denúncias e os avisos dessa música, e o arquivo de áudio. Não dá para desfazer.`"
      confirm-label="Excluir música"
      :busy="isDeleting"
      @confirm="confirmDelete"
      @close="songToDelete = null"
    />
  </section>
</template>
