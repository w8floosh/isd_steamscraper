<template>
    <q-card clickable bordered :class="['entry-card', computedCardColor]" @click="goToUserPage">
        <q-card-section v-if="medalAwarded" class="entry-card-section entry-medal">
            <q-icon class="medal-outlined" name="emoji_events" :color="computedMedalColor" size="lg"/>
        </q-card-section>
        <q-card-section v-else class="entry-card-section entry-position text-h5 text-white">
            {{ position }}
        </q-card-section>
        <q-card-section :class="['entry-card-section', 'entry-user', 'text-h3', computedTextColor]">
            {{ username.length > 15? `${username.slice(0, 25)}...` : username }}
        </q-card-section>
        <q-card-section class="entry-card-section entry-steamid text-grey-4">
            {{ steamId }}
        </q-card-section>
        <q-card-section class="entry-card-section entry-score text-h6">     
            {{ scoreType? `${score} ${scoreType}` : score.toPrecision(8) }}
        </q-card-section>
    </q-card>
</template>

<style scoped>
    .entry-card-section {
        padding: 0;
    }
    .entry-card {
        display: grid;
        height: 128px;
        width: auto;
        padding: 8px;
        grid-template-columns: 64px 1fr 64px;
        grid-template-rows: 16px 2fr 1fr 16px;
    }
    
    .entry-steamid {
        grid-row: 1;
        grid-column: 1;
        place-self: start start;
    }

    .entry-medal, .entry-position {
        grid-column: 1;
        grid-row: 2 / span 2;
        place-self: center;
    }

    .entry-user {
        grid-column: 2;
        grid-row: 2;
        place-self: center;
    }

    .entry-score {
        grid-row: 3;
        grid-column: 2;
        place-self: start center;
    }
    .medal-outlined {
        font-variation-settings:
            'FILL' 0,
            'wght' 400,
            'GRAD' 0,
            'opsz' 24
    }
</style>
<style scoped lang="scss">
    .text-gold {
        color: $gold;
    }
    .bg-gold {
        background-color: $gold;
    }
    .text-silver {
        color: $silver;
    }
    .bg-silver {
        background-color: $silver;
    }
    .text-bronze {
        color: $bronze;
    }
    .bg-bronze {
        background-color: $bronze;
    }
</style>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { ILeaderboardEntry } from '../models';
import { useAuthStore } from 'src/stores/auth';
import { storeToRefs } from 'pinia';

const props = defineProps<ILeaderboardEntry & {position: number, scoreType?: string}>()

const { steamId: currentUser } = storeToRefs(useAuthStore())

const router = useRouter()
const medalAwarded = computed(() => props.position <= 3)
const computedCardColor = computed(() => props.steamId === currentUser.value ? 'bg-positive' : 'bg-accent')
const computedTextColor = computed(() => props.position === 1 ? 'text-gold' : props.position === 2 ? 'text-silver' : props.position === 3 ? 'text-bronze' : 'text-white')
const computedMedalColor = computed(() => props.position === 1 ? 'gold' : props.position === 2 ? 'silver' : 'bronze')

const goToUserPage = () => {
    router.push(`/user/${props.steamId}`)
}

</script>
