import { computed } from 'vue';
import { useAuthStore } from '../stores/auth';

// Composable: centraliza o acesso ao estado de autenticação.
// Quem consome (guarda de rota, Navbar, Sidebar) não precisa saber
// que por baixo existe uma store Pinia, nem a chave do localStorage.
export function useAuth() {
  const store = useAuthStore();

  const isAuthenticated = computed(() => store.isAuthenticated);
  const user = computed(() => store.user);
  const isAdmin = computed(() => !!store.user?.isAdmin);
  const displayName = computed(
    () => store.user?.fullName || store.user?.username || ''
  );

  return {
    isAuthenticated,
    user,
    isAdmin,
    displayName,
    login: store.login,
    logout: store.logout,
    validateSession: store.validateSession
  };
}
