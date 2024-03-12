import { ref } from 'vue';
import { api as axios } from 'src/boot/axios';
import { useAuthStore } from 'src/store/auth';

interface AppData {
  details: any;
  news: any[];
  players: number;
  achievements: number;
}

export function useAppDataService() {
  const loading = ref(false);

  async function getAppData(id: string): Promise<AppData> {
    try {
      loading.value = true;

      const apiUrl = process.env.STEAMAPI_PROXY_URL;

      // Make API calls to retrieve app data
      // import the auth store and get the token
      // add to the promise calls the query parameter "token" with the token value
      const authStore = useAuthStore();
      const token = authStore.getToken();

      const [
        detailsResponse,
        newsResponse,
        playersResponse,
        achievementsResponse,
      ] = await Promise.all([
        axios.get(`${apiUrl}/store/details?id=${id}&token=${token}`),
        axios.get(`${apiUrl}/news/${id}?token=${token}`),
        axios.get(`${apiUrl}/apps/${id}/current?token=${token}`),
        axios.get(`${apiUrl}/apps/${id}/achievements?token=${token}`),
      ]);

      // Extract relevant data
      const details = detailsResponse.data;
      const news = newsResponse.data;
      const players = playersResponse.data;
      const achievements = achievementsResponse.data;

      return {
        details,
        news,
        players,
        achievements,
      };
    } catch (error) {
      // Handle error
      console.error(error);
      throw new Error('Failed to retrieve app data');
    } finally {
      loading.value = false;
    }
  }

  return {
    getAppData,
    loading,
  };
}
