<script setup>
import { getSongCoverUrl, getProfileImageUrl } from '../utils/media';
import { formatCount } from '../utils/format';

defineProps({
  song: { type: Object, required: true },
  // Em Meus Itens e no Perfil Público o autor é redundante: showAuthor=false
  showAuthor: { type: Boolean, default: true }
});
</script>

<template>
  <!-- O card NÃO é um <a>: links e botões não podem ficar aninhados em outro
       link. Só a capa e o título levam ao detalhe; o autor é outro link e
       o slot "actions" recebe botões (Editar/Excluir). -->
  <div class="card song-card h-100 shadow-sm">
    <router-link :to="{ name: 'music-detail', params: { id: song.id } }">
      <img
        :src="getSongCoverUrl(song.cover)"
        :alt="`Capa de ${song.title}`"
        class="song-cover card-img-top"
        loading="lazy"
      />
    </router-link>

    <div class="card-body p-3">
      <h2 class="h6 mb-1 text-truncate">
        <router-link
          :to="{ name: 'music-detail', params: { id: song.id } }"
          class="text-dark text-decoration-none"
        >
          {{ song.title }}
        </router-link>
      </h2>

      <router-link
        v-if="showAuthor && song.author"
        :to="{ name: 'public-profile', params: { username: song.author.username } }"
        class="d-flex align-items-center gap-2 small text-muted text-decoration-none"
      >
        <img
          :src="getProfileImageUrl(song.author.profilePicture)"
          alt=""
          class="rounded-circle"
          width="20"
          height="20"
          style="object-fit: cover;"
        />
        <span class="text-truncate">
          {{ song.author.fullName || song.author.username }}
        </span>
      </router-link>

      <div class="small text-muted mt-2 d-flex gap-3">
        <span title="Reproduções"><i class="bi bi-play-circle me-1"></i>{{ formatCount(song.playsCount) }}</span>
        <span title="Curtidas"><i class="bi bi-heart me-1"></i>{{ formatCount(song.likesCount) }}</span>
        <span title="Comentários"><i class="bi bi-chat me-1"></i>{{ formatCount(song.commentsCount) }}</span>
      </div>
    </div>

    <div v-if="$slots.actions" class="card-footer d-flex gap-2 p-2">
      <slot name="actions" />
    </div>
  </div>
</template>
