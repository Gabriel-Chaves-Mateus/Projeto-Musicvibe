import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { useToast } from '../composables/useToast';

const routes = [
  {
    path: '/',
    name: 'landing',
    component: () => import('../views/LandingView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/auth/LoginView.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/auth/RegisterView.vue')
  },
  {
    path: '/feed',
    name: 'general-feed',
    component: () => import('../views/FeedView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/following',
    name: 'following-feed',
    component: () => import('../views/FollowingFeedView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/explore',
    name: 'explore',
    component: () => import('../views/ExploreView.vue')
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../views/SearchView.vue')
  },
  {
    path: '/music/:id',
    name: 'music-detail',
    component: () => import('../views/MusicDetailView.vue')
  },
  {
    path: '/artist/:id',
    name: 'artist-detail',
    component: () => import('../views/ArtistDetailView.vue')
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: () => import('../views/FavoritesView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/following-artists',
    name: 'following-artists',
    component: () => import('../views/FollowingArtistsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/playlists',
    name: 'playlists',
    component: () => import('../views/playlists/MyPlaylistsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/playlists/:id',
    name: 'playlist-detail',
    component: () => import('../views/playlists/PlaylistDetailView.vue')
    // pública: visitante abre playlist pública pelo link (o 403 vem da API)
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: () => import('../views/NotificationsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/profile/MyProfileView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile/:username',
    name: 'public-profile',
    component: () => import('../views/profile/PublicProfileView.vue')
  },
  {
    path: '/profile/:username/followers',
    name: 'followers',
    component: () => import('../views/profile/FollowListView.vue'),
    props: { kind: 'followers' }
  },
  {
    path: '/profile/:username/following',
    name: 'following',
    component: () => import('../views/profile/FollowListView.vue'),
    props: { kind: 'following' }
  },
  {
    path: '/my-songs',
    name: 'my-songs',
    component: () => import('../views/MySongsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/songs/:id/edit',
    name: 'edit-song',
    component: () => import('../views/EditSongView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/liked-songs',
    name: 'liked-songs',
    component: () => import('../views/LikedSongsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/upload',
    name: 'upload-music',
    component: () => import('../views/UploadMusicView.vue'),
    meta: { requiresAuth: true }
  },
  {
    // Rota PAI: o layout (título + abas). A meta fica aqui e vale para os filhos.
    path: '/admin',
    component: () => import('../components/layout/AdminLayout.vue'),
    redirect: { name: 'admin-dashboard' },
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('../views/admin/AdminDashboardView.vue')
      },
      {
        path: 'reports',
        name: 'admin-reports',
        component: () => import('../views/admin/AdminReportsView.vue')
      },
      {
        path: 'users',
        name: 'admin-users',
        component: () => import('../views/admin/AdminUsersView.vue')
      },
      {
        path: 'musics',
        name: 'admin-musics',
        component: () => import('../views/admin/AdminMusicsView.vue')
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) {
    return true;
  }

  const { isAuthenticated, validateSession, user: currentUser } = useAuth();

  const toLogin = {
    name: 'login',
    query: { redirect: to.fullPath }
  };

  if (!isAuthenticated.value) {
    return toLogin;
  }

  const sessionIsValid = await validateSession();

  if (!sessionIsValid) {
    return toLogin;
  }

  // Guarda por PAPEL. Isto é só experiência de uso: esconde telas que a pessoa não poderia
  // usar. Quem PROTEGE os dados é a API (isAdmin no servidor): editar o localStorage aqui
  // abre a moldura do painel, mas toda chamada /admin/* continua respondendo 403.
  if (to.meta.requiresAdmin && !currentUser.value?.isAdmin) {
    useToast().error('Você não tem permissão para acessar a administração.');
    return { name: 'general-feed' };
  }

  return true;
});

export default router;
