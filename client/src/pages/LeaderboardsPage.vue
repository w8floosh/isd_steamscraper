<template>
    <q-page class="leaderboards-page">
        <q-card>
            <q-card-section class="user-content">
                <q-tabs
                    v-model="tab"
                    dense
                    class="bg-grey-2 text-grey-7"
                    active-color="primary"
                    indicator-color="purple"
                    align="justify"
                >
                    <!-- <q-tab name="achievementScore" label="Achievements Score" /> -->
                    <q-tab name="playtime" label="Playtime" />
                    <q-tab name="versatility" label="Versatility" />
                </q-tabs>
            <q-tab-panels v-model="tab" animated class="bg-primary text-white">
<!--                 
                <q-tab-panel name="achievementScore">
                    <LeaderboardEntryCardList v-if="leaderboardsData.achievementScore?.length" 
                        class="achievement-score-leaderboard" 
                        :entries="leaderboardsData.achievementScore" 
                        scoreType="achievements unlocked"/>
                </q-tab-panel> -->

                <q-tab-panel name="playtime">
                    <LeaderboardEntryCardList v-if="leaderboardsData.playtime?.length" 
                        class="playtime-leaderboard" 
                        :entries="leaderboardsData.playtime" 
                        scoreType="minutes played"/>
                    <q-spinner-dots v-else-if="loading" size="40px" color="white"/>
                    <div v-else> {{ tabErrorMessage?? "Cannot retrieve playtime leaderboard" }}</div>
                </q-tab-panel>

                <q-tab-panel name="versatility">
                    <LeaderboardEntryCardList v-if="leaderboardsData.versatility?.length" 
                        class="versatility-leaderboard" 
                        :entries="leaderboardsData.versatility" 
                        />
                    <q-spinner-dots v-else-if="loading" size="40px" color="white"/>
                    <div v-else> {{ tabErrorMessage?? "Cannot retrieve versatility leaderboard" }}</div>
                </q-tab-panel>
            </q-tab-panels>
        </q-card-section>
        </q-card>
    </q-page>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import LeaderboardEntryCardList from 'src/components/lists/LeaderboardEntryCardList.vue';
import { ILeaderboardsData } from 'src/components/models';
import { LeaderboardsTab } from 'src/composables/types';
import { LeaderboardsAPIResponse, SteamAPIError } from 'src/clients/responses';
import { useLeaderboardTabs } from 'src/composables/useLeaderboardTabs';
import { useAuthStore } from 'src/stores/auth';
import { storeToRefs } from 'pinia';
import { useUserService } from 'src/composables/useUserService';

const tab = ref<LeaderboardsTab>('playtime');
const tabErrorMessage = ref<string | null>(null);
const loading = ref(false)

const leaderboardsData = ref<Partial<ILeaderboardsData>>({});
const { steamId } = storeToRefs(useAuthStore())
const { getPlayerSummary } = useUserService()
const { loadData } = useLeaderboardTabs()

const load = async (tab: LeaderboardsTab) => {
    loading.value = true;
    if (leaderboardsData.value[tab]) return
    const data = await loadData<LeaderboardsAPIResponse>(tab, steamId.value)
    if (!data) return
    for (const {steamid, score} of data){
        try {
            const { personaname } = (await getPlayerSummary(steamid))[steamid];
            (leaderboardsData.value[tab] ??= []).push({
                steamId: steamid,
                username: personaname,
                score
            })
        }
        catch { continue }
    }
}

watch(tab, async (newTab) => {
    tabErrorMessage.value = null
    if (!newTab) return
    try {
        await load(newTab)
    }
    catch (e) {
        tabErrorMessage.value = (e as SteamAPIError).message
    }
    finally {
        loading.value = false
    }
}, {immediate: true})

</script>