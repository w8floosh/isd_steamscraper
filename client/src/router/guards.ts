import { storeToRefs } from 'pinia';
import { useAuthStore } from 'stores/auth';
import { NavigationGuard } from 'vue-router';

export const authenticationGuard: NavigationGuard = (to) => {
  const { authenticated } = storeToRefs(useAuthStore());
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const allowed = to.path != '/auth' && authenticated.value;
  if (requiresAuth && !allowed) {
    return '/auth';
  }
};
