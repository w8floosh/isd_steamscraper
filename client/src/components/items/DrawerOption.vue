<template>
  <q-item clickable tag="a" :to="props.endpoint">
    <q-item-section avatar>
      <q-icon :name="props.icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ props.title }}</q-item-label>
      <q-item-label caption>{{ props.caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { IDrawerOption } from 'src/components/models';

const props = withDefaults(defineProps<IDrawerOption>(), {
  caption: '',
  endpoint: '#',
  icon: '',
});
</script>
