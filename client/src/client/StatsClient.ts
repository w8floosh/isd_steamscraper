import { api as axios } from 'src/boot/axios';
import { ISteamAPIResponse } from './types';
import { useAuthStore } from 'src/stores/auth';

export default new (class StatsClient {
  private base_url = process.env.STEAMAPI_PROXY_URL + '/compute/players';

  async getAchievementScore(userId: number): Promise<ISteamAPIResponse> {
    try {
      const url = `${this.base_url}/${userId}/gamerscore`;
      const params = {
        token: useAuthStore().token,
      };
      const response = await axios.get<ISteamAPIResponse>(url, { params });
      return response.data;
    } catch (error) {
      console.error('Error retrieving achievement score:', error);
      throw error;
    }
  }

  async getFavoriteGenresAndCategories(
    userId: number
  ): Promise<ISteamAPIResponse> {
    try {
      const url = `${this.base_url}/${userId}/favorite`;
      const params = {
        token: useAuthStore().token,
      };
      const response = await axios.get<ISteamAPIResponse>(url, { params });
      return response.data;
    } catch (error) {
      console.error('Error retrieving favorite genres and categories:', error);
      throw error;
    }
  }

  async getForgottenGames(userId: number): Promise<ISteamAPIResponse> {
    try {
      const url = `${this.base_url}/${userId}/forgotten`;
      const params = {
        token: useAuthStore().token,
      };
      const response = await axios.get<ISteamAPIResponse>(url, { params });
      return response.data;
    } catch (error) {
      console.error('Error retrieving forgotten games:', error);
      throw error;
    }
  }
})();
