<template>
    <q-page class="app-data-page">
        <q-card class="app-data-card" flat bordered>
            <q-card-section horizontal class="bg-primary text-white app-info col-2">
                <div class="app-id text-grey-5">{{ app.id }}</div>
                <div class="app-name">{{ app.name }}</div>
                <div class="app-players text-grey-5">Current players: {{ appData.players }}</div>
                <div v-if="app.lastUpdate" class="app-update text-grey-5">Last updated: {{ app.lastUpdate }}</div>
            </q-card-section>  
            <q-card-section horizontal class="text-black col-10">
                <AppDetailsCard class="app-details" :details="appData.details"/>
                <AppNewsList class="app-news" :news="appData.news"/>
                <AppAchievementsList class="app-achievements" :achievements="appData.achievements"/>
            </q-card-section>  
        </q-card>
    </q-page>
</template>

<script setup lang="ts">
import { IAppMetadata } from 'src/components/models';
import { IAppData } from 'src/components/models'
import { onBeforeMount, ref } from 'vue';
import { useAppsService } from 'src/composables/useAppsService';

interface ComponentProps {
    app: IAppMetadata
}

const { getAppData } = useAppsService()

const props = defineProps<ComponentProps>()
const appData = ref<IAppData>({
    meta: props.app
})

onBeforeMount(async() => {
    const appDetails = await getAppData(props.app)
    appData.value = appDetails
})
</script>

<style scoped>
.app-metadata {
    padding: 16px;
    display: grid;
    grid-template-rows: 1fr 2fr 1fr
}
.app-metadata-id {
    padding: 4px;
    grid-row: 1;
    place-self: bottom center
}
.app-metadata-name {
    padding: 4px;
    grid-row: 2;
    font-size: 32px;
    place-self: center;
}
.app-metadata-update {
    padding: 4px;
    grid-row: 3;
    place-self: bottom;
}

</style>