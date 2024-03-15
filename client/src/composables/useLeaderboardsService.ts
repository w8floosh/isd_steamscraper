import { ISteamAPIResponse } from 'src/clients/types';
import { ref } from 'vue';
import leaderboardsClient from 'src/clients/LeaderboardsClient';

export const useLeaderboardsService = () => {
  const loading = ref(false);

  async function getAchievementScoreFriendsLeaderboard(userId: number) {
    loading.value = true;
    try {
      const response =
        await leaderboardsClient.getAchievementScoreFriendsLeaderboard(userId);
      return response.data;
    } catch (error) {
      console.error('Error retrieving achievement score leaderboard');
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function getPlaytimeFriendsLeaderboard(userId: number) {
    loading.value = true;
    try {
      const response = await leaderboardsClient.getPlaytimeFriendsLeaderboard(
        userId
      );
      return response.data;
    } catch (error) {
      console.error('Error retrieving playtime leaderboard');
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function getVersatilityScoreFriendsLeaderboard(userId: number) {
    loading.value = true;
    try {
      const response =
        await leaderboardsClient.getVersatilityScoreFriendsLeaderboard(userId);
      return response.data;
    } catch (error) {
      console.error('Error retrieving versatility score leaderboard');
      throw error;
    } finally {
      loading.value = false;
    }
  }

  return {
    getAchievementScoreFriendsLeaderboard,
    getPlaytimeFriendsLeaderboard,
    getVersatilityScoreFriendsLeaderboard,
  };
};
