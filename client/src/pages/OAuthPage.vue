<template>
    <q-page class="row items-center justify-evenly">
        <h3>Logging in...</h3>
        <q-circular-progress
            indeterminate
            rounded
            size="50px"
            color="lime"
            class="q-ma-md"
        />
    </q-page>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAuthStore } from 'stores/auth';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const { user, clientState, authCode } = storeToRefs(useAuthStore());
const { authorize } = useAuthStore(); 
const router = useRouter()


onMounted(async() => {
    const tokens = await authorize(authCode.value, clientState.value, window.location.href);
    clientState.value = '';
    authCode.value = '';
    user.value.accessToken = tokens.data.access_token;
    user.value.refreshToken = tokens.data.refresh_token;
    router.push('/')
})
</script>