<template>
    <q-infinite-scroll @load="onLoad" :offset="250" class="achievement-card-list">
        <div v-for="(item, index) in achievements" :key="item.apiName || index">
            <AchievementCard
                :appName="item.appName"
                :name="item.name" 
                :unlockedAt="item.unlockTime"
            />
        </div>
        <template v-slot:loading>
            <div class="row justify-center q-my-md">
                <q-spinner-dots color="primary" size="40px" />
            </div>
        </template>
    </q-infinite-scroll>
</template>

<style scoped>
    .achievement-card-list {
        height: calc(100vh - 300px);
    }
</style>

<script setup lang="ts">
import { OwnedGame } from 'src/clients/entities';
import { computed, ref } from 'vue';
import { IAchievementMetadata, IAppMetadata } from '../models';
import AchievementCard from '../cards/AchievementCard.vue';

const props = defineProps<{games: IAppMetadata[], loadCallback: <T>() => Promise<T | undefined>}>()

const achievements = ref<IAchievementMetadata[]>([])
const lastApp = computed(() => achievements.value.length? achievements.value[achievements.value.length - 1].appName : '')

const onLoad = () => {
    const startIndex = props.games.findIndex(game => game.name === lastApp.value);
    const endIndex = startIndex + 10;
    const slicedGames = props.games.slice(startIndex, Math.min(endIndex, props.games.length));
    achievements.value.push(slicedGames.map(game => loadCallback(game.id)))
    // Use slicedGames as needed
}


</script>
