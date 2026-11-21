<script setup>
import { reactive } from 'vue';

import { getNotifications, markNotificationAsRead } from '../services/notificationService';
import { usePaginatedList } from '../composables/usePaginatedList';
import { useNotificationsStore } from '../stores/notifications';
import { runOptimistic } from '../utils/optimistic';
import { getProfileImageUrl } from '../utils/media';
import { NOTIFICATION_TEXT } from '../config/constants';

const store = useNotificationsStore();

const { items, hasMore, error, isLoading, isLoadingMore, loadMore, reload } = usePaginatedList(
  getNotifications,
  { itemsKey: 'notifications' }
);

// "Cerca" por linha: ids com requisição em andamento (clique duplo = uma requisição).
const busyIds = reactive(new Set());

// Para onde o clique leva: seguir -> perfil de quem seguiu; curtir/comentar -> a música.
function destination(notification) {
  if (notification.type === 'follow' || !notification.song) {
    return { name: 'public-profile', params: { username: notification.Actor.username } };
  }

  return { name: 'music-detail', params: { id: notification.song.id } };
}

// Quarto caso do runOptimistic (utils/optimistic.js não muda):
//   apply   marca a linha e tira 1 do sino; devolve o undo
//   undo    desmarca a linha e SOMA 1 (a operação inversa, não "o número que eu vi":
//           se duas linhas falharem juntas, cada undo devolve a sua unidade)
//   confirm acerta a linha e entrega ao sino o número REAL da API
async function markAsRead(notification) {
  if (notification.isRead || busyIds.has(notification.id)) return;

  busyIds.add(notification.id);

  await runOptimistic({
    apply() {
      notification.isRead = true;
      store.setUnreadCount(Math.max(0, store.unreadCount - 1));

      return () => {
        notification.isRead = false;
        store.setUnreadCount(store.unreadCount + 1);
      };
    },
    request: () => markNotificationAsRead(notification.id),
    confirm(data) {
      notification.isRead = true;
      store.setUnreadCount(data.unreadCount);
    }
  }).finally(() => busyIds.delete(notification.id));
}

function formatDate(value) {
  return new Date(value).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}
</script>

<template>
  <div class="container py-4" style="max-width: 760px;">
    <div class="d-flex align-items-center mb-3">
      <h1 class="h3 mb-0">Notificações</h1>
      <button
        type="button"
        class="btn btn-outline-secondary btn-sm ms-auto"
        :disabled="isLoading"
        @click="reload"
      >
        <i class="bi bi-arrow-clockwise me-1"></i>Atualizar
      </button>
    </div>

    <p v-if="isLoading && items.length === 0">Carregando notificações...</p>

    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
      <button type="button" class="btn btn-link alert-link p-0 ms-2" @click="reload">
        Tentar de novo
      </button>
    </div>

    <p v-else-if="items.length === 0" class="text-muted">
      Nenhuma notificação por enquanto. Quando alguém curtir, comentar ou seguir você, o aviso aparece aqui.
    </p>

    <template v-else>
      <ul class="list-group">
        <li
          v-for="notification in items"
          :key="notification.id"
          class="list-group-item d-flex align-items-center gap-3"
          :class="{ 'notification-unread': !notification.isRead }"
        >
          <img
            :src="getProfileImageUrl(notification.Actor?.profilePicture)"
            alt=""
            class="rounded-circle"
            width="40"
            height="40"
            style="object-fit: cover;"
          />

          <div class="flex-grow-1">
            <router-link
              :to="destination(notification)"
              class="text-decoration-none text-body"
              :class="{ 'fw-bold': !notification.isRead }"
              @click="markAsRead(notification)"
            >
              <span class="text-musicvibe">@{{ notification.Actor?.username }}</span>
              {{ NOTIFICATION_TEXT[notification.type] }}
              <em v-if="notification.song">“{{ notification.song.title }}”</em>
            </router-link>
            <div class="small text-muted">{{ formatDate(notification.createdAt) }}</div>
          </div>

          <button
            v-if="!notification.isRead"
            type="button"
            class="btn btn-sm btn-outline-secondary"
            :disabled="busyIds.has(notification.id)"
            @click="markAsRead(notification)"
          >
            <i class="bi bi-check2 me-1"></i>Marcar como lida
          </button>
        </li>
      </ul>

      <div v-if="hasMore" class="text-center mt-3">
        <button
          type="button"
          class="btn btn-outline-secondary"
          :disabled="isLoadingMore"
          @click="loadMore"
        >
          {{ isLoadingMore ? 'Carregando...' : 'Carregar mais notificações' }}
        </button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.notification-unread {
  background-color: #f3ebff;
}
</style>
