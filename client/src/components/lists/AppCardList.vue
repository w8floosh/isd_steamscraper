<template>
    <q-virtual-scroll class="app-card-list" :items="apps" v-slot="{index: id, item: app}" separator>
        <AppCard :key="id"
            :id="app.id"
            :name="app.name"
            :lastUpdate="app.lastUpdate" 
        />
    </q-virtual-scroll>
</template>

<style scoped>
    .app-card-list {
        max-height: calc(100vh - 300px);
    }
</style>

<script setup lang="ts">
import { computed } from 'vue';
import { IAppMetadata } from '../models';
import AppCard from '../cards/AppCard.vue';
const props = defineProps<{apps: IAppMetadata[]}>()

const apps = computed(() => props.apps)
</script>
