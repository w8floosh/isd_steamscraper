import { ref } from 'vue';
import statsClient from 'src/clients/StatsClient';

export const useStatsService = () => {
  const loading = ref(false);
  const errorMessage = ref('');
  async function getAchievementScore(userId: number) {
    try {
      loading.value = true;
      const score = await statsClient.getAchievementScore(userId);

      return score.data;
    } catch (error: any) {
      errorMessage.value =
        'Failed to retrieve achievement score: ' + error.message;
      console.error(errorMessage.value);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function getFavoriteGenresAndCategories(userId: number) {
    try {
      loading.value = true;

      const favorite = await statsClient.getFavoriteGenresAndCategories(userId);

      return favorite.data;
    } catch (error: any) {
      errorMessage.value =
        'Failed to retrieve favorite genres and categories: ' + error.message;
      console.error(errorMessage.value);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function getForgottenGames(userId: number) {
    try {
      loading.value = true;

      const forgotten = await statsClient.getForgottenGames(userId);

      return forgotten.data;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to retrieve forgotten games');
    } finally {
      loading.value = false;
    }
  }

  return {
    getAchievementScore,
    getFavoriteGenresAndCategories,
    getForgottenGames,
    loading,
  };
};
