import { ref, watch as vueWatch } from 'vue';

import { MESSAGES } from '../config/constants';

// Carrega dados ao montar (e de novo quando algo mudar), com data / error /
// isLoading prontos. Substitui o esqueleto isLoading + errorMessage +
// try/catch/finally que cada tela repetia.
//
//   const { data: song, error, isLoading } = useAsyncData(
//     () => getSongById(route.params.id),          // <- uma FUNÇÃO que faz a chamada
//     { watch: () => route.params.id }             // <- refaz quando o id mudar
//   );
//
// Recebe () => minhaChamada() e NÃO minhaChamada(): se recebesse o resultado,
// a chamada já teria sido disparada antes do composable existir, e ele não
// poderia controlar quando chamar (ao montar, de novo ao mudar o parâmetro,
// no "tentar novamente"). Uma função só é executada quando ele quiser.
//
// fn deve devolver a resposta da API ({ success, data }); `data` guarda response.data.
export function useAsyncData(fn, { immediate = true, watch, initialData = null } = {}) {
  // initialData: valor de antes da primeira resposta (ex.: [] para listas, assim o
  // template pode usar v-for sem checar null).
  const data = ref(initialData);
  const error = ref('');
  const isLoading = ref(false);

  // Corrida entre respostas: o usuário troca de música (ou de aba) enquanto a
  // resposta anterior ainda viaja. Se a antiga chegar DEPOIS da nova, ela
  // sobrescreveria a tela com dados da pessoa errada. Cada chamada ganha um
  // número; só a ÚLTIMA (lastCallId) tem direito de gravar o resultado.
  let lastCallId = 0;

  async function execute() {
    const callId = ++lastCallId;

    isLoading.value = true;
    error.value = '';

    try {
      const response = await fn();

      if (callId !== lastCallId) return;
      data.value = response.data;
    } catch (err) {
      if (callId !== lastCallId) return;
      data.value = initialData;
      error.value = err?.message || MESSAGES.GENERIC_ERROR;
    } finally {
      if (callId === lastCallId) {
        isLoading.value = false;
      }
    }
  }

  if (watch) {
    vueWatch(watch, execute, { immediate });
  } else if (immediate) {
    execute();
  }

  return { data, error, isLoading, execute };
}
