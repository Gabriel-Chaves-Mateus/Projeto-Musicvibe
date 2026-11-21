<script setup>
import { ref, watch } from 'vue';

import { useAuthenticatedAction } from '../composables/useAuthenticatedAction';
import { toggleLike } from '../services/likeService';
import { formatCount } from '../utils/format';
import { runOptimistic } from '../utils/optimistic';

const props = defineProps({
  songId: { type: [Number, String], required: true },
  liked: { type: Boolean, default: false },
  count: { type: Number, default: 0 }
});

// A cerca (visitante -> login, isBusy contra cliques repetidos) mora no composable.
const { run } = useAuthenticatedAction();

const isLiked = ref(props.liked);
const likesCount = ref(props.count);

// Se o pai trocar de música (mesma tela, outro id), recomeça do valor novo
watch(
  () => [props.songId, props.liked, props.count],
  () => {
    isLiked.value = props.liked;
    likesCount.value = props.count;
  }
);

function handleClick() {
  run(() =>
    runOptimistic({
      // muda a tela já e devolve o "desfazer"
      apply() {
        const previousLiked = isLiked.value;
        const previousCount = likesCount.value;

        isLiked.value = !previousLiked;
        likesCount.value = previousCount + (previousLiked ? -1 : 1);

        return () => {
          isLiked.value = previousLiked;
          likesCount.value = previousCount;
        };
      },
      request: () => toggleLike(props.songId),
      // a resposta da API é a verdade e substitui o palpite
      confirm(data) {
        isLiked.value = data.liked;
        likesCount.value = data.likesCount;
      }
    })
  );
}
</script>

<template>
  <div>
    <button
      type="button"
      class="btn like-button"
      :class="{ active: isLiked }"
      :aria-pressed="isLiked"
      @click="handleClick"
    >
      <i class="bi" :class="isLiked ? 'bi-heart-fill' : 'bi-heart'"></i>
      <span class="ms-1">{{ formatCount(likesCount) }}</span>
    </button>
  </div>
</template>
