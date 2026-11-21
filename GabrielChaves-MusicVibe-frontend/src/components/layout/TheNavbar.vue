<script setup>
import { ref, computed, watch, onBeforeUnmount, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

import { useAuth } from '../../composables/useAuth';
import { useClickOutside } from '../../composables/useClickOutside';
import { getProfileImageUrl } from '../../utils/media';
import { useNotificationsStore } from '../../stores/notifications';

const router = useRouter();
const { isAuthenticated, user, displayName, logout } = useAuth();

// Sino: o número vem da store (polling). Liga ao entrar na conta, desliga ao sair.
const notifications = useNotificationsStore();
const unreadCount = computed(() => notifications.unreadCount);
const unreadBadge = computed(() => (unreadCount.value > 99 ? '99+' : String(unreadCount.value)));
const bellLabel = computed(() =>
  unreadCount.value > 0 ? `Notificações (${unreadCount.value} não lidas)` : 'Notificações'
);

watch(
  isAuthenticated,
  (loggedIn) => (loggedIn ? notifications.startPolling() : notifications.stopPolling()),
  { immediate: true }
);

onUnmounted(() => notifications.stopPolling());

// Menu suspenso controlado por estado (nada de JS do Bootstrap)
const menuOpen = ref(false);
const menuRoot = ref(null);

function closeMenu() {
  menuOpen.value = false;
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}

useClickOutside(menuRoot, closeMenu);

// Esc fecha o menu (listener só existe enquanto o menu está aberto)
function handleKeydown(event) {
  if (event.key === 'Escape') {
    closeMenu();
  }
}

watch(menuOpen, (isOpen) => {
  if (isOpen) {
    document.addEventListener('keydown', handleKeydown);
  } else {
    document.removeEventListener('keydown', handleKeydown);
  }
});

onBeforeUnmount(() => document.removeEventListener('keydown', handleKeydown));

// Barra de busca: Enter (ou a lupa) leva à tela de busca já com o termo na URL.
const searchText = ref('');

function handleSearch() {
  const q = searchText.value.trim();

  if (!q) return;

  router.push({ name: 'search', query: { q } });
  searchText.value = '';
}

async function handleLogout() {
  closeMenu();
  await logout();
  router.push({ name: 'login' });
}
</script>

<template>
  <nav class="navbar navbar-expand bg-white border-bottom shadow-sm px-3">
    <router-link to="/" class="navbar-brand fw-bold text-musicvibe">
      <i class="bi bi-music-note-beamed me-1"></i>MusicVibe
    </router-link>

    <form class="d-flex ms-3 me-auto" role="search" @submit.prevent="handleSearch">
      <input
        v-model="searchText"
        type="search"
        class="form-control form-control-sm"
        placeholder="Buscar músicas e pessoas"
        aria-label="Buscar"
      />
      <button type="submit" class="btn btn-sm btn-outline-secondary ms-1" aria-label="Pesquisar">
        <i class="bi bi-search"></i>
      </button>
    </form>

    <ul class="navbar-nav align-items-center gap-2">
      <template v-if="!isAuthenticated">
        <li class="nav-item">
          <router-link to="/login" class="nav-link">
            <i class="bi bi-box-arrow-in-right me-1"></i>Login
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/register" class="nav-link">
            <i class="bi bi-person-plus me-1"></i>Criar Conta
          </router-link>
        </li>
      </template>

      <template v-else>
        <li class="nav-item">
          <router-link to="/feed" class="nav-link">
            <i class="bi bi-house me-1"></i>Feed
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/upload" class="nav-link">
            <i class="bi bi-cloud-upload me-1"></i>Enviar Música
          </router-link>
        </li>

        <li class="nav-item">
          <router-link
            :to="{ name: 'notifications' }"
            class="btn btn-outline-secondary position-relative"
            :aria-label="bellLabel"
          >
            <i class="bi bi-bell"></i>
            <span
              v-if="unreadCount > 0"
              class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            >
              {{ unreadBadge }}
            </span>
          </router-link>
        </li>

        <li ref="menuRoot" class="nav-item avatar-menu">
          <button
            type="button"
            class="btn avatar-button d-flex align-items-center gap-2"
            aria-haspopup="true"
            :aria-expanded="menuOpen"
            @click="toggleMenu"
          >
            <img
              :src="getProfileImageUrl(user?.profilePicture)"
              alt=""
              class="rounded-circle"
              width="32"
              height="32"
              style="object-fit: cover;"
            />
            <span class="d-none d-md-inline">{{ displayName }}</span>
            <i class="bi bi-chevron-down small"></i>
          </button>

          <ul v-if="menuOpen" class="dropdown-menu show avatar-dropdown">
            <li>
              <router-link to="/profile" class="dropdown-item" @click="closeMenu">
                <i class="bi bi-pencil-square me-2"></i>Editar Perfil
              </router-link>
            </li>
            <li>
              <router-link
                :to="{ name: 'public-profile', params: { username: user?.username } }"
                class="dropdown-item"
                @click="closeMenu"
              >
                <i class="bi bi-person-circle me-2"></i>Ver Perfil
              </router-link>
            </li>
            <li>
              <router-link to="/my-songs" class="dropdown-item" @click="closeMenu">
                <i class="bi bi-music-note-list me-2"></i>Meus Itens
              </router-link>
            </li>
            <li>
              <router-link to="/playlists" class="dropdown-item" @click="closeMenu">
                <i class="bi bi-collection-play me-2"></i>Minhas Playlists
              </router-link>
            </li>
            <li>
              <router-link to="/liked-songs" class="dropdown-item" @click="closeMenu">
                <i class="bi bi-heart me-2"></i>Curtidas
              </router-link>
            </li>
            <li><hr class="dropdown-divider" /></li>
            <li>
              <button type="button" class="dropdown-item" @click="handleLogout">
                <i class="bi bi-box-arrow-right me-2"></i>Sair
              </button>
            </li>
          </ul>
        </li>
      </template>
    </ul>
  </nav>
</template>
