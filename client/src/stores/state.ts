import { defineStore } from 'pinia';
import { IAppMetadata } from 'src/components/models';
import { ref } from 'vue';

const STUB_APP_METADATA: IAppMetadata = {
  id: 0,
  name: '',
};
export const useStateStore = defineStore(
  'state',
  () => {
    const app = ref<IAppMetadata>(structuredClone(STUB_APP_METADATA));

    return {
      app,
    };
  },
  { persist: true }
);
