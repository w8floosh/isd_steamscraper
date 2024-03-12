import { api as axios } from 'src/boot/axios';
import { ISteamAPIResponse } from './types';
import { useAuthStore } from 'src/stores/auth';

export default new (class LeaderboardsClient {
  private base_url =
    process.env.STEAMAPI_PROXY_URL + '/compute/stats/leaderboards/friends';

  async getAchievementScoreFriendsLeaderboard(
    friendId: number
  ): Promise<ISteamAPIResponse> {
    const url = `${this.base_url}/${friendId}/gamerscore`;
    const params = {
      token: useAuthStore().token,
    };

    try {
      const response = await axios.get<ISteamAPIResponse>(url, { params });
      return response.data;
    } catch (error) {
      console.error(
        'Error retrieving achievement score friends leaderboard:',
        error
      );
      throw error;
    }
  }

  async getPlaytimeFriendsLeaderboard(
    friendId: number
  ): Promise<ISteamAPIResponse> {
    const url = `${this.base_url}/${friendId}/playtime`;
    const params = {
      token: useAuthStore().token,
    };

    try {
      const response = await axios.get<ISteamAPIResponse>(url, { params });
      return response.data;
    } catch (error) {
      console.error('Error retrieving playtime friends leaderboard:', error);
      throw error;
    }
  }

  async getVersatilityScoreFriendsLeaderboard(
    friendId: number
  ): Promise<ISteamAPIResponse> {
    const url = `${this.base_url}/${friendId}/versatility`;
    const params = {
      token: useAuthStore().token,
    };

    try {
      const response = await axios.get<ISteamAPIResponse>(url, { params });
      return response.data;
    } catch (error) {
      console.error(
        'Error retrieving versatility score friends leaderboard:',
        error
      );
      throw error;
    }
  }
})();
