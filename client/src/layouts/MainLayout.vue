<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> SteamScraper </q-toolbar-title>

        <div>
          <q-chip
            v-if="authenticated"
            style="background-color: transparent"
            dark
          >
            <q-avatar dense color="black">{{
              user.name[0].toUpperCase()
            }}</q-avatar>
            {{ user.name }}
          </q-chip>
          <q-btn v-else label="login" @click="switchLoginDialog" />
          {{ authenticated }}
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Navigation menu </q-item-label>

        <EssentialLink v-for="link in links" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
      <LoginDialog
        v-if="loginDialogOpened"
        v-model="loginDialogOpened"
        @confirm="signIn"
        @update:model-value="loginDialogOpened = false"
      />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAuthStore } from 'stores/auth';
import EssentialLink, {
  EssentialLinkProps,
} from 'components/EssentialLink.vue';
import LoginDialog from 'components/dialogs/LoginDialog.vue';
import { UserCredentials } from 'src/composables/types';
import { storeToRefs } from 'pinia';

const { signin } = useAuthStore();
const { user, authenticated, loading } = storeToRefs(useAuthStore());

const props = withDefaults(defineProps<{ auth?: string }>(), {
  auth: 'false',
});

const loginDialogOpened = ref(props.auth == 'true');

const avatarText = ref('');

const signIn = async (credentials: UserCredentials) => {
  if (!loading.value) {
    await signin(credentials);
    avatarText.value = user.value.name[0];
  }
};

const switchLoginDialog = () =>
  (loginDialogOpened.value = !loginDialogOpened.value);

const publicEssentialLinks: EssentialLinkProps[] = [
  {
    title: 'Homepage',
    icon: 'home',
    endpoint: '/',
  },
];

const restrictedEssentialLinks: EssentialLinkProps[] = [
  {
    title: 'Stats',
    caption: 'See your personal stats',
    icon: 'person',
    endpoint: '/me',
  },
  {
    title: 'App data',
    caption: 'Get all details and news about a game',
    icon: 'games',
    endpoint: '/apps',
  },
  {
    title: 'Friends',
    caption: 'Show your friend list',
    icon: 'chat',
    endpoint: '/friends',
  },
  {
    title: 'Leaderboards',
    caption: 'Who is the best among you and your friends?',
    icon: 'public',
    endpoint: '/leaderboards',
  },
];
const leftDrawerOpen = ref(false);

const links = computed(() =>
  authenticated.value
    ? publicEssentialLinks.concat(...restrictedEssentialLinks)
    : publicEssentialLinks
);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
