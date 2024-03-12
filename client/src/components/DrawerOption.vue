<template>
  <q-item clickable tag="a" :to="endpoint">
    <q-item-section avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
export interface DrawerOptionProps {
  title: string;
  icon: string;
  caption?: string;
  endpoint?: string;
}
withDefaults(defineProps<DrawerOptionProps>(), {
  caption: '',
  endpoint: '#',
  icon: '',
});
</script>
