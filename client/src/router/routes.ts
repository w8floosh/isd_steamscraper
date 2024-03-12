import { RouteRecordRaw } from 'vue-router';
import MainLayout from 'layouts/MainLayout.vue';
import StatsPage from 'pages/StatsPage.vue';
import UserPage from 'pages/UserPage.vue';
import LeaderboardsPage from 'pages/LeaderboardsPage.vue';
import IndexPage from 'pages/IndexPage.vue';
import AppPage from 'pages/AppPage.vue';
import ErrorNotFound from 'pages/ErrorNotFound.vue';
import FriendsPage from 'src/pages/FriendsPage.vue';

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
    props: { auth: 'true' },
    meta: {
      icon: 'home',
    },
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
    path: '/apps',
    component: MainLayout,
    children: [{ path: '', component: AppPage, name: 'App data' }],
    meta: {
      requiresAuth: true,
      icon: 'sports_esports',
    },
  },

  {
    path: '/stats',
    component: MainLayout,
    children: [{ path: '', component: StatsPage, name: 'Player stats' }],
    meta: {
      requiresAuth: true,
      icon: 'query_stats',
    },
  },

  {
    path: '/friends',
    component: MainLayout,
    children: [{ path: '', component: FriendsPage, name: 'Friends' }],
    meta: {
      requiresAuth: true,
      icon: 'group',
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
