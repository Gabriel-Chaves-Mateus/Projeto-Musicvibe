import { ref, watch, onUnmounted } from 'vue';

// Devolve uma CÓPIA de `source` que só muda depois que `source` fica `delay` ms
// sem mudar. Digitar "blues" sem pausa muda a origem 5 vezes, mas a cópia muda 1.
//
// Debounce x lastCallId (useAsyncData): o debounce EVITA requisições demais
// (reduz o número); o lastCallId descarta respostas atrasadas (resolve a
// ORDEM das que já foram feitas). Um não substitui o outro.
export function useDebouncedValue(source, delay = 400) {
  // valor inicial = valor atual da origem (senão o primeiro termo, vindo da URL,
  // só valeria depois de `delay` ms)
  const debounced = ref(source.value);
  let timer = null;

  watch(source, (value) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      debounced.value = value;
    }, delay);
  });

  // sair da tela com o relógio rodando atualizaria uma tela que não existe mais
  onUnmounted(() => clearTimeout(timer));

  return debounced;
}
