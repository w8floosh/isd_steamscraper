import { ref } from 'vue';
import appsClient from '../clients/AppsClient';
import { IAppData, IAppMetadata } from 'src/components/models';
import { GetAppDataOptions } from './types';
import { AppListResponse, SteamAPIError } from 'src/clients/responses';

export const useAppsService = () => {
  const loading = ref(false);
  const errors = ref({
    details: '',
    news: '',
    players: '',
    achievements: '',
  });
  const handleAppDataError = (
    key: keyof typeof errors.value,
    error: SteamAPIError
  ) => {
    errors.value[key] = error.message;
    return undefined;
  };
  async function getAppList(): Promise<AppListResponse> {
    try {
      loading.value = true;

      const appList = await appsClient.getAppList();

      return appList.data;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to retrieve app list');
    } finally {
      loading.value = false;
    }
  }

  async function getAppData(
    meta: IAppMetadata,
    options?: GetAppDataOptions
  ): Promise<IAppData> {
    loading.value = true;
    const { filters, cc, language } = options?.details || {};
    const { count, maxlength } = options?.news || {};
    const [
      detailsResponse,
      newsResponse,
      playersResponse,
      achievementsResponse,
    ] = await Promise.all([
      appsClient
        .getDetails(meta.id, filters, cc, language)
        .catch((e) => handleAppDataError('details', e)),
      appsClient
        .getNews(meta.id, count, maxlength)
        .catch((e) => handleAppDataError('news', e)),
      appsClient
        .getCurrentPlayers(meta.id)
        .catch((e) => handleAppDataError('players', e)),
      appsClient
        .getAppGlobalAchievementPercentages(meta.id)
        .catch((e) => handleAppDataError('achievements', e)),
    ]);

    // Extract relevant data
    const details = detailsResponse?.data[meta.id.toString()];
    const news = newsResponse ? Object.values(newsResponse.data) : undefined;
    const players = playersResponse
      ? Object.values(playersResponse.data)[0]
      : undefined;
    const achievements = achievementsResponse
      ? Object.entries(Object.values(achievementsResponse?.data)[0]).map(
          ([ach, percent]: [string, number]) => ({
            appName: meta.name,
            apiName: ach,
            name: ach,
            globalCompletionPercentage: percent,
          })
        )
      : undefined;

    loading.value = false;
    return {
      meta,
      details,
      news,
      players,
      achievements,
    };
  }

  return {
    getAppData,
    getAppList,
    loading,
    errors,
  };
};
