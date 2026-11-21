<script setup>
// Rota pública (sem requiresAuth): visitante abre playlist pública pelo link.
// Alcançabilidade: cartão em Minhas Playlists -> esta tela.
import { ref } from 'vue';
import { useRoute } from 'vue-router';

import { getPlaylistById, removeSongFromPlaylist } from '../../services/playlistService';
import { useAsyncData } from '../../composables/useAsyncData';
import { useAuth } from '../../composables/useAuth';
import { useToast } from '../../composables/useToast';
import { getProfileImageUrl } from '../../utils/media';

import SongCard from '../../components/SongCard.vue';

const route = useRoute();
const toast = useToast();
const { isAuthenticated } = useAuth();

const { data: playlist, error, isLoading } = useAsyncData(
  () => getPlaylistById(route.params.id),
  { watch: () => route.params.id }
);

// "Remover da playlist" é PESSIMISTA: a API responde primeiro, o card só some depois
// (se a rede cair, o card fica e há toast). Quais cards estão com requisição em andamento:
const removingIds = ref(new Set());

async function removeSong(song) {
  if (removingIds.value.has(song.id)) return;

  removingIds.value = new Set(removingIds.value).add(song.id);

  try {
    const response = await removeSongFromPlaylist(playlist.value.id, song.id);

    playlist.value = {
      ...playlist.value,
      songs: playlist.value.songs.filter((s) => s.id !== song.id),
      songsCount: response.data.songsCount
    };
    toast.success('Música removida da playlist.');
  } catch {
    // toast de erro: interceptor
  } finally {
    const next = new Set(removingIds.value);
    next.delete(song.id);
    removingIds.value = next;
  }
}

const pluralSongs = (count) => `${count} ${count === 1 ? 'música' : 'músicas'}`;
</script>

<template>
  <div class="container py-4">
    <p v-if="isLoading">Carregando playlist...</p>

    <!-- 403 (privada) e 404 aparecem NO LUGAR do conteúdo, sem toast -->
    <div v-else-if="error" class="alert alert-warning">
      <p class="mb-2">{{ error }}</p>
      <router-link :to="isAuthenticated ? '/playlists' : '/login'" class="btn btn-sm btn-outline-secondary">
        {{ isAuthenticated ? 'Ir para Minhas Playlists' : 'Entrar' }}
      </router-link>
    </div>

    <template v-else-if="playlist">
      <div class="mb-4">
        <div class="d-flex align-items-center gap-2 flex-wrap">
          <h1 class="h3 mb-0 text-musicvibe">{{ playlist.title }}</h1>
          <span class="badge" :class="playlist.isPublic ? 'text-bg-success' : 'text-bg-secondary'">
            <i class="bi me-1" :class="playlist.isPublic ? 'bi-globe2' : 'bi-lock-fill'"></i>
            {{ playlist.isPublic ? 'Pública' : 'Privada' }}
          </span>
        </div>

        <p v-if="playlist.description" class="mt-2 mb-2">{{ playlist.description }}</p>

        <div class="d-flex align-items-center gap-3 text-muted small">
          <router-link
            :to="{ name: 'public-profile', params: { username: playlist.author?.username } }"
            class="d-flex align-items-center gap-2 text-decoration-none text-muted"
          >
            <img
              :src="getProfileImageUrl(playlist.author?.profilePicture)"
              alt=""
              class="rounded-circle"
              width="24"
              height="24"
              style="object-fit: cover;"
            />
            <span>por {{ playlist.author?.fullName || playlist.author?.username }}</span>
          </router-link>
          <span><i class="bi bi-music-note-list me-1"></i>{{ pluralSongs(playlist.songsCount) }}</span>
        </div>
      </div>

      <div v-if="playlist.songs.length === 0" class="text-center text-muted py-5">
        <template v-if="playlist.isOwner">
          <p class="mb-2">Esta playlist ainda está vazia.</p>
          <p class="small mb-0">Abra uma música e use o botão <strong>Salvar</strong> para adicioná-la aqui.</p>
        </template>
        <p v-else class="mb-0">Esta playlist ainda não tem músicas.</p>
      </div>

      <div class="row g-3">
        <div v-for="song in playlist.songs" :key="song.id" class="col-6 col-md-4 col-lg-3">
          <SongCard :song="song">
            <template v-if="playlist.isOwner" #actions>
              <button
                type="button"
                class="btn btn-sm btn-outline-danger flex-fill"
                :disabled="removingIds.has(song.id)"
                @click="removeSong(song)"
              >
                <i class="bi bi-x-lg me-1"></i>Remover da playlist
              </button>
            </template>
          </SongCard>
        </div>
      </div>
    </template>
  </div>
</template>
