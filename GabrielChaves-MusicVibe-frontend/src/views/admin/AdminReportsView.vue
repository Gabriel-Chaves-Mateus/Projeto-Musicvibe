<script setup>
import { ref, reactive } from 'vue';

import { getAdminReports, reviewAdminReport } from '../../services/adminService';
import { usePaginatedList } from '../../composables/usePaginatedList';
import { useToast } from '../../composables/useToast';
import { REPORT_FILTERS, REPORT_REASONS } from '../../config/constants';
import { getProfileImageUrl, getSongCoverUrl } from '../../utils/media';

const toast = useToast();

const statusFilter = ref('pending');

// A receita lê o filtro ATUAL a cada chamada; { watch: statusFilter } recarrega ao trocar.
const { items: reports, hasMore, error, isLoading, isLoadingMore, loadMore, reload } = usePaginatedList(
  (page, limit) => getAdminReports(statusFilter.value, page, limit),
  { itemsKey: 'reports', watch: statusFilter }
);

// a chave do banco vira o rótulo em português
const reasonLabels = Object.fromEntries(REPORT_REASONS.map((reason) => [reason.key, reason.label]));

// Cerca por linha: ids com revisão em andamento (clique duplo = uma requisição).
const busyIds = reactive(new Set());

// Ação do administrador: PESSIMISTA. Espera a API e só então muda a linha, com o que ela devolveu.
async function markAsReviewed(report) {
  if (busyIds.has(report.id)) return;

  busyIds.add(report.id);

  try {
    const response = await reviewAdminReport(report.id);

    report.status = response.data.status;
    report.reviewedAt = response.data.reviewedAt;
    toast.success(response.message);
  } catch {
    // o toast de erro é do interceptor do Axios; a linha continua pendente
  } finally {
    busyIds.delete(report.id);
  }
}

function formatDate(value) {
  return new Date(value).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}
</script>

<template>
  <section>
    <div class="d-flex flex-wrap align-items-center gap-2 mb-3">
      <div class="btn-group" role="group" aria-label="Filtrar denúncias por situação">
        <button
          v-for="filter in REPORT_FILTERS"
          :key="filter.value"
          type="button"
          class="btn btn-outline-secondary"
          :class="{ active: statusFilter === filter.value }"
          :aria-pressed="statusFilter === filter.value"
          @click="statusFilter = filter.value"
        >
          {{ filter.label }}
        </button>
      </div>

      <button type="button" class="btn btn-outline-secondary btn-sm ms-auto" :disabled="isLoading" @click="reload">
        <i class="bi bi-arrow-clockwise me-1"></i>Atualizar
      </button>
    </div>

    <p v-if="isLoading && reports.length === 0">Carregando denúncias...</p>

    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
      <button type="button" class="btn btn-link alert-link p-0 ms-2" @click="reload">Tentar de novo</button>
    </div>

    <p v-else-if="reports.length === 0" class="text-muted">Nenhuma denúncia neste filtro.</p>

    <template v-else>
      <ul class="list-group">
        <li v-for="report in reports" :key="report.id" class="list-group-item d-flex gap-3 align-items-start">
          <router-link v-if="report.song" :to="{ name: 'music-detail', params: { id: report.song.id } }">
            <img :src="getSongCoverUrl(report.song.cover)" alt="" width="64" height="64" class="rounded" style="object-fit: cover;" />
          </router-link>

          <div class="flex-grow-1">
            <div class="d-flex flex-wrap align-items-center gap-2">
              <router-link
                v-if="report.song"
                :to="{ name: 'music-detail', params: { id: report.song.id } }"
                class="fw-bold text-decoration-none"
              >
                {{ report.song.title }}
              </router-link>
              <span class="badge" :class="report.status === 'pending' ? 'text-bg-warning' : 'text-bg-success'">
                {{ report.status === 'pending' ? 'Pendente' : 'Revisada' }}
              </span>
            </div>

            <div class="small text-muted">
              de @{{ report.song?.author?.username }} · motivo:
              <strong>{{ reasonLabels[report.reason] || report.reason }}</strong>
            </div>
            <div class="small text-muted">
              denunciada por
              <img :src="getProfileImageUrl(report.Reporter?.profilePicture)" alt="" width="18" height="18" class="rounded-circle" />
              @{{ report.Reporter?.username }} em {{ formatDate(report.createdAt) }}
            </div>
            <div v-if="report.reviewedAt" class="small text-muted">revisada em {{ formatDate(report.reviewedAt) }}</div>
          </div>

          <button
            v-if="report.status === 'pending'"
            type="button"
            class="btn btn-sm btn-outline-success"
            :disabled="busyIds.has(report.id)"
            @click="markAsReviewed(report)"
          >
            {{ busyIds.has(report.id) ? 'Salvando...' : 'Marcar como revisada' }}
          </button>
        </li>
      </ul>

      <div v-if="hasMore" class="text-center mt-3">
        <button type="button" class="btn btn-outline-secondary" :disabled="isLoadingMore" @click="loadMore">
          {{ isLoadingMore ? 'Carregando...' : 'Carregar mais' }}
        </button>
      </div>
    </template>
  </section>
</template>
