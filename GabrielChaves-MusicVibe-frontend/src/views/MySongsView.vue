<script setup>
import { ref } from 'vue';

import { getMySongs, deleteSong } from '../services/songService';
import { useAsyncData } from '../composables/useAsyncData';
import { useToast } from '../composables/useToast';

import SongCard from '../components/SongCard.vue';
import BaseModal from '../components/base/BaseModal.vue';
import BaseButton from '../components/base/BaseButton.vue';

const toast = useToast();

const { data: songs, error, isLoading } = useAsyncData(() => getMySongs());

// O modal fica AQUI, fora do card: um único modal para a tela inteira.
// Dentro de cada card ele herdaria o hover/transform do card e seria
// cortado pelo tamanho dele.
const modalOpen = ref(false);
const songToDelete = ref(null);
const busy = ref(false);

function askDelete(song) {
  songToDelete.value = song;
  modalOpen.value = true;
}

async function confirmDelete() {
  busy.value = true;

  try {
    await deleteSong(songToDelete.value.id);

    // remoção local: sem recarregar a lista
    songs.value = songs.value.filter((s) => s.id !== songToDelete.value.id);
    modalOpen.value = false;
    toast.success('Música excluída.');
  } catch (err) {
    // O toast de erro já foi mostrado pelo interceptor (é uma AÇÃO).
    // O modal continua aberto, e o toast aparece na frente dele, para tentar de novo.
  } finally {
    busy.value = false;
  }
}
</script>

<template>
  <div class="container py-4">
    <h1 class="h3 mb-4 text-musicvibe">
      <i class="bi bi-music-note-list me-2"></i>Meus Itens
    </h1>

    <p v-if="isLoading">Carregando suas músicas...</p>

    <div v-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <div
      v-if="!isLoading && songs && songs.length === 0 && !error"
      class="text-center text-muted py-5"
    >
      <p class="mb-2">Você ainda não enviou nenhuma música.</p>
      <router-link to="/upload" class="btn btn-musicvibe">
        <i class="bi bi-cloud-upload me-1"></i>Enviar a primeira
      </router-link>
    </div>

    <div class="row g-3">
      <div
        v-for="song in songs ?? []"
        :key="song.id"
        class="col-6 col-md-4 col-lg-3"
      >
        <SongCard :song="song" :show-author="false">
          <template #actions>
            <router-link
              :to="{ name: 'edit-song', params: { id: song.id } }"
              class="btn btn-sm btn-outline-secondary flex-fill"
            >
              <i class="bi bi-pencil me-1"></i>Editar
            </router-link>

            <button
              type="button"
              class="btn btn-sm btn-outline-danger flex-fill"
              @click="askDelete(song)"
            >
              <i class="bi bi-trash me-1"></i>Excluir
            </button>
          </template>
        </SongCard>
      </div>
    </div>

    <BaseModal v-model:open="modalOpen" title="Excluir música">
      <p class="mb-0">
        Tem certeza que quer excluir
        <strong>{{ songToDelete?.title }}</strong>?
        O áudio e a capa serão apagados e isso não pode ser desfeito.
      </p>

      <template #footer>
        <button
          type="button"
          class="btn btn-outline-secondary"
          :disabled="busy"
          @click="modalOpen = false"
        >
          Cancelar
        </button>

        <BaseButton
          variant="danger"
          :loading="busy"
          loading-text="Excluindo..."
          @click="confirmDelete"
        >
          Excluir
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>
