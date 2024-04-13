import { defineStore } from 'pinia';
import { useAuthenticationService } from 'src/composables/useAuthenticationService';
import { IUser, UserCredentials } from 'src/composables/types';
import { computed, ref } from 'vue';

const NOT_LOGGED: IUser = {
  username: '',
  email: '',
  accessToken: '',
  steamWebAPIToken: '',
  steamId: '',
};
const { login, logout, resume, register, issueTokens } =
  useAuthenticationService();

export const useAuthStore = defineStore('auth', () => {
  const loading = ref(false);
  const user = ref<IUser>(NOT_LOGGED);
  const clientState = ref('');
  const authCode = ref('');
  const needsVerification = ref(true);
  const verificationTimeout = ref<NodeJS.Timeout | null>(null);

  const authenticated = computed(() => !!user.value.accessToken);
  const accessToken = computed(() => user.value.accessToken);
  const steamWebAPIToken = computed(() => user.value.steamWebAPIToken);
  const steamId = computed(() => user.value.steamId);

  async function authenticate(
    credentials: UserCredentials,
    redirect_uri: string
  ) {
    loading.value = true;
    const loginResponse = await login(credentials, redirect_uri);
    user.value = {
      ...user.value,
      username: loginResponse.user.username,
      email: loginResponse.user.email,
      steamWebAPIToken: loginResponse.user.steamWebAPIToken,
      steamId: loginResponse.user.steamId,
    };
    loading.value = false;
    clientState.value = loginResponse.clientState;
    authCode.value = loginResponse.authCode;
  }

  async function resumeSession() {
    if (!needsVerification.value && verificationTimeout.value) {
      clearTimeout(verificationTimeout.value);
      verificationTimeout.value = setTimeout(() => {
        needsVerification.value = true;
      }, 1000 * 60);
      return;
    }
    const session = await resume();
    verificationTimeout;
    if (!session) {
      user.value = NOT_LOGGED;
      return;
    }
    console.log(session);
    user.value = {
      username: session.user.username,
      email: session.user.email,
      steamWebAPIToken: session.user.steamWebAPIToken,
      steamId: session.user.steamId,
      accessToken: session.token,
    };
    needsVerification.value = false;
    verificationTimeout.value = setTimeout(() => {
      needsVerification.value = true;
    }, 1000 * 60 * 60);
  }

  async function signup(credentials: UserCredentials) {
    await register(credentials);
  }

  async function signout() {
    loading.value = true;
    user.value = NOT_LOGGED;
    await logout();
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
    steamWebAPIToken,
    steamId,
    authenticate,
    resumeSession,
    signup,
    signout,
    authorize,
  };
});
