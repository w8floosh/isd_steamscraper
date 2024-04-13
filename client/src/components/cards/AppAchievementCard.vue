<template>
    <q-card bordered class="app-achievement-card">
        <!-- id upper left corner -->
        <q-card-section class="app-achievement-card-section app-name">
            <span>{{ achievement.appName }}</span>
        </q-card-section>
        <!-- name center -->
        <q-card-section v-if="achievement.name" class="app-achievement-card-section achievement-name">
            {{ achievement.name }}
        </q-card-section>
        <q-card-section v-if="achievement.unlockTime" class="app-achievement-card-section achievement-unlock-time">
            Unlock time: {{ formatDate(achievement.unlockTime, 'dd/MM/yyyy hh:mm') }}
        </q-card-section>
    </q-card>
</template>


<script setup lang="ts">

import { formatDate } from 'date-fns';
import { IAchievementMetadata } from '../models';
interface ComponentProps {
    achievement: IAchievementMetadata
}
const props = defineProps<ComponentProps>()

</script>

<style scoped>
    .app-achievement-card-section {
        padding: 0;
    }
    .app-achievement-card {
        display: grid;
        height: 64px;
        width: auto;
        padding: 8px;
        grid-template-columns: 128px 1fr 1fr;
        grid-template-rows: 16px 1fr 16px;
    }

    .app-name {
        grid-row: 1;
        grid-column: span 3;
        place-self: center start;
        color: grey;
    }

    .achievement-name {
        grid-row: 2;
        grid-column: span 3;
        place-self: center;
        color: black;
    }

    .achievement-unlock-time {
        grid-row: 3;
        grid-column: span 3;
        place-self: center end;
        color: grey
    }
</style>
