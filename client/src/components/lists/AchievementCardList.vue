<template>
    <q-virtual-scroll class="achievement-card-list" :items="achievements" v-slot="{index: id, item: ach}" separator>
        <AchievementCard :key="id" 
            :appName="ach.appName"
            :name="ach.name" 
            :unlockedAt="ach.unlockTime"
        />
    </q-virtual-scroll>
</template>

<style scoped>
    .achievement-card-list {
        max-height: calc(100vh - 300px);
    }
</style>

<script setup lang="ts">
import { computed } from 'vue';
import { IAchievementMetadata } from '../models';
import AchievementCard from '../cards/AchievementCard.vue';
const props = defineProps<{achievements: IAchievementMetadata[]}>()

const achievements = computed(() => props.achievements)
</script>
