<script setup>
import { useRoute } from 'vue-router';

import { getPublicProfile } from '../../services/authService';
import { getProfileImageUrl } from '../../utils/media';
import { useAsyncData } from '../../composables/useAsyncData';

import SongCard from '../../components/SongCard.vue';
import FollowButton from '../../components/FollowButton.vue';

const route = useRoute();

// Observa o parâmetro: ao clicar no autor de um card dentro de outro perfil,
// a mesma tela é reutilizada e precisa recarregar os dados.
const { data: profile, error, isLoading } = useAsyncData(
  () => getPublicProfile(route.params.username),
  { watch: () => route.params.username }
);
</script>

<template>
  <div class="container py-4">
    <p v-if="isLoading">Carregando perfil...</p>

    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <template v-else-if="profile">
      <div class="card shadow-sm mb-4">
        <div class="card-body d-flex flex-wrap align-items-center gap-4">
          <img
            :src="getProfileImageUrl(profile.profilePicture)"
            alt="Foto de perfil"
            class="rounded-circle"
            width="110"
            height="110"
            style="object-fit: cover;"
          />

          <div class="flex-grow-1">
            <h1 class="h3 mb-0 text-musicvibe">
              {{ profile.fullName || profile.username }}
            </h1>
            <div class="text-muted mb-2">@{{ profile.username }}</div>
            <p v-if="profile.bio" class="mb-2">{{ profile.bio }}</p>

            <div class="small text-muted">
              <strong>{{ profile.songsCount }}</strong> músicas ·
              <router-link
                :to="{ name: 'followers', params: { username: profile.username } }"
                class="text-muted text-decoration-none"
              >
                <strong>{{ profile.followersCount }}</strong> seguidores
              </router-link> ·
              <router-link
                :to="{ name: 'following', params: { username: profile.username } }"
                class="text-muted text-decoration-none"
              >
                <strong>{{ profile.followingCount }}</strong> seguindo
              </router-link>
            </div>
          </div>

          <!-- Três casos: dono / logado / visitante -->
          <div>
            <router-link
              v-if="profile.isOwner"
              to="/profile"
              class="btn btn-musicvibe"
            >
              <i class="bi bi-pencil-square me-1"></i>Editar Perfil
            </router-link>

            <!-- Aparece para TODO mundo que não é o dono; o visitante é levado ao login.
                 O :key recria o botão ao trocar de pessoa (mesma tela, outro perfil). -->
            <FollowButton
              v-else
              :key="profile.id"
              :user-id="profile.id"
              v-model:following="profile.isFollowing"
              v-model:followers-count="profile.followersCount"
            />
          </div>
        </div>
      </div>

      <h2 class="h5 mb-3">Músicas</h2>

      <p v-if="profile.songs.length === 0" class="text-muted">
        Esta pessoa ainda não enviou nenhuma música.
      </p>

      <div class="row g-3">
        <div
          v-for="song in profile.songs"
          :key="song.id"
          class="col-6 col-md-4 col-lg-3"
        >
          <SongCard :song="song" :show-author="false" />
        </div>
      </div>
    </template>
  </div>
</template>
