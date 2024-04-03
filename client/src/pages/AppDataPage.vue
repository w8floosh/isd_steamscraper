<template>
    <q-page class="app-data-page">
        <q-card class="app-data-card" flat bordered>
            <q-card-section horizontal class="bg-primary text-white app-metadata col-2">
                <div class="app-metadata-id text-grey-5">{{ app.id }}</div>
                <div class="app-metadata-name">{{ app.name }}</div>
                <div v-if="app.lastUpdate" class="app-metadata-update text-grey-5">Last updated: {{ app.lastUpdate }}</div>
            </q-card-section>  
            <q-card-section horizontal class="text-black app-details col-10">
                <div class="app-metadata-id text-grey-5">Current players: {{ appData.players }}</div>
                <div class="app-metadata-name">{{ appData. }}</div>
                <div v-if="app.lastUpdate" class="app-metadata-update text-grey-5">Last updated: {{ app.lastUpdate }}</div>
            </q-card-section>  
        </q-card>
    </q-page>
</template>

<script setup lang="ts">
import { IAppMetadata } from 'components/models';
import { IAppData } from 'components/models'
import { onBeforeMount, ref } from 'vue';
import { useAppsService } from 'composables/useAppsService';

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