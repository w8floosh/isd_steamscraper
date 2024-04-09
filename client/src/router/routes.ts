import { RouteRecordRaw } from 'vue-router';
import MainLayout from 'src/layouts/MainLayout.vue';
import UserPage from 'src/pages/UserPage.vue';
import LeaderboardsPage from 'src/pages/LeaderboardsPage.vue';
import IndexPage from 'src/pages/IndexPage.vue';
import AppsPage from 'src/pages/AppsPage.vue';
import ErrorNotFound from 'src/pages/ErrorNotFound.vue';
import OAuthPage from 'src/pages/OAuthPage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    children: [{ path: '', component: IndexPage, name: 'Home' }],
    meta: {
      icon: 'home',
    },
  },
  {
    path: '/auth',
    component: MainLayout,
    children: [{ path: '', component: IndexPage }],
    props: { auth: true },
    meta: {
      icon: 'lock',
    },
  },
  {
    path: '/oauth',
    component: MainLayout,
    children: [{ path: 'redirect', component: OAuthPage }],
  },
  {
    path: '/me',
    component: MainLayout,
    children: [{ path: '', component: UserPage, name: 'Profile' }],
    meta: {
      requiresAuth: true,
      icon: 'person',
    },
  },
  {
    path: '/user/:userId',
    component: MainLayout,
    children: [{ path: '', component: UserPage, props: true }],
    meta: {
      requiresAuth: true,
      icon: 'person',
    },
  },

  {
    path: '/apps',
    component: MainLayout,
    children: [{ path: '', component: AppsPage, name: 'App data' }],
    meta: {
      requiresAuth: true,
      icon: 'sports_esports',
    },
  },

  {
    path: '/leaderboards',
    component: MainLayout,
    children: [
      { path: '', component: LeaderboardsPage, name: 'Friends leaderboards' },
    ],
    meta: {
      requiresAuth: true,
      icon: 'leaderboard',
    },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    name: '404',
    path: '/:catchAll(.*)*',
    component: ErrorNotFound,
    meta: {
      icon: 'error',
    },
  },
];

export default routes;
