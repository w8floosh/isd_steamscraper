<template>
    <q-card clickable bordered class="app-card" @click="$router.push(`/${id}`)">
        <!-- id upper left corner -->
        <q-card-section class="app-card-section app-id">
            <span>{{ id }}</span>
        </q-card-section>
        <!-- name center -->
        <q-card-section class="app-card-section app-name">
            {{ name }}
        </q-card-section>
        <!-- last update bottom right -->
        <q-card-section class="app-card-section app-update">
            Last updated: {{ formatDate(lastUpdate, "dd MMM yyyy hh:mm") }}
        </q-card-section>
    </q-card>
</template>

<style scoped>
    .app-card-section {
        padding: 0;
    }
    .app-card {
        display: grid;
        height: 128px;
        max-width: 400px;
        padding: 8px;
        grid-template-columns: 64px 1fr 1fr;
        grid-template-rows: 16px 1fr 16px;
    }

    .app-id {
        grid-row: 1;
        grid-column: 1;
        place-self: start start;
        color: grey
    }

    .app-name {
        grid-row: 2;
        grid-column: span 3;
        place-self: center
    }

    .app-update {
        grid-row: 3;
        grid-column: span 3;
        place-self: center self-end;
        color: grey
    }
</style>

<script setup lang="ts">
import { computed } from 'vue';
import { formatDate } from 'date-fns';
const props = defineProps<{id: number, name: string, lastUpdate: Date}>()

const id = computed(() => props.id)
const name = computed(() => props.name)
const lastUpdate = computed(() => props.lastUpdate)

</script>
