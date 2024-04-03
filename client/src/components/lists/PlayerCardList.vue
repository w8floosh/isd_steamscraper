<template>
    <q-virtual-scroll class="player-card-list" :items="players" v-slot="{index: id, item: player}" separator>
        <PlayerCard :key="id" 
            :id="player.id" 
            :name="player.name" 
            :friendSince="player.friendSince"
        />
    </q-virtual-scroll>
</template>

<style scoped>
    .player-card-list {
        max-height: calc(100vh - 300px);
    }
</style>

<script setup lang="ts">
import { computed } from 'vue';
import { IPlayerMetadata } from '../models';
import PlayerCard from '../cards/PlayerCard.vue';
const props = defineProps<{players: IPlayerMetadata[]}>()

const players = computed(() => props.players)
</script>
