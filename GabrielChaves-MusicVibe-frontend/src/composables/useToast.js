import { ref } from 'vue';

import { TOAST_DURATION } from '../config/constants';

// A lista fica FORA da função useToast() (singleton de módulo): todo arquivo
// que chama useToast() recebe a MESMA lista. Assim o interceptor do Axios
// (que não é componente) e qualquer tela adicionam toasts no mesmo lugar, e o
// ToastContainer só lê. Com uma store Pinia seria preciso instalar o Pinia e
// chamar useStore() dentro de um contexto ativo; o interceptor, que roda
// fora de componentes, não tem esse contexto garantido. Um ref de módulo é
// simples, não depende de nada e serve para um estado tão pequeno.
const toasts = ref([]);
let nextId = 1;

function dismiss(id) {
  toasts.value = toasts.value.filter((toast) => toast.id !== id);
}

function show(message, type = 'info', duration) {
  // Mesma mensagem já na tela: não empilha duplicata (ex.: dois erros iguais seguidos)
  if (toasts.value.some((t) => t.message === message && t.type === type)) {
    return;
  }

  const id = nextId++;
  const timeout = duration ?? TOAST_DURATION[type.toUpperCase()] ?? TOAST_DURATION.INFO;

  toasts.value.push({ id, message, type });
  setTimeout(() => dismiss(id), timeout);

  return id;
}

export function useToast() {
  return {
    toasts,
    show,
    dismiss,
    success: (message, duration) => show(message, 'success', duration),
    error: (message, duration) => show(message, 'error', duration),
    info: (message, duration) => show(message, 'info', duration)
  };
}
