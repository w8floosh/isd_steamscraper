import { RouteRecordRaw } from 'vue-router';
import MainLayout from 'layouts/MainLayout.vue';
import StatsPage from 'pages/StatsPage.vue';
import UserPage from 'pages/UserPage.vue';
import AuthPage from 'pages/AuthPage.vue';
import LeaderboardsPage from 'pages/LeaderboardsPage.vue';
import IndexPage from 'pages/IndexPage.vue';
import AppPage from 'pages/AppPage.vue';
import ErrorNotFound from 'pages/ErrorNotFound.vue';
import FriendsPage from 'src/pages/FriendsPage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    children: [{ path: '', component: IndexPage }],
  },

  {
    path: '/auth',
    component: MainLayout,
    children: [{ path: '', component: IndexPage }],
    props: { auth: 'true' },
  },

  {
    path: '/me',
    component: MainLayout,
    children: [{ path: '', component: UserPage }],
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: '/apps',
    component: MainLayout,
    children: [{ path: '', component: AppPage }],
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: '/stats',
    component: MainLayout,
    children: [{ path: '', component: StatsPage }],
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: '/friends',
    component: MainLayout,
    children: [{ path: '', component: FriendsPage }],
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: '/leaderboards',
    component: MainLayout,
    children: [{ path: '', component: LeaderboardsPage }],
    meta: {
      requiresAuth: true,
    },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: ErrorNotFound,
  },
];

export default routes;
