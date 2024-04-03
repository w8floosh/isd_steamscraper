<template>
    <q-dialog v-model="open" persistent>
    <q-card class="message-popup">
      <q-card-section :class="titleClass">
        <div class="text-h6">{{ title }}</div>
      </q-card-section>
      <q-card-section class="message">
        <div>{{ message }}</div>
      </q-card-section>

      <q-card-actions align="right" class="buttons">
        <q-btn label="OK" class="text-primary" flat @click="$emit('confirm')" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type ComponentProps = {
    modelValue: boolean
    title: string,
    message: string,
    error: boolean,
}
const props = withDefaults(defineProps<ComponentProps>(), {
    error: false,
})
const emits = defineEmits<{
  (e: 'confirm'): void;
  (e: 'update:modelValue', modelValue: boolean): void;
}>();

const open = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emits('update:modelValue', value);
  },
});


const titleClass = computed(() => props.error? 'title error' : 'title')
const backgroundColor = computed(() => props.error? 'white' : '#FF9900')
</script>

<style scoped>

.message-popup {
  display: grid;
  background-color: v-bind(backgroundColor);
  width: 384px;
  max-width: 512px;
  height: 256px;
  max-height: 768px;
  grid-template-rows: 32px 1fr 64px
}
.title {
  grid-row: 1;
}

.message {
  grid-row: 2;
}
.buttons {
  grid-row: 3;
}
</style>