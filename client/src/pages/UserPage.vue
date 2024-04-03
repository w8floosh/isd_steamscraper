<template>
    <q-card class="user-page">
        <q-card-section class="bg-primary text-white user-metadata">
            <div class="user-metadata-name">{{ name }}</div>
            <div class="user-metadata-email text-grey-5">{{ email }}</div>
            <div class="user-metadata-token text-grey-5">Steam Web API token: {{ steamWebAPIToken }}</div>
        </q-card-section>
        <q-card-section class="user-content">
            <q-tabs
            v-model="tab"
            dense
            class="bg-grey-2 text-grey-7"
            active-color="primary"
            indicator-color="purple"
            align="justify"
            >
                <q-tab name="friends" label="Friends" />
                <q-tab name="games" label="Library" />
                <q-tab name="achievements" label="Achievements" />
                <q-tab name="favorites" label="Favorites" />
            </q-tabs>
            <q-tab-panels v-model="tab" animated class="bg-primary text-white">
                
                <q-tab-panel name="friends">
                    <PlayerCardList v-if="userData.friends?.length" :players="userData.friends"/>
                    <div v-else>No friends found</div>
                </q-tab-panel>

                <q-tab-panel name="games">
                    <q-splitter v-model="split">
                        <template v-slot:before>
                            <q-tabs
                            v-model="tab"
                            dense
                            class="bg-grey-2 text-grey-7"
                            active-color="primary"
                            indicator-color="purple"
                            align="justify"
                            >
                                <q-tab name="allGames" label="All"/>
                                <q-tab name="recentGames" label="Recently played"/>
                                <q-tab name="forgottenGames" label="Forgotten"/>
                            </q-tabs>
                        </template>
                        <template v-slot:after>
                            <q-tab-panels v-model="gamesTab" animated class="bg-primary text-white">
                                <q-tab-panel name="allGames">
                                    <AppCardList v-if="userData.games?.length" :apps="userData.games"/>
                                    <div v-else>No games found</div>
                                </q-tab-panel>
                                <q-tab-panel name="recentGames">
                                    <AppCardList v-if="userData.recent?.length" :apps="userData.recent"/>
                                    <div v-else>No games played recently</div>
                                </q-tab-panel>
                                <q-tab-panel name="forgottenGames">
                                    <AppCardList v-if="userData.forgotten?.length" :apps="userData.forgotten"/>
                                    <div v-else>No games found</div>
                                </q-tab-panel>
                            </q-tab-panels>
                        </template>
                    </q-splitter>
                </q-tab-panel>
                
                <q-tab-panel name="achievements">
                    <AchievementCardList v-if="userData.achievements?.length" :achievements="userData.achievements"/>
                    <div v-else>No achievements unlocked</div>
                </q-tab-panel>

                <q-tab-panel name="favorites">
                    <AppCardList v-if="userData.recent?.length" :apps="userData.recent"/>
                    <div v-else>No content</div>
                </q-tab-panel>
            </q-tab-panels>
        </q-card-section>
    </q-card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useUserTabs } from '../composables/useUserTabs';
import { UserData, UserTab, UserGamesTab } from '../composables/types'
import { useAuthStore } from 'src/stores/auth';
import { storeToRefs } from 'pinia';
import PlayerCardList from 'src/components/lists/PlayerCardList.vue';
import AppCardList from 'src/components/lists/AppCardList.vue';
import AchievementCardList from 'src/components/lists/AchievementCardList.vue';
import { RecentlyPlayedResponse, FriendListResponse, OwnedGamesResponse, PlayerAchievementsResponse, FavoriteGenresCategoriesResponse } from '../clients/responses'
import { Achievement } from '../clients/entities';
import { IAchievementMetadata } from 'src/components/models';

const tab = ref<UserTab>('games')
const gamesTab = ref<UserGamesTab>('allGames')
const split = ref<number>(20)
const { loadData } = useUserTabs()
const { user } = storeToRefs(useAuthStore())

const name = computed(() => user.value?.name)
const email = computed(() => user.value?.email)
const steamWebAPIToken = computed(() => user.value?.steamWebAPIToken)


const userData = ref<UserData>({
    recent: undefined,
    friends: undefined,
    games: undefined,
    achievements: undefined,
    forgotten: undefined,
    favorite: {
        genres: undefined,
        categories: undefined
    }
})

const load = async <T extends UserTab>(tab: T) => {
    switch (tab){
        case 'friends':
            if (userData.value.friends) return
            const friends = await loadData<FriendListResponse>('friends', user.value.steamId)
            userData.value.friends = friends?.map((friend) => ({
                id: friend.steamid,
                name: friend.steamid.toString(),
                friendSince: new Date(friend.friend_since * 1000)
            }))
            break;
        case 'achievements':
            if (userData.value.achievements) return
            // @TODO: Implement achievements
        
            let achievementsPerGame: Record<string, IAchievementMetadata[]> = {} 
            userData.value.games?.forEach(async (game) => {
                const gameAchs = await loadData<PlayerAchievementsResponse>('achievements', user.value.steamId, game.id)
                if (!gameAchs) return
                const id = game.id.toString()
                if (!gameAchs[id]) return
                achievementsPerGame[id] = gameAchs[id]?.map((ach: Achievement) => ({
                    appName: game.name,
                    name: ach.apiname,
                    unlockTime: new Date(ach.unlocktime * 1000)
                })) as IAchievementMetadata[]
            })
            
            userData.value.achievements = Object.values(achievementsPerGame).reduce((acc, val) => acc.concat(val), [])
            break;
        case 'favorites':
            if (userData.value.favorite.genres && userData.value.favorite.categories) return
            const data = await loadData<FavoriteGenresCategoriesResponse>('favorites', user.value.steamId)
            if (!data) return
            const { genres, categories } = data
            userData.value.favorite.genres = genres?.map(genre => ({
                id: genre.id,
                name: genre.description
            }))

            userData.value.favorite.categories = categories?.map(category => ({
                id: category.id,
                name: category.description
            }))
            break;
        default:
            break;
    }
}

const loadGames = async <T extends UserGamesTab>(tab: T) => {
    switch (tab){
        case 'allGames':
            if (userData.value.games) return
            const games = await loadData<OwnedGamesResponse>('allGames', user.value.steamId, true, true)
            if (!games) return
            userData.value.games = Object.entries(games).map((([id, game]) => ({
                id: parseInt(id),
                name: game.name
            })))
            break;
        case 'recentGames':
            if (userData.value.recent) return
            const recent = await loadData<RecentlyPlayedResponse>('recentGames', user.value.steamId)
            if (!recent) return
            userData.value.recent = Object.entries(recent).map(([id, metadata]) => ({
                id: parseInt(id),
                name: metadata.name,
                img_icon_url: metadata.img_icon_url,
                playtime_forever: metadata.playtime_forever,
                playtime_2weeks: metadata.playtime_2weeks
            }))
            break;
        case 'forgottenGames':
            if (userData.value.forgotten) return
            const forgotten = await loadData<OwnedGamesResponse>('forgottenGames', user.value.steamId, false, true)
            if (!forgotten) return
            userData.value.forgotten = Object.entries(forgotten).map((([id, game]) => ({
                id: parseInt(id),
                name: game.name
            })))
            break;
        default:
            break;
    }

}

watch(tab, async (newTab) => {
    if (newTab === 'games') split.value = 20
    else split.value = 0
    await load(newTab)
}, {immediate: true})

watch(gamesTab, async (newGamesTab) => {
    await loadGames(newGamesTab)
}, {immediate: true})

</script>

<style scoped>
    .user-page {
        width: 100%;
        margin: 16px auto;
        display: grid;
        grid-template-rows: 64px 1fr;
    }
    .user-metadata {
        width: 100%;
        padding: 8px;
        grid-row: 1;
        display: grid;
        grid-template-columns: 1fr 1fr 350px;
    }
    .user-content {
        padding: 8px;
        grid-row: 2;
    }
    .user-metadata-name {
        font-size: 24px;
        place-self: center start;
    }
    .user-metadata-email {
        font-size: 16px;
        place-self: center start;
    }
    .user-metadata-token {
        font-size: 12px;
        place-self: center end;
    }
</style>