import { onMounted, onBeforeUnmount } from 'vue';

// Chama `callback` quando o usuário clica fora do elemento de `elementRef`.
// O listener é do document e é removido ao desmontar o componente.
export function useClickOutside(elementRef, callback) {
  function handleClick(event) {
    const el = elementRef.value;

    if (el && !el.contains(event.target)) {
      callback(event);
    }
  }

  onMounted(() => document.addEventListener('click', handleClick));
  onBeforeUnmount(() => document.removeEventListener('click', handleClick));
}
