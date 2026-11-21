import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import { useAuth } from './useAuth';

// A "cerca" repetida dos botões de ação social, num só lugar:
//   1) visitante -> login com redirect de volta para esta tela;
//   2) isBusy -> ignora cliques enquanto a requisição anterior não terminou
//      (três cliques rápidos geram UMA requisição);
//   3) liga/desliga isBusy com try/finally.
// Quem chama só escreve a ação; o catch da ação apenas desfaz a mudança visual,
// porque o AVISO de erro (toast) já é dado pelo interceptor do Axios.
export function useAuthenticatedAction() {
  const router = useRouter();
  const route = useRoute();
  const { isAuthenticated } = useAuth();

  const isBusy = ref(false);

  async function run(action) {
    if (!isAuthenticated.value) {
      router.push({ name: 'login', query: { redirect: route.fullPath } });
      return;
    }

    if (isBusy.value) {
      return;
    }

    isBusy.value = true;

    try {
      return await action();
    } finally {
      isBusy.value = false;
    }
  }

  return { run, isBusy };
}
