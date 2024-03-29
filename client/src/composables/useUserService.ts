import { ISteamAPIResponse } from 'src/clients/types';
import { ref } from 'vue';
import userClient from 'src/clients/UserClient';

export const useUserService = () => {
  const loading = ref(false);

  async function getOwnedGames(
    userId: number,
    include_appinfo?: boolean,
    include_played_free_games?: boolean,
    appids_filter?: string
  ) {
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
      console.error('Error retrieving owned games:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function getRecentlyPlayed(userId: number) {
    loading.value = true;
    try {
      const response = await userClient.getRecentlyPlayed(userId);
      return response.data;
    } catch (error) {
      console.error('Error retrieving recently played games:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function getFriendsList(userId: number) {
    loading.value = true;
    try {
      const response = await userClient.getFriendsList(userId);
      return response.data;
    } catch (error) {
      console.error('Error retrieving friends list:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function getPlayerAchievements(userId: number, appid: number) {
    loading.value = true;
    try {
      const response = await userClient.getPlayerAchievements(userId, appid);
      return response.data;
    } catch (error) {
      console.error('Error retrieving player achievements:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  return {
    getOwnedGames,
    getFriendsList,
    getPlayerAchievements,
    getRecentlyPlayed,
  };
};
