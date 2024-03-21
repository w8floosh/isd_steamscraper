import { defineStore } from 'pinia';
import { useAuthenticationService } from '../composables/useAuthenticationService';
import { UserCredentials } from '../composables/types';
import { computed, ref } from 'vue';

const NOT_LOGGED = {
  name: '',
  email: '',
  accessToken: '',
  refreshToken: '',
};
const { login, register } = useAuthenticationService();

export const useAuthStore = defineStore('auth', () => {
  const loading = ref(false);
  const user = ref(NOT_LOGGED);

  const authenticated = computed(
    () => !!user.value.accessToken && !!user.value.refreshToken
  );
  const accessToken = computed(() => user.value.accessToken);
  const refreshToken = computed(() => user.value.refreshToken);

  async function signin(credentials: UserCredentials, redirect_uri: string) {
    loading.value = true;
    const loginResponse = await login(credentials, redirect_uri);
    user.value = {
      name: loginResponse.data.name,
      email: loginResponse.data.email,
      accessToken: loginResponse.data.accessToken,
      refreshToken: loginResponse.data.refreshToken,
    };
    loading.value = false;
  }

  async function signup(credentials: UserCredentials) {
    await register(credentials);
  }
  function logout() {
    loading.value = true;
    user.value = NOT_LOGGED;
    loading.value = false;
  }

  return {
    user,
    authenticated,
    loading,
    accessToken,
    refreshToken,
    signin,
    signup,
    logout,
  };
});
