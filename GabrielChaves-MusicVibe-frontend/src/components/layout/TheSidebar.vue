<script setup>
import { useAuth } from '../../composables/useAuth';

const { isAuthenticated, user, isAdmin } = useAuth();

// Só entram aqui telas que já existem de verdade.
// Favoritos ainda é "Em construção": voltam
// à Sidebar na aula em que cada funcionalidade for implementada.
</script>

<template>
  <aside v-if="isAuthenticated" class="app-sidebar border-end bg-light p-3">
    <ul class="nav nav-pills flex-column">
      <li class="nav-item">
        <router-link to="/feed" class="nav-link">
          <i class="bi bi-house me-2"></i>Feed
        </router-link>
      </li>
      <li class="nav-item">
        <router-link :to="{ name: 'search' }" class="nav-link">
          <i class="bi bi-search me-2"></i>Explorar
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/following" class="nav-link">
          <i class="bi bi-people me-2"></i>Seguindo
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/upload" class="nav-link">
          <i class="bi bi-cloud-upload me-2"></i>Enviar Música
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/liked-songs" class="nav-link">
          <i class="bi bi-heart me-2"></i>Curtidas
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/playlists" class="nav-link">
          <i class="bi bi-collection-play me-2"></i>Playlists
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/my-songs" class="nav-link">
          <i class="bi bi-music-note-list me-2"></i>Meus Itens
        </router-link>
      </li>
      <li class="nav-item">
        <router-link :to="{ name: 'public-profile', params: { username: user?.username } }" class="nav-link">
          <i class="bi bi-person-circle me-2"></i>Meu Perfil
        </router-link>
      </li>
    </ul>

    <!-- Seção só para administrador (a API confere o papel de novo em toda chamada) -->
    <template v-if="isAdmin">
      <hr />
      <div class="small text-muted text-uppercase px-3 mb-1">Administração</div>
      <ul class="nav nav-pills flex-column">
        <li class="nav-item">
          <router-link to="/admin" class="nav-link">
            <i class="bi bi-shield-lock me-2"></i>Painel
          </router-link>
        </li>
      </ul>
    </template>
  </aside>
</template>
