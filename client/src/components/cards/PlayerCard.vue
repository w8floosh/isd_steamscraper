<template>
    <q-card clickable bordered class="player-card" @click="$router.push(`/user/${id}`)">
        <!-- id upper left corner -->
        <q-card-section class="player-card-section player-id">
            <span>{{ id }}</span>
        </q-card-section>
        <!-- name center -->
        <q-card-section v-if="name" class="player-card-section player-name">
            {{ name }}
        </q-card-section>
        <q-card-section v-if="friendSince" class="player-card-section player-friend-since">
            Friend since: {{ formatDate(friendSince, 'dd/MM/yyyy hh:mm') }}
        </q-card-section>
    </q-card>
</template>


<script setup lang="ts">

import { formatDate } from 'date-fns';
interface ComponentProps {
    id: string,
    name?: string,
    friendSince?: Date
}
const props = defineProps<ComponentProps>()

</script>

<style scoped>
    .player-card-section {
        padding: 0;
    }
    .player-card {
        display: grid;
        height: 64px;
        width: auto;
        padding: 8px;
        grid-template-columns: 64px 1fr 1fr;
        grid-template-rows: 16px 1fr 16px;
    }
    .player-id {
        grid-row: 1;
        grid-column: span 2;
        place-self: center start;
        color: grey
    }

    .player-name {
        grid-row: 2;
        grid-column: span 3;
        place-self: center;
        color: black
    }

    .player-friend-since {
        grid-row: 3;
        grid-column: span 3;
        place-self: center end;
        color: grey
    }
</style>
