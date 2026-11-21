<script setup>
// Moldura do painel: título + abas. Cada aba é uma rota FILHA de /admin, e a tela dela
// aparece no <router-view /> aqui embaixo, sem recarregar o título e as abas.
const tabs = [
  { name: 'admin-dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
  { name: 'admin-reports', label: 'Denúncias', icon: 'bi-flag' },
  { name: 'admin-users', label: 'Usuários', icon: 'bi-people' },
  { name: 'admin-musics', label: 'Músicas', icon: 'bi-music-note-list' }
];
</script>

<template>
  <div class="container py-4">
    <h1 class="h3 mb-3"><i class="bi bi-shield-lock me-2"></i>Administração</h1>

    <nav aria-label="Seções da administração" class="mb-4">
      <ul class="nav nav-pills flex-wrap gap-1">
        <li v-for="tab in tabs" :key="tab.name" class="nav-item">
          <router-link :to="{ name: tab.name }" class="nav-link" active-class="active">
            <i class="bi me-1" :class="tab.icon"></i>{{ tab.label }}
          </router-link>
        </li>
      </ul>
    </nav>

    <router-view />
  </div>
</template>
