<template>
    <q-card bordered class="app-news bg-accent">
        <!-- id upper left corner -->
        <q-card-section class="app-news-section news-gid text-grey-4">
            <span>{{ gid }}</span>
        </q-card-section>
        <!-- name center -->
        <q-card-section class="app-news-section news-title text-white">
            {{ title }}
        </q-card-section>

        <q-card-section class="app-news-section news-content text-white">
            {{ showFull? content : content.substring(0, 100).concat('...') }}
            <span v-if="!showFull" class="text-grey-4" @click="expand">Show more</span>
            <span v-else class="text-grey-4" @click="collapse">Show less</span>
        </q-card-section>

        <q-card-section class="app-news-section news-author text-grey-4">
            {{ author }}
        </q-card-section>

        <!-- last update bottom right -->
        <q-card-section v-if="date" class="app-news-section news-date text-grey-4">
            Published on: {{ formatDate(date, "dd/MM/yyyy") }}
        </q-card-section>
    </q-card>
</template>

<style scoped>
    .app-news-section {
        padding: 0;
    }
    .app-news {
        display: grid;
        min-height: 256px;
        width: auto;
        padding: 8px;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 32px 1fr 32px;
    }

    .news-gid {
        grid-row: 3;
        grid-column: 1;
        place-self: center start;
        color: grey
    }

    .news-title {
        grid-row: 1;
        grid-column: span 3;
        place-self: center;
        color: black;
    }

    .news-content {
        grid-row: 2;
        grid-column: span 3;
        place-self: center;
        color: white
    }

    .news-author {
        grid-row: 3;
        grid-column: 3;
        place-self: center right;
        color: grey
    }

    .news-date {
        grid-row: 3;
        grid-column: 2;
        place-self: center;
        color: grey
    }
</style>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { formatDate } from 'date-fns';


const props = defineProps<{
    gid: string, 
    title: string, 
    author: string,
    content: string,
    publishDate?: number
}>()


const showFull = ref(false)

const expand = () => showFull.value = true;
const collapse = () => showFull.value = false;

const date = computed(() => props.publishDate? new Date(props.publishDate * 1000): new Date())


</script>
