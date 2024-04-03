<template>
  <q-dialog v-model="open" persistent>
    <q-card class="credentials-dialog">
      <q-card-section class="email-input">
        <div class="text-h6">Email</div>
        <q-input dense v-model="email" type="email" autofocus  />
      </q-card-section>
      <q-card-section class="password-input">
        <div class="text-h6">Password</div>
        <q-input dense v-model="password" autofocus type="password" />
      </q-card-section>
      <q-card-section v-if="dialogMode === 'register'" class="confirm-password-input">
        <div class="text-h6">Confirm password</div>
        <q-input :error="!passwordMatch" errorMessage="Passwords do not match" dense v-model="confirmPassword" autofocus type="password" />
      </q-card-section>
      <q-card-section v-if="dialogMode === 'register'" class="steam-token">
        <div class="text-h6">Steam Web API token</div>
        <q-input dense v-model="steamWebAPIToken" autofocus type="password" />
      </q-card-section>
      <q-card-section v-if="dialogMode === 'register'" class="steam-id">
        <div class="text-h6">Steam ID</div>
        <q-input dense v-model="steamId" autofocus />
      </q-card-section>

      <q-card-actions align="right" :style="buttonsClass">
        <q-btn :disable="canSend" class="text-primary" flat label="Cancel" @click="open = false" />
        <q-btn class="text-primary" flat :label="dialogMode" @click="emitCredentials" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { UserCredentials } from '../../composables/types';
import { computed, ref } from 'vue';
const props = defineProps<{ modelValue: boolean, dialogMode: 'login' | 'register' }>();
const emits = defineEmits<{
  (e: 'confirm', credentials: UserCredentials): void;
  (e: 'update:modelValue', modelValue: boolean): void;
}>();
const email = ref('');
const password = ref('');
const confirmPassword = ref('')
const steamWebAPIToken = ref('')
const steamId = ref('')

const open = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emits('update:modelValue', value);
  },
});

const passwordMatch = computed(() => password.value === confirmPassword.value);
const canSend = computed(() => 
  !!email.value && !!password.value
  && !!confirmPassword.value 
  && !!steamWebAPIToken.value 
  && password.value === confirmPassword.value)
const gridRows = computed(() => props.dialogMode === 'register' ? '1fr 8px 1fr 8px 1fr 8px 1fr 8px 1fr 8px 64px ' : '1fr 8px 1fr 8px 64px')
const noGridRows = computed(() => props.dialogMode === 'register' ? 11:5);


const buttonsClass = ref({
  'grid-row': noGridRows.value,
  'grid-column': 2,
})
const emitCredentials = () => {
  emits('confirm', { email: email.value, password: password.value, steamWebAPIToken: steamWebAPIToken.value, steamId: steamId.value});
  open.value = false;
};
</script>

<style scoped>

.credentials-dialog {
  display: grid;
  min-width: 256px;
  grid-template-columns: 100px 1fr;
  grid-template-rows: v-bind(gridRows);
}
.email-input {
  grid-row: 1;
  grid-column: span 2;
}

.password-input {
  grid-row: 3;
  grid-column: span 2;
}

.confirm-password-input {
  grid-row: 5;
  grid-column: span 2;
}

.steam-token {
  grid-row: 7;
  grid-column: span 2;
}

.steam-id {
  grid-row: 9;
  grid-column: span 2;
}

.buttons {
  grid-row: v-bind(noGridRows);
  grid-column: 2;
}
</style>
