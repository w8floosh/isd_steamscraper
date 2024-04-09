import { storeToRefs } from 'pinia';
import { useAuthStore } from 'src/stores/auth';
import { NavigationGuard } from 'vue-router';

export const authenticationGuard: NavigationGuard = async (to) => {
  const { authenticated } = storeToRefs(useAuthStore());
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if ((requiresAuth || to.path === '/') && to.path !== '/auth') {
    const { resumeSession } = useAuthStore();
    try {
      await resumeSession();
    } catch {
      return '/auth';
    }
  }
  const allowed = to.path != '/auth' && authenticated.value;
  if (requiresAuth && !allowed) {
    return '/auth';
  }
};
