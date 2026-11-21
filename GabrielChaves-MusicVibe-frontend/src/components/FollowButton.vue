<script setup>
import { useAuthenticatedAction } from '../composables/useAuthenticatedAction';
import { toggleFollow } from '../services/followService';
import { runOptimistic } from '../utils/optimistic';

// O estado é DO PAI (o perfil mostra o contador no cartão), por isso defineModel:
//   v-model:following="profile.isFollowing"
//   v-model:followers-count="profile.followersCount"
const props = defineProps({
  userId: { type: [Number, String], required: true }
});

const following = defineModel('following', { type: Boolean, default: false });
const followersCount = defineModel('followersCount', { type: Number, default: 0 });

// Visitante -> login e isBusy (três cliques rápidos = uma requisição) vêm do composable.
const { run } = useAuthenticatedAction();

function handleClick() {
  run(() =>
    runOptimistic({
      apply() {
        const previousFollowing = following.value;
        const previousCount = followersCount.value;

        // Com defineModel, ler following.value logo depois de atribuí-lo devolve o
        // valor ANTIGO; por isso o novo estado vai numa variável local.
        const nowFollowing = !previousFollowing;
        following.value = nowFollowing;
        followersCount.value = previousCount + (nowFollowing ? 1 : -1);

        return () => {
          following.value = previousFollowing;
          followersCount.value = previousCount;
        };
      },
      request: () => toggleFollow(props.userId),
      confirm(data) {
        following.value = data.isFollowing;
        followersCount.value = data.followersCount;
      }
    })
  );
}
</script>

<template>
  <div>
    <button
      type="button"
      class="btn"
      :class="following ? 'btn-outline-secondary' : 'btn-musicvibe'"
      :aria-pressed="following"
      @click="handleClick"
    >
      <i class="bi me-1" :class="following ? 'bi-person-check-fill' : 'bi-person-plus'"></i>
      {{ following ? 'Seguindo' : 'Seguir' }}
    </button>
  </div>
</template>
