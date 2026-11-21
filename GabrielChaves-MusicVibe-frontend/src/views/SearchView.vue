<script setup>
// Alcançabilidade: barra de busca da Navbar (Enter) e item "Explorar" da Sidebar.
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { search } from '../services/searchService';
import { useAsyncData } from '../composables/useAsyncData';
import { useDebouncedValue } from '../composables/useDebouncedValue';
import { SEARCH } from '../config/constants';
import { getProfileImageUrl } from '../utils/media';

import SongCard from '../components/SongCard.vue';

const route = useRoute();
const router = useRouter();

// ?q=ab&q=cd chega como ARRAY: só texto vale
function queryFromUrl() {
  return typeof route.query.q === 'string' ? route.query.q : '';
}

// typedText: o que o campo MOSTRA (muda a cada tecla).
// term: a cópia "com pausa" (só muda depois de DEBOUNCE_MS sem digitar).
// normalizedTerm: o que vai para a API (sem espaços nas pontas).
const typedText = ref(queryFromUrl());
const term = useDebouncedValue(typedText, SEARCH.DEBOUNCE_MS);
const normalizedTerm = computed(() => term.value.trim());

// Termo curto: nem chama a API; a resposta "vazia" já vem pronta.
const { data: results, isLoading } = useAsyncData(
  () =>
    normalizedTerm.value.length < SEARCH.MIN_LENGTH
      ? Promise.resolve({ data: { query: normalizedTerm.value, songs: [], users: [] } })
      : search(normalizedTerm.value),
  { watch: normalizedTerm }
);

// URL -> campo (a Navbar navegou para outro ?q=, ou o usuário usou Voltar/Avançar).
// Só mexe no campo se o valor for diferente do que já está valendo, senão um
// escreveria no outro em círculo.
watch(
  () => route.query.q,
  () => {
    const fromUrl = queryFromUrl().trim();
    if (fromUrl !== normalizedTerm.value) {
      typedText.value = fromUrl;
    }
  }
);

// termo -> URL (F5 e o link mantêm a busca). replace, e não push: o botão Voltar
// não passa por cada pausa da digitação.
watch(normalizedTerm, (value) => {
  if (value === queryFromUrl().trim()) return;
  router.replace({ query: value ? { q: value } : {} });
});

// foco dado por código (autofocus em página navegada pelo SPA é pouco confiável)
const field = ref(null);
onMounted(() => field.value?.focus());

const isTooShort = computed(() => normalizedTerm.value.length < SEARCH.MIN_LENGTH);
const hasResults = computed(
  () => (results.value?.songs?.length ?? 0) + (results.value?.users?.length ?? 0) > 0
);
</script>

<template>
  <div class="container py-4">
    <h1 class="h3 mb-3 text-musicvibe"><i class="bi bi-search me-2"></i>Explorar</h1>

    <input
      ref="field"
      v-model="typedText"
      type="search"
      class="form-control form-control-lg mb-2"
      placeholder="Buscar músicas e pessoas"
      aria-label="Buscar músicas e pessoas"
      autocomplete="off"
    />

    <p v-if="isTooShort" class="text-muted small">
      Digite pelo menos {{ SEARCH.MIN_LENGTH }} letras para buscar.
    </p>

    <p v-else-if="isLoading" class="text-muted">Buscando...</p>

    <template v-else-if="results">
      <p v-if="!hasResults" class="text-muted">Nada encontrado para “{{ results.query }}”.</p>

      <section v-if="results.users.length > 0" class="mb-4">
        <h2 class="h5 mb-3">Pessoas</h2>
        <ul class="list-group">
          <li v-for="person in results.users" :key="person.id" class="list-group-item">
            <router-link
              :to="{ name: 'public-profile', params: { username: person.username } }"
              class="d-flex align-items-center gap-3 text-decoration-none text-dark"
            >
              <img
                :src="getProfileImageUrl(person.profilePicture)"
                alt=""
                class="rounded-circle"
                width="40"
                height="40"
                style="object-fit: cover;"
              />
              <div>
                <div class="fw-semibold">{{ person.fullName || person.username }}</div>
                <div class="small text-muted">@{{ person.username }}</div>
              </div>
            </router-link>
          </li>
        </ul>
      </section>

      <section v-if="results.songs.length > 0">
        <h2 class="h5 mb-3">Músicas</h2>
        <div class="row g-3">
          <div v-for="song in results.songs" :key="song.id" class="col-6 col-md-4 col-lg-3">
            <SongCard :song="song" />
          </div>
        </div>
      </section>
    </template>
  </div>
</template>
