<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import LikeButton from '../components/LikeButton.vue';
import CommentSection from '../components/CommentSection.vue';
import AddToPlaylistModal from '../components/playlists/AddToPlaylistModal.vue';
import ReportSongModal from '../components/ReportSongModal.vue';

import { getSongById } from '../services/songService';
import { useAsyncData } from '../composables/useAsyncData';
import { useAuthenticatedAction } from '../composables/useAuthenticatedAction';
import { useToast } from '../composables/useToast';
import {
  getSongAudioUrl,
  getSongCoverUrl,
  getProfileImageUrl
} from '../utils/media';

const route = useRoute();

// "Salvar": visitante vai ao login (e volta aqui); logado abre o modal. O v-if do
// modal o cria do zero a cada abertura, então o status das playlists vem sempre fresco.
const { run: runSaveAction } = useAuthenticatedAction();
const saveOpen = ref(false);
const openSave = () => runSaveAction(() => { saveOpen.value = true; });

// "Denunciar": mesma cerca. O dono não vê o botão (a API também recusa: 400).
const { run: runReportAction } = useAuthenticatedAction();
const reportOpen = ref(false);
const openReport = () => runReportAction(() => { reportOpen.value = true; });

const toast = useToast();
function handleReported() {
  reportOpen.value = false;
  toast.success('Denúncia enviada. Obrigado por avisar.');
}

// watch: refaz a chamada quando o :id da rota muda (mesma tela, outra música)
const { data: song, error, isLoading } = useAsyncData(
  () => getSongById(route.params.id),
  { watch: () => route.params.id }
);

// O contador de comentários sobe quando a CommentSection avisa (@created)
const commentsCount = ref(0);
watch(song, (value) => {
  commentsCount.value = value?.commentsCount ?? 0;
});
</script>

<template>
  <div class="container py-4">
    <p v-if="isLoading">Carregando música...</p>

    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
      <router-link to="/feed" class="alert-link ms-2">Voltar ao Feed</router-link>
    </div>

    <div v-else-if="song" class="row g-4 justify-content-center">
      <div class="col-md-5 col-lg-4">
        <img
          :src="getSongCoverUrl(song.cover)"
          :alt="`Capa de ${song.title}`"
          class="detail-cover shadow-sm"
        />
      </div>

      <div class="col-md-7 col-lg-6">
        <h1 class="h3 text-musicvibe">{{ song.title }}</h1>

        <div class="d-flex align-items-center gap-2 mb-3 text-muted">
          <router-link
            :to="{ name: 'public-profile', params: { username: song.author?.username } }"
            class="d-flex align-items-center gap-2 text-decoration-none"
          >
            <img
              :src="getProfileImageUrl(song.author?.profilePicture)"
              alt=""
              class="rounded-circle"
              width="32"
              height="32"
              style="object-fit: cover;"
            />
            <span>{{ song.author?.fullName || song.author?.username }}</span>
          </router-link>
          <span class="ms-auto">
            <i class="bi bi-play-circle me-1"></i>{{ song.playsCount }}
          </span>
        </div>

        <!-- src aponta para o arquivo ESTÁTICO, nunca para /stream -->
        <audio
          class="audio-player mb-3"
          controls
          :src="getSongAudioUrl(song.audio)"
        ></audio>

        <p v-if="song.description">{{ song.description }}</p>

        <div class="d-flex align-items-start gap-3 mb-3">
          <LikeButton
            :song-id="song.id"
            :liked="song.isLiked"
            :count="song.likesCount"
          />
          <button type="button" class="btn btn-outline-secondary" @click="openSave">
            <i class="bi bi-bookmark-plus me-1"></i>Salvar
          </button>
          <button v-if="!song.isOwner" type="button" class="btn btn-outline-secondary" @click="openReport">
            <i class="bi bi-flag me-1"></i>Denunciar
          </button>
          <span class="btn disabled text-muted border-0">
            <i class="bi bi-chat me-1"></i>{{ commentsCount }}
          </span>
        </div>

        <!-- Esconder o botão NÃO é segurança: a API confere o dono no PUT/DELETE. -->
        <router-link
          v-if="song.isOwner"
          :to="{ name: 'edit-song', params: { id: song.id } }"
          class="btn btn-outline-secondary"
        >
          <i class="bi bi-pencil me-1"></i>Editar
        </router-link>
      </div>

      <AddToPlaylistModal v-if="saveOpen" v-model:open="saveOpen" :song-id="song.id" />

      <ReportSongModal
        v-if="reportOpen"
        v-model:open="reportOpen"
        :song-id="song.id"
        @reported="handleReported"
      />

      <div class="col-12 col-lg-10">
        <CommentSection
          :key="song.id"
          :song-id="song.id"
          @created="commentsCount++"
        />
      </div>
    </div>
  </div>
</template>
