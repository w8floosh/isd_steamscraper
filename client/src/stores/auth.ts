import { defineStore } from 'pinia';
import { useAuthClient } from '../composables/useAuthClient';
import { UserCredentials } from '../composables/types';
import { computed, ref } from 'vue';

const NOT_LOGGED = {
  name: '',
  email: '',
  token: '',
  nonce: '',
};
const { login } = useAuthClient();

export const useAuthStore = defineStore('auth', () => {
  const loading = ref(false);
  const user = ref(NOT_LOGGED);

  const authenticated = computed(() => !!user.value.token);
  const token = computed(() => user.value.token);

  async function signin(credentials: UserCredentials) {
    loading.value = true;
    //   user.value = (await login(credentials)).data;
    user.value = await login(credentials);
    console.log(authenticated.value);
    loading.value = false;
  }
  function logout() {
    loading.value = true;
    user.value = NOT_LOGGED;
    loading.value = false;
  }

  return { user, authenticated, loading, token, signin, logout };
});
