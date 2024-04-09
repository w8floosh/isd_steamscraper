<template>
    <q-card bordered class="app-details-card">
        <!-- id upper left corner -->
        <q-card-section class="app-details-card-section app-price-overview">
            <div v-if="priceOverview && priceOverview.discount_percent" 
                class="app-discount text-red"> 
                -{{ priceOverview.discount_percent }}% OFF!
            </div>
            <div v-if="priceOverview" class="app-initial-price text-h6 text-grey">
                {{ priceOverview.initial_formatted }}
            </div>
            <div class="app-discounted-price text-h4">
                {{ priceOverview? priceOverview.final_formatted : 'free' }}
            </div>
        </q-card-section>
        <!-- name center -->
        <q-card-section class="app-details-card-section app-genres">
            <q-chip outline v-for="genre in details.genres" :key="genre.id" :label="genre.description"/>
        </q-card-section>
        <!-- last update bottom right -->
        <q-card-section class="app-details-card-section app-update">
            <q-chip outline v-for="category in details.categories" :key="category.id" :label="category.description"/>
        </q-card-section>
    </q-card>
</template>

<script setup lang="ts">
import { AppDetails } from 'src/clients/entities'
import { computed } from 'vue';

interface ComponentProps {
    details: AppDetails
}

const props = defineProps<ComponentProps>()
const priceOverview = computed(() => typeof props.details.price_overview === 'string' ? undefined : props.details.price_overview)
</script>

<style scoped>
    .app-details-card-section {
        padding: 0;
    }
    .app-details-card {
        display: grid;
        height: 128px;
        width: auto;
        padding: 8px;
        grid-template-columns: 1fr 192px;
        grid-template-rows: 64px 64px;
    }

    .app-price-overview {
        grid-column: 2;
        grid-row: span 2;
        display: grid;
        grid-template-columns: 1fr 2fr;
        grid-template-rows: 1fr 1fr;
    }

    .app-discount {
        grid-row: 1;
        grid-column: 1;
        place-self: right center;
    }

    .app-initial-price {
        grid-row: 2;
        grid-column: 2;
        place-self: start center;
        text-decoration: line-through;
    }

    .app-discounted-price {
        grid-row: 1;
        grid-column: 2;
        place-self: center
    }

    .app-genres, .app-categories {
        display: flex
    }
</style>

<script setup lang="ts">
import { computed } from 'vue';
import { formatDate } from 'date-fns';
const props = defineProps<{id: number, name: string, lastUpdate?: Date}>()

const id = computed(() => props.id)
const name = computed(() => props.name)
const lastUpdate = computed(() => props.lastUpdate)

</script>
