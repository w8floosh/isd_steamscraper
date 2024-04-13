<template>
    <q-virtual-scroll v-if="entries.length" class="leaderboard_entry_card_list" :items="entries" v-slot="{index, item}" separator>
        <LeaderboardsEntryCard
            :key="index"
            :position="index+1"
            :username="item.username" 
            :steamId="item.steamId"
            :score="item.score"
            :scoreType="scoreType"
        />
    </q-virtual-scroll>
</template>

<style scoped>
    .leaderboard_entry_card_list {
        height: calc(100vh - 300px);
    }
</style>

<script setup lang="ts">

import { ILeaderboardEntry } from '../models';
import LeaderboardsEntryCard from '../cards/LeaderboardsEntryCard.vue';

defineProps<{entries: ILeaderboardEntry[], scoreType?: string}>()
</script>
