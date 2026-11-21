<script setup>
import { ref, reactive } from 'vue';

import { getAdminUsers, setUserBlocked } from '../../services/adminService';
import { usePaginatedList } from '../../composables/usePaginatedList';
import { useDebouncedValue } from '../../composables/useDebouncedValue';
import { useToast } from '../../composables/useToast';
import { useAuth } from '../../composables/useAuth';
import { SEARCH } from '../../config/constants';
import { getProfileImageUrl } from '../../utils/media';

import ConfirmModal from '../../components/base/ConfirmModal.vue';

const toast = useToast();
const { user: currentUser } = useAuth();

// typedText: o que o campo mostra. term: a cópia com pausa. A lista observa o TERM
// (observar typedText dispararia uma requisição por tecla).
const typedText = ref('');
const term = useDebouncedValue(typedText, SEARCH.DEBOUNCE_MS);

const { items: users, hasMore, error, isLoading, isLoadingMore, loadMore, reload } = usePaginatedList(
  (page, limit) => getAdminUsers(term.value.trim(), page, limit),
  { itemsKey: 'users', watch: term }
);

const busyIds = reactive(new Set());
const userToBlock = ref(null); // o interruptor E o dado do modal

// PESSIMISTA: espera a API; só no sucesso muda a linha e fecha o modal.
async function changeBlocked(user, isBlocked) {
  if (busyIds.has(user.id)) return;

  busyIds.add(user.id);

  try {
    const response = await setUserBlocked(user.id, isBlocked);

    user.isBlocked = response.data.isBlocked;
    toast.success(response.message);
    userToBlock.value = null;
  } catch {
    // o toast de erro é do interceptor; o modal continua aberto se a API recusou
  } finally {
    busyIds.delete(user.id);
  }
}
</script>

<template>
  <section>
    <div class="d-flex flex-wrap gap-2 mb-3">
      <input
        v-model="typedText"
        type="search"
        class="form-control"
        style="max-width: 360px;"
        placeholder="Buscar por usuário, nome ou e-mail"
        aria-label="Buscar usuários"
      />
      <button type="button" class="btn btn-outline-secondary btn-sm ms-auto align-self-center" :disabled="isLoading" @click="reload">
        <i class="bi bi-arrow-clockwise me-1"></i>Atualizar
      </button>
    </div>

    <p v-if="isLoading && users.length === 0">Carregando usuários...</p>

    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
      <button type="button" class="btn btn-link alert-link p-0 ms-2" @click="reload">Tentar de novo</button>
    </div>

    <p v-else-if="users.length === 0" class="text-muted">Nenhum usuário encontrado.</p>

    <template v-else>
      <ul class="list-group">
        <li v-for="user in users" :key="user.id" class="list-group-item d-flex gap-3 align-items-center">
          <img :src="getProfileImageUrl(user.profilePicture)" alt="" width="40" height="40" class="rounded-circle" style="object-fit: cover;" />

          <div class="flex-grow-1">
            <div class="d-flex flex-wrap align-items-center gap-2">
              <router-link :to="{ name: 'public-profile', params: { username: user.username } }" class="fw-bold text-decoration-none">
                @{{ user.username }}
              </router-link>
              <span v-if="user.isAdmin" class="badge text-bg-primary">Admin</span>
              <span v-if="user.isBlocked" class="badge text-bg-danger">Bloqueado</span>
            </div>
            <div class="small text-muted">{{ user.fullName }} · {{ user.email }}</div>
          </div>

          <span v-if="user.id === currentUser?.id" class="text-muted small">Você</span>
          <span v-else-if="user.isAdmin" class="text-muted small">Administrador</span>
          <button
            v-else-if="user.isBlocked"
            type="button"
            class="btn btn-sm btn-outline-success"
            :disabled="busyIds.has(user.id)"
            @click="changeBlocked(user, false)"
          >
            Desbloquear
          </button>
          <button v-else type="button" class="btn btn-sm btn-outline-danger" @click="userToBlock = user">
            Bloquear
          </button>
        </li>
      </ul>

      <div v-if="hasMore" class="text-center mt-3">
        <button type="button" class="btn btn-outline-secondary" :disabled="isLoadingMore" @click="loadMore">
          {{ isLoadingMore ? 'Carregando...' : 'Carregar mais' }}
        </button>
      </div>
    </template>

    <ConfirmModal
      v-if="userToBlock"
      title="Bloquear usuário"
      :message="`Bloquear @${userToBlock.username}? A pessoa perde o acesso na próxima ação e não consegue entrar até ser desbloqueada. Os conteúdos dela continuam visíveis.`"
      confirm-label="Bloquear"
      :busy="busyIds.has(userToBlock.id)"
      @confirm="changeBlocked(userToBlock, true)"
      @close="userToBlock = null"
    />
  </section>
</template>
