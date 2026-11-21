import { ref } from 'vue';
import { defineStore } from 'pinia';

import { getUnreadCount } from '../services/notificationService';
import { NOTIFICATIONS } from '../config/constants';

// Store no estilo "setup": o número de não lidas do sino + o polling que o mantém
// atualizado. Quem liga e desliga o polling é a Navbar (login / logout).
export const useNotificationsStore = defineStore('notifications', () => {
  const unreadCount = ref(0);

  // Mesma ideia do lastCallId das telas: cada pergunta recebe um número e só a
  // MAIS RECENTE pode escrever o resultado.
  let lastRefreshId = 0;
  let timerId = null;

  async function refresh() {
    const refreshId = ++lastRefreshId;

    try {
      const response = await getUnreadCount();

      if (refreshId !== lastRefreshId) return;

      unreadCount.value = response.data.unreadCount;
    } catch {
      // vazio de propósito: o polling é silencioso; se falhar, tenta de novo daqui a 30 s.
    }
  }

  // Quem muda o número "de fora" (marcar como lida) passa por aqui. Sobe também o
  // lastRefreshId: uma resposta do polling que já estava a caminho (e foi pedida ANTES
  // desta mudança) fica velha e é descartada, em vez de sobrescrever o número novo.
  function setUnreadCount(value) {
    lastRefreshId++;
    unreadCount.value = value;
  }

  function refreshIfVisible() {
    if (document.visibilityState === 'visible') {
      refresh();
    }
  }

  function startPolling() {
    // Já ligado (login repetido, watch disparando de novo): não cria o 2º temporizador.
    if (timerId !== null) return;

    refresh();
    timerId = setInterval(refreshIfVisible, NOTIFICATIONS.POLL_MS);
    document.addEventListener('visibilitychange', refreshIfVisible);
  }

  function stopPolling() {
    clearInterval(timerId);
    timerId = null;
    // A MESMA referência do addEventListener: com outra função, nada seria removido.
    document.removeEventListener('visibilitychange', refreshIfVisible);

    // Descarta a pergunta que ainda estiver no ar e zera o sino da próxima conta.
    lastRefreshId++;
    unreadCount.value = 0;
  }

  return { unreadCount, refresh, setUnreadCount, refreshIfVisible, startPolling, stopPolling };
});
