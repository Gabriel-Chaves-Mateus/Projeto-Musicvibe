<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import { getPublicProfile } from '../../services/authService';
import { getFollowers, getFollowing } from '../../services/followService';
import { getProfileImageUrl } from '../../utils/media';
import { useAsyncData } from '../../composables/useAsyncData';

// UMA tela, DUAS rotas: quem diferencia é a prop `kind`, vinda da definição
// da rota (props: { kind: 'followers' } ou 'following').
const props = defineProps({
  kind: { type: String, required: true, validator: (v) => ['followers', 'following'].includes(v) }
});

const route = useRoute();

// Duas chamadas EM SEQUÊNCIA: a rota usa o username, mas a API de listas
// usa o id. A primeira (perfil) traz o id e o nome para os títulos.
// O composable guarda response.data, então devolvo { data: { ... } }.
async function loadProfileAndList() {
  const profileResponse = await getPublicProfile(route.params.username);
  const fetchList = props.kind === 'followers' ? getFollowers : getFollowing;
  const listResponse = await fetchList(profileResponse.data.id);

  return { data: { profile: profileResponse.data, people: listResponse.data } };
}

// Reage a DUAS mudanças: a aba (kind) e a pessoa (username).
// O lastCallId do composable descarta a resposta antiga em trocas rápidas.
const { data, error, isLoading } = useAsyncData(loadProfileAndList, {
  watch: () => [props.kind, route.params.username]
});

const profile = computed(() => data.value?.profile ?? null);
const people = computed(() => data.value?.people ?? []);
</script>

<template>
  <div class="container py-4">
    <p v-if="isLoading">Carregando...</p>

    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
      <div class="mt-2">
        <router-link to="/feed">Voltar ao Feed</router-link>
      </div>
    </div>

    <template v-else-if="profile">
      <router-link
        :to="{ name: 'public-profile', params: { username: profile.username } }"
        class="small text-decoration-none"
      >
        <i class="bi bi-arrow-left me-1"></i>Voltar ao perfil de @{{ profile.username }}
      </router-link>

      <h1 class="h4 mt-2 mb-3 text-musicvibe">
        {{ profile.fullName || profile.username }}
      </h1>

      <ul class="nav nav-tabs mb-3">
        <li class="nav-item">
          <router-link
            :to="{ name: 'followers', params: { username: profile.username } }"
            class="nav-link"
            :class="{ active: kind === 'followers' }"
          >
            Seguidores
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            :to="{ name: 'following', params: { username: profile.username } }"
            class="nav-link"
            :class="{ active: kind === 'following' }"
          >
            Seguindo
          </router-link>
        </li>
      </ul>

      <p v-if="people.length === 0" class="text-muted">
        <template v-if="kind === 'followers'">
          {{ profile.fullName || profile.username }} ainda não tem seguidores.
        </template>
        <template v-else>
          {{ profile.fullName || profile.username }} ainda não segue ninguém.
        </template>
      </p>

      <ul v-else class="list-group">
        <li v-for="person in people" :key="person.id" class="list-group-item">
          <router-link
            :to="{ name: 'public-profile', params: { username: person.username } }"
            class="d-flex align-items-center gap-3 text-decoration-none text-dark"
          >
            <img
              :src="getProfileImageUrl(person.profilePicture)"
              :alt="`Foto de ${person.username}`"
              class="rounded-circle"
              width="48"
              height="48"
              style="object-fit: cover;"
            />
            <div class="min-w-0">
              <div class="fw-semibold">{{ person.fullName || person.username }}</div>
              <div class="small text-muted">@{{ person.username }}</div>
            </div>
          </router-link>
        </li>
      </ul>
    </template>
  </div>
</template>
