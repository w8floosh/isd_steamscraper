<template>
    <q-page class="apps-page">
        <q-card>
            <q-card-section class="bg-primary text-white">
                <AppCardList v-if="appList.length" :apps="appList"/>
                <q-spinner-dots v-else color="white" size="40px"/>
            </q-card-section>
        </q-card>
    </q-page>
</template>

<script setup lang="ts">
import { IAppMetadata } from 'src/components/models';
import AppCardList from 'src/components/lists/AppCardList.vue';
import { onMounted, ref } from 'vue';
import { useAppsService } from 'src/composables/useAppsService';

const appList = ref<IAppMetadata[]>([])
const { getAppList } = useAppsService()
onMounted(async() => {
    const list = await getAppList()
    appList.value = Object.entries(list).map<IAppMetadata>(([id, app]) => ({id: parseInt(id), name: app.name, lastUpdate: new Date(app.last_modified * 1000)}))
})


</script>

<style scoped>
    .apps-page {
        padding: 16px;
        width: auto;
        height: auto;
    }
</style>