<template>
    <q-virtual-scroll class="app-news-list" :items="newsItems" v-slot="{index: id, item: news}" separator>
        <AppNewsCard :key="id"
            :gid="news.gid"
            :title="news.title"
            :author="news.author" 
            :content="news.contents"
            :publishDate="news.date"
        />
    </q-virtual-scroll>
</template>

<style scoped>
    .app-news-list {
        height: calc(100vh - 150px);
    }
</style>

<script setup lang="ts">
import { computed } from 'vue';
import AppNewsCard from '../cards/AppNewsCard.vue';
import { AppNews } from 'src/clients/entities';
const props = defineProps<{news: AppNews[]}>()

const newsItems = computed(() => props.news)
</script>
