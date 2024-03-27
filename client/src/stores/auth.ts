import { defineStore } from 'pinia';
import { useAuthenticationService } from '../composables/useAuthenticationService';
import { UserCredentials } from '../composables/types';
import { computed, ref } from 'vue';

const NOT_LOGGED = {
  name: '',
  email: '',
  accessToken: '',
  refreshToken: '',
  steamWebAPIToken: '',
};
const { login, register, issueTokens } = useAuthenticationService();

export const useAuthStore = defineStore('auth', () => {
  const loading = ref(false);
  const user = ref(NOT_LOGGED);
  const clientState = ref('');
  const authCode = ref('');

  const authenticated = computed(
    () => !!user.value.accessToken && !!user.value.refreshToken
  );
  const accessToken = computed(() => user.value.accessToken);
  const refreshToken = computed(() => user.value.refreshToken);
  const steamWebAPIToken = computed(() => user.value.steamWebAPIToken);

  async function authenticate(
    credentials: UserCredentials,
    redirect_uri: string
  ) {
    loading.value = true;
    const loginResponse = await login(credentials, redirect_uri);
    user.value = {
      ...user.value,
      name: loginResponse.user.username,
      email: loginResponse.user.email,
      steamWebAPIToken: loginResponse.user.steamWebAPIToken,
    };
    loading.value = false;
    clientState.value = loginResponse.clientState;
    authCode.value = loginResponse.authCode;
  }

  async function signup(credentials: UserCredentials) {
    await register(credentials);
  }
  function logout() {
    loading.value = true;
    user.value = NOT_LOGGED;
    loading.value = false;
  }

  async function authorize(
    authCode: string,
    clientState: string,
    redirect_uri: string
  ) {
    return await issueTokens(authCode, clientState, redirect_uri);
  }

  return {
    user,
    clientState,
    authCode,
    authenticated,
    loading,
    accessToken,
    refreshToken,
    steamWebAPIToken,
    authenticate,
    signup,
    logout,
    authorize,
  };
});
