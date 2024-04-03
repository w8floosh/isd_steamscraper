<template>
    <q-page class="apps-page">
        <AppCardList :apps="apps"/>
    </q-page>
</template>

<script setup lang="ts">
import { IAppMetadata } from 'components/models';
import AppCardList from 'components/lists/AppCardList.vue';

const apps: IAppMetadata[] = [
    {
        id: 10,
        name: 'pippo',
        lastUpdate: new Date()
    },
    {
        id: 20,
        name: 'pluto',
        lastUpdate: new Date()
    },
    {
        id: 30,
        name: 'paperino',
        lastUpdate: new Date()
    },
    {
        id: 40,
        name: 'diabolik',
        lastUpdate: new Date()
    },
    {
        id: 50,
        name: 'nome molto molto molto molto lungo',
        lastUpdate: new Date()
    },
    {
        id: 10,
        name: 'pippo',
        lastUpdate: new Date()
    },
    {
        id: 20,
        name: 'pluto',
        lastUpdate: new Date()
    },
    {
        id: 30,
        name: 'paperino',
        lastUpdate: new Date()
    },
    {
        id: 40,
        name: 'diabolik',
        lastUpdate: new Date()
    },
    {
        id: 50,
        name: 'nome molto molto molto molto lungo',
        lastUpdate: new Date()
    },
    {
        id: 10,
        name: 'pippo',
        lastUpdate: new Date()
    },
    {
        id: 20,
        name: 'pluto',
        lastUpdate: new Date()
    },
    {
        id: 30,
        name: 'paperino',
        lastUpdate: new Date()
    },
    {
        id: 40,
        name: 'diabolik',
        lastUpdate: new Date()
    },
    {
        id: 50,
        name: 'nome molto molto molto molto lungo',
        lastUpdate: new Date()
    },
    {
        id: 10,
        name: 'pippo',
        lastUpdate: new Date()
    },
    {
        id: 20,
        name: 'pluto',
        lastUpdate: new Date()
    },
    {
        id: 30,
        name: 'paperino',
        lastUpdate: new Date()
    },
    {
        id: 40,
        name: 'diabolik',
        lastUpdate: new Date()
    },
    {
        id: 50,
        name: 'nome molto molto molto molto lungo',
        lastUpdate: new Date()
    },
    {
        id: 10,
        name: 'pippo',
        lastUpdate: new Date()
    },
    {
        id: 20,
        name: 'pluto',
        lastUpdate: new Date()
    },
    {
        id: 30,
        name: 'paperino',
        lastUpdate: new Date()
    },
    {
        id: 40,
        name: 'diabolik',
        lastUpdate: new Date()
    },
    {
        id: 50,
        name: 'nome molto molto molto molto lungo',
        lastUpdate: new Date()
    },
    {
        id: 10,
        name: 'pippo',
        lastUpdate: new Date()
    },
    {
        id: 20,
        name: 'pluto',
        lastUpdate: new Date()
    },
    {
        id: 30,
        name: 'paperino',
        lastUpdate: new Date()
    },
    {
        id: 40,
        name: 'diabolik',
        lastUpdate: new Date()
    },
    {
        id: 50,
        name: 'nome molto molto molto molto lungo',
        lastUpdate: new Date()
    },

]

</script>

<style scoped>
    .apps-page {
        padding: 16px;
        width: auto;
        height: auto;
    }
</style>