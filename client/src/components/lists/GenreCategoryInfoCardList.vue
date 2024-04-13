<template>
    <q-virtual-scroll class="gcinfo-card-list" :items="data" v-slot="{index: id, item: gcinfo}" separator>
        <GenreCategoryInfoCard :key="id"
            :id="gcinfo.id"
            :description="gcinfo.description"
            :playtime="gcinfo.playtime" 
        />
    </q-virtual-scroll>
</template>

<style scoped>
    .gcinfo-card-list {
        max-height: calc(100vh - 300px);
    }
</style>

<script setup lang="ts">
import { computed } from 'vue';
import { Category, Genre } from 'src/clients/entities';
import GenreCategoryInfoCard from '../cards/GenreCategoryInfoCard.vue';
const props = defineProps<{
    data: Partial<Genre | Category>[],  
    sort?: 'asc' | 'desc'
}>()

const data = computed(() => {
    if (props.sort)
        return props.data.toSorted(
            (a,b) => b.playtime && a.playtime? 
                (props.sort === 'asc'? a.playtime - b.playtime : b.playtime - a.playtime) : 0
        )
    else return props.data
})
</script>
