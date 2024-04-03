<template>
    <q-card bordered class="achievement-card">
        <!-- id upper left corner -->
        <q-card-section class="achievement-card-section app-name">
            <span>{{ appName }}</span>
        </q-card-section>
        <!-- name center -->
        <q-card-section v-if="name" class="achievement-card-section achievement-name">
            {{ name }}
        </q-card-section>
        <q-card-section v-if="unlockedAt" class="achievement-card-section achievement-unlock-time">
            Unlock time: {{ formatDate(unlockedAt, 'dd/MM/yyyy hh:mm') }}
        </q-card-section>
    </q-card>
</template>


<script setup lang="ts">

import { formatDate } from 'date-fns';
interface ComponentProps {
    appName: string,
    name: string,
    unlockedAt?: Date
}
const props = defineProps<ComponentProps>()

</script>

<style scoped>
    .achievement-card-section {
        padding: 0;
    }
    .achievement-card {
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
        place-self: center
    }

    .achievement-unlock-time {
        grid-row: 3;
        grid-column: span 3;
        place-self: center end;
        color: grey
    }
</style>
