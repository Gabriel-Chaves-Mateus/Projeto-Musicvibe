<script setup>
import { reactive } from 'vue';

import {
  getPlaylistsStatusForSong,
  addSongToPlaylist,
  removeSongFromPlaylist
} from '../../services/playlistService';
import { useAsyncData } from '../../composables/useAsyncData';
import { runOptimistic } from '../../utils/optimistic';

import BaseModal from '../base/BaseModal.vue';

const props = defineProps({
  songId: { type: [Number, String], required: true }
});

const open = defineModel('open', { type: Boolean, default: false });

// A resposta já diz, para cada playlist, se a música está lá (hasSong).
// A caixa nasce marcada conforme o SERVIDOR.
const { data: playlists, error, isLoading } = useAsyncData(
  () => getPlaylistsStatusForSong(props.songId),
  { initialData: [] }
);

// Uma "cerca" por LINHA: ids com requisição em andamento. Dois cliques rápidos na
// mesma caixa viram uma requisição; as outras caixas continuam livres.
const pending = reactive(new Set());

function toggle(playlist, event) {
  if (pending.has(playlist.id)) return;

  pending.add(playlist.id);

  // estado de ANTES, numa variável local (a decisão add/remove depende dele)
  const hadSong = playlist.hasSong;

  runOptimistic({
    apply() {
      playlist.hasSong = !hadSong;
      playlist.songsCount += hadSong ? -1 : 1;

      return () => {
        playlist.hasSong = hadSong;
        playlist.songsCount += hadSong ? 1 : -1;
        // Se apply e undo rodarem antes de um novo render, o :checked do Vue não
        // vê mudança; então a caixa do navegador é acertada diretamente também.
        event.target.checked = hadSong;
      };
    },
    request: () =>
      hadSong
        ? removeSongFromPlaylist(playlist.id, props.songId)
        : addSongToPlaylist(playlist.id, props.songId),
    // acerta SÓ o contador com o valor da API (o has já está certo)
    confirm(data) {
      playlist.songsCount = data.songsCount;
    }
  }).finally(() => pending.delete(playlist.id));
}
</script>

<template>
  <BaseModal v-model:open="open" title="Salvar na playlist">
    <p v-if="isLoading" class="mb-0">Carregando suas playlists...</p>
    <div v-else-if="error" class="alert alert-danger mb-0">{{ error }}</div>

    <div v-else-if="playlists.length === 0" class="text-center text-muted">
      <p class="mb-2">Você ainda não tem playlists.</p>
      <router-link to="/playlists" class="btn btn-sm btn-musicvibe" @click="open = false">
        Criar a primeira playlist
      </router-link>
    </div>

    <ul v-else class="list-group list-group-flush">
      <li v-for="playlist in playlists" :key="playlist.id" class="list-group-item px-0">
        <div class="form-check d-flex align-items-center gap-2">
          <!-- :checked + @change (NUNCA v-model): a caixa lê o estado, o clique chama toggle -->
          <input
            :id="`pl-${playlist.id}`"
            type="checkbox"
            class="form-check-input mt-0"
            :checked="playlist.hasSong"
            :disabled="pending.has(playlist.id)"
            @change="toggle(playlist, $event)"
          />
          <label :for="`pl-${playlist.id}`" class="form-check-label flex-grow-1 text-truncate">
            <i v-if="!playlist.isPublic" class="bi bi-lock-fill text-muted me-1" title="Privada"></i>
            {{ playlist.title }}
          </label>
          <span class="small text-muted">{{ playlist.songsCount }}</span>
        </div>
      </li>
    </ul>

    <template #footer>
      <button type="button" class="btn btn-outline-secondary" @click="open = false">Fechar</button>
    </template>
  </BaseModal>
</template>
