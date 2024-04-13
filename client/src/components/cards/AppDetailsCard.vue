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
        <q-card-section class="app-details-card-section">
            <div style="place-self: center">Genres</div>
            <q-chip outline class="app-genres" v-for="genre in details.genres" :key="genre.id" :label="genre.description"/>
        </q-card-section>
        <!-- last update bottom right -->
        <q-card-section class="app-details-card-section">
            <div style="place-self: center">Categories</div>
            <q-chip outline class="app-categories" v-for="category in details.categories" :key="category.id" :label="category.description"/>
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
        height: 174px;
        padding: 8px;
        width: auto;
        grid-template-columns: 1fr 174px;
        grid-template-rows: 64px 128px;
    }

    .app-price-overview {
        grid-column: 2;
        grid-row: 1;
        place-self: right;
        display: grid;
        grid-template-columns: 1fr 2fr;
        grid-template-rows: 1fr 1fr;
    }

    .app-discount {
        grid-row: 1;
        grid-column: 1;
        place-self: end center;
    }

    .app-initial-price {
        grid-row: 2;
        grid-column: 2;
        place-self: end;
        text-decoration: line-through;
    }

    .app-discounted-price {
        grid-row: 1;
        grid-column: 2;
        place-self: end
    }

    .app-genres, .app-categories {
        place-self: center end;
    }
</style>
