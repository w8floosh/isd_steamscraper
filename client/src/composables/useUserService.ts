import {
  AllPlayerAchievementsResponse,
  FriendListResponse,
  OwnedGamesResponse,
  PlayerAchievementsResponse,
  PlayerSummaryResponse,
  RecentlyPlayedResponse,
} from 'src/clients/responses';
import { ref } from 'vue';
import userClient from 'src/clients/UserClient';

export const useUserService = () => {
  const loading = ref(false);

  async function getOwnedGames(
    userId: string,
    include_appinfo?: boolean,
    include_played_free_games?: boolean,
    appids_filter?: string
  ): Promise<OwnedGamesResponse> {
    loading.value = true;
    try {
      const response = await userClient.getOwnedGames(
        userId,
        include_appinfo,
        include_played_free_games,
        appids_filter
      );
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function getRecentlyPlayed(
    userId: string
  ): Promise<RecentlyPlayedResponse> {
    loading.value = true;
    try {
      const response = await userClient.getRecentlyPlayed(userId);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function getPlayerSummary(
    userId: string
  ): Promise<PlayerSummaryResponse> {
    loading.value = true;
    try {
      const response = await userClient.getPlayerSummary(userId);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function getFriendsList(userId: string): Promise<FriendListResponse> {
    loading.value = true;
    try {
      const response = await userClient.getFriendsList(userId);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function getPlayerAchievements(
    userId: string,
    appid: number
  ): Promise<PlayerAchievementsResponse> {
    loading.value = true;
    try {
      const response = await userClient.getPlayerAchievements(userId, appid);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function getAllPlayerAchievements(
    userId: string,
    appids: number[]
  ): Promise<AllPlayerAchievementsResponse> {
    loading.value = true;
    try {
      const response = await userClient.getAllPlayerAchievements(
        userId,
        appids
      );
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  }

  return {
    getOwnedGames,
    getPlayerSummary,
    getFriendsList,
    getPlayerAchievements,
    getAllPlayerAchievements,
    getRecentlyPlayed,
  };
};
