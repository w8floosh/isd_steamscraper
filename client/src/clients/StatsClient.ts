import { api as axios } from 'src/boot/axios';
import { ISteamAPIResponse } from './responses';
import { useAuthStore } from 'src/stores/auth';
import { storeToRefs } from 'pinia';
import {
  AchievementScoreResponse,
  FavoriteGenresCategoriesResponse,
  ForgottenGamesResponse,
} from './responses';

export default new (class StatsClient {
  private base_url = process.env.STEAMAPI_PROXY_URL + '/compute/players';

  async getAchievementScore(
    userId: number
  ): Promise<ISteamAPIResponse<AchievementScoreResponse>> {
    try {
      const url = `${this.base_url}/${userId}/gamerscore`;
      const params = {
        key: storeToRefs(useAuthStore()).steamWebAPIToken.value,
      };
      const response = await axios.get<
        ISteamAPIResponse<AchievementScoreResponse>
      >(url, { params });
      return response.data;
    } catch (error) {
      console.error('Error retrieving achievement score:', error);
      throw error;
    }
  }

  async getFavoriteGenresAndCategories(
    userId: number
  ): Promise<ISteamAPIResponse<FavoriteGenresCategoriesResponse>> {
    try {
      const url = `${this.base_url}/${userId}/favorite`;
      const params = {
        key: storeToRefs(useAuthStore()).steamWebAPIToken.value,
      };
      const response = await axios.get<
        ISteamAPIResponse<FavoriteGenresCategoriesResponse>
      >(url, { params });
      return response.data;
    } catch (error) {
      console.error('Error retrieving favorite genres and categories:', error);
      throw error;
    }
  }

  async getForgottenGames(
    userId: number
  ): Promise<ISteamAPIResponse<ForgottenGamesResponse>> {
    try {
      const url = `${this.base_url}/${userId}/forgotten`;
      const params = {
        key: storeToRefs(useAuthStore()).steamWebAPIToken.value,
      };
      const response = await axios.get<
        ISteamAPIResponse<ForgottenGamesResponse>
      >(url, { params });
      return response.data;
    } catch (error) {
      console.error('Error retrieving forgotten games:', error);
      throw error;
    }
  }
})();
