import { api as axios } from 'src/boot/axios';
import { ISteamAPIResponse } from './types';
import { useAuthStore } from 'src/stores/auth';
import { storeToRefs } from 'pinia';

const { APIToken: token } = storeToRefs(useAuthStore());

export default new (class UserClient {
  private base_url = process.env.STEAMAPI_PROXY_URL + '/users';

  async getOwnedGames(
    userId: number,
    include_appinfo?: boolean,
    include_played_free_games?: boolean,
    appids_filter?: string
  ): Promise<ISteamAPIResponse> {
    const url = `${this.base_url}/${userId}/games`;
    const params = {
      include_appinfo,
      include_played_free_games,
      appids_filter,
      token,
    };

    try {
      const response = await axios.get<ISteamAPIResponse>(url, { params });
      return response.data;
    } catch (error) {
      console.error('Error retrieving owned games:', error);
      throw error;
    }
  }

  async getRecentlyPlayed(userId: number): Promise<ISteamAPIResponse> {
    const url = `${this.base_url}/${userId}/recent`;
    const params = {
      token,
    };

    try {
      const response = await axios.get<ISteamAPIResponse>(url, { params });
      return response.data;
    } catch (error) {
      console.error('Error retrieving recently played games:', error);
      throw error;
    }
  }

  async getFriendsList(userId: number): Promise<ISteamAPIResponse> {
    const url = `${this.base_url}/${userId}/friends`;
    const params = {
      token,
    };

    try {
      const response = await axios.get<ISteamAPIResponse>(url, { params });
      return response.data;
    } catch (error) {
      console.error('Error retrieving friends list:', error);
      throw error;
    }
  }

  async getPlayerAchievements(
    userId: number,
    appid: number
  ): Promise<ISteamAPIResponse> {
    const url = `${this.base_url}/${userId}/friends`;
    const params = {
      appid,
      token,
    };

    try {
      const response = await axios.get<ISteamAPIResponse>(url, { params });
      return response.data;
    } catch (error) {
      console.error('Error retrieving player achievements:', error);
      throw error;
    }
  }
})();
