<template>
    <q-card bordered class="gcinfo-card">
        <!-- id upper left corner -->
        <q-card-section v-if="id" class="gcinfo-card-section gcinfo-id">
            <span>{{ id }}</span>
        </q-card-section>
        <!-- name center -->
        <q-card-section class="gcinfo-card-section gcinfo-desc">
            {{ description }}
        </q-card-section>
        <!-- last update bottom right -->
        <q-card-section class="gcinfo-card-section gcinfo-playtime">
            {{ minutesToPlaytime(playtime) }} played
        </q-card-section>
    </q-card>
</template>

<style scoped>
    .gcinfo-card-section {
        padding: 0;
    }
    .gcinfo-card {
        display: grid;
        height: 64px;
        width: auto;
        padding: 8px;
        grid-template-columns: 64px 1fr 1fr;
        grid-template-rows: 16px 1fr 16px;
    }

    .gcinfo-id {
        grid-row: 1;
        grid-column: 1;
        place-self: start start;
        color: grey
    }

    .gcinfo-desc {
        grid-row: 2;
        grid-column: span 3;
        place-self: center;
        color: black;
    }

    .gcinfo-playtime {
        grid-row: 3;
        grid-column: span 3;
        place-self: center self-end;
        color: grey
    }
</style>

<script setup lang="ts">
import { computed } from 'vue';
import { useDateUtils } from 'src/composables/useDateUtils';
const props = defineProps<{description: string, playtime: number, id?: number}>()

const { minutesToPlaytime } = useDateUtils()
const id = computed(() => props.id)
const description = computed(() => props.description)
const playtime = computed(() => props.playtime)

</script>
