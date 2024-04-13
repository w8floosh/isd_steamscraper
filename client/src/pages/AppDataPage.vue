<template>
    <q-page class="app-data-page">
        <q-card class="app-data-card bg-primary text-white" flat bordered>
            <q-card-section horizontal class="bg-secondary text-white app-metadata col-2">
                <div class="app-metadata-id text-grey-4">{{ app.id }}</div>
                <div class="app-metadata-name">{{ app.name }}</div>
                <div class="app-players text-grey-4">Current players: {{ appData.players }}</div>
                <div v-if="app.lastUpdate" class="app-metadata-update text-grey-4">Last updated: {{ formatDate(app.lastUpdate, "dd/MM/yyyy") }}</div>
            </q-card-section>  
            <q-card-section horizontal class="app-data text-black col-10">
                <AppDetailsCard v-if="appData.details" class="app-details" :details="appData.details"/>
                <div v-else-if="errors.details">Error retrieving details</div>
                <q-spinner-dots v-else color="white" size="40px" />
                <AppNewsList v-if="appData.news" class="app-news" :news="appData.news"/>
                <div v-else-if="errors.news">Error retrieving news</div>
                <q-spinner-dots v-else color="white" size="40px" />
                <AppAchievementCardList v-if="appData.achievements" class="app-achievements" :achs="appData.achievements"/>
                <div v-else-if="errors.achievements" style="color: white; place-self: center;">Error retrieving achievements</div>
                <q-spinner-dots v-else color="white" size="40px" />
            </q-card-section>  
        </q-card>
    </q-page>
</template>

<script setup lang="ts">
import { IAppData } from 'src/components/models'
import { onBeforeMount, ref } from 'vue';
import { useAppsService } from 'src/composables/useAppsService';
import { formatDate } from 'date-fns';
import AppDetailsCard from 'src/components/cards/AppDetailsCard.vue';
import AppNewsList from 'src/components/lists/AppNewsList.vue';
import AppAchievementCardList from 'src/components/lists/AppAchievementCardList.vue';
import { useStateStore } from 'src/stores/state';
import { storeToRefs } from 'pinia';

const { getAppData, errors } = useAppsService()
const { app } = storeToRefs(useStateStore())

const appData = ref<IAppData>({
    meta: app.value,
})

onBeforeMount(async() => {
    const appDetails = await getAppData(app.value)
    appData.value = appDetails
})
</script>

<style scoped>
.app-data-page {
    padding: 16px;
    width: auto;
    height: auto;
}
.app-data-card {
    position: relative;
    padding: 16px;
    height: calc(100vh - 150px)
}
.app-metadata {
    padding: 16px;
    display: grid;
    grid-template-rows: 1fr 2fr 1fr;
    grid-template-columns: 1fr 1fr;
}
.app-metadata-id {
    padding: 4px;
    grid-row: 1;
    grid-column: 1;
    place-self: bottom center
}
.app-metadata-name {
    padding: 4px;
    grid-row: 2;
    grid-column: span 2;
    font-size: 32px;
    place-self: center;
}
.app-metadata-update {
    padding: 4px;
    grid-row: 3;
    grid-column: 2;
    place-self: center right;
}
.app-players {
    padding: 4px;
    grid-row: 3;
    grid-column: 1;
    place-self: center left;
}
.app-data {
    padding: 8px 0 0 0 ;
    display: grid;
    grid-template-rows: 192px 1fr;
    grid-template-columns: 1fr 1fr;
}
.app-details {
    height: 100%;
    grid-row: 1;
    grid-column: span 2;
}
.app-achievements {
    margin: 8px 0 0 0;
    grid-row: 2;
    grid-column: 1;
    height: calc(100vh - 530px);
}   
.app-news {
    margin: 8px 0 0 0;
    grid-row: 2;
    grid-column: 2;
    height: calc(100vh - 530px);
    width: 100%
}
</style>