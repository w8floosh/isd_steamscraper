<template>
    <q-virtual-scroll :items="apps" v-slot="{index: id, item: app}" separator>
        <AppCard :key="id" 
            :id="app.id" 
            :name="app.name" 
            :lastUpdate="app.lastUpdate" 
        />
    </q-virtual-scroll>
</template>

<style scoped>
    .app-card-list {
        display: flex;
        gap: 4px;
        flex-direction: column;
        justify-content: space-between;
    }
</style>

<script setup lang="ts">
import { computed } from 'vue';
import { IAppMetadata } from '../models';
import AppCard from '../cards/AppCard.vue';
const props = defineProps<{apps: IAppMetadata[]}>()

const apps = computed(() => props.apps)
</script>
