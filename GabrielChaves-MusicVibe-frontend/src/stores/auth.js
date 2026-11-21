import { defineStore } from 'pinia';

import {
  login as loginRequest,
  logout as logoutRequest,
  getMyProfile
} from '../services/authService';

import { STORAGE_KEYS } from '../config/constants';

const TOKEN_KEY = STORAGE_KEYS.TOKEN;
const USER_KEY = STORAGE_KEYS.USER;

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem(TOKEN_KEY),

    user: JSON.parse(
      localStorage.getItem(USER_KEY) || 'null'
    )
  }),

  getters: {
    isAuthenticated: (state) => !!state.token
  },

  actions: {
    async login(credentials) {
      const response = await loginRequest(credentials);

      this.token = response.data.token;
      this.user = response.data.user;

      localStorage.setItem(
        TOKEN_KEY,
        this.token
      );

      localStorage.setItem(
        USER_KEY,
        JSON.stringify(this.user)
      );

      const profile = await getMyProfile();

      console.log(
        'Perfil autenticado OK:',
        profile.data
      );

      return response;
    },

    async validateSession() {
      if (!this.token) {
        return false;
      }

      try {
        const response = await getMyProfile();

        this.user = response.data;

        localStorage.setItem(
          USER_KEY,
          JSON.stringify(this.user)
        );

        return true;

      } catch (error) {
        this.clearSession();
        return false;
      }
    },

    async logout() {
      try {
        if (this.token) {
          await logoutRequest();
        }
      } catch (error) {
        console.error(
          'Erro ao chamar logout:',
          error.message
        );
      } finally {
        this.clearSession();
      }
    },

    clearSession() {
      this.token = null;
      this.user = null;

      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }
});