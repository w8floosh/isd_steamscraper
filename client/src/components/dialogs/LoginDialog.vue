<template>
  <q-dialog v-model="open" persistent>
    <q-card class="login-dialog">
      <q-card-section class="email-input">
        <div class="text-h6">Email</div>
        <q-input dense v-model="email" type="email" autofocus />
      </q-card-section>
      <q-card-section class="password-input">
        <div class="text-h6">Password</div>
        <q-input dense v-model="password" autofocus type="password" />
      </q-card-section>

      <q-card-actions align="right" class="text-primary buttons">
        <q-btn flat label="Cancel" @click="open = false" />
        <q-btn flat label="Confirm" @click="emitCredentials" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { UserCredentials } from '../../composables/types';
import { computed, ref } from 'vue';

const props = defineProps<{ modelValue: boolean }>();
const emits = defineEmits<{
  (e: 'confirm', credentials: UserCredentials): void;
  (e: 'update:modelValue', modelValue: boolean): void;
}>();

const email = ref('');
const password = ref('');
const open = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emits('update:modelValue', value);
  },
});
const emitCredentials = () => {
  emits('confirm', { email: email.value, password: password.value });
  open.value = false;
};
</script>

<style scoped>
.login-dialog {
  display: grid;
  grid-template-columns: 100px 1fr;
  grid-template-rows: 1fr 8px 1fr 8px 64px;
}
.email-input {
  grid-row: 1;
  grid-column: span 2;
}
/* .email-label {
    grid-row: 1;
    grid-column: 1;
} */
.password-input {
  grid-row: 3;
  grid-column: span 2;
}
/* .password-label {
    grid-row: 3;
    grid-column: 1;
} */

.buttons {
  grid-row: 5;
  grid-column: 2;
}
</style>
