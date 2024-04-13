<template>
    <q-virtual-scroll v-if="achs.length" class="achievement-card-list" :items="achs" v-slot="{index, item}" separator>
        <AchievementCard
            :key="item.apiName || index"
            :appName="item.appName"
            :name="item.name" 
            :completion="item.globalCompletionPercentage"
        />
    </q-virtual-scroll>
</template>

<style scoped>
    .achievement-card-list {
        height: calc(100vh - 300px);
    }
</style>

<script setup lang="ts">
import { IAchievementMetadata } from '../models';
import AchievementCard from '../cards/AchievementCard.vue';

defineProps<{achs: IAchievementMetadata[]}>()
</script>
