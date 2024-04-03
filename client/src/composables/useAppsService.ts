import { ref } from 'vue';
import appsClient from '../clients/AppsClient';
import { IAppData, IAppMetadata } from 'src/components/models';
import { GetAppDataOptions } from './types';
import { AppListResponse } from 'src/clients/responses';

export const useAppsService = () => {
  const loading = ref(false);

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
    try {
      loading.value = true;
      const { filters, cc, language } = options?.details || {};
      const { count, maxlength } = options?.news || {};
      const [
        detailsResponse,
        newsResponse,
        playersResponse,
        achievementsResponse,
      ] = await Promise.all([
        appsClient.getDetails(meta.id, filters, cc, language),
        appsClient.getNews(meta.id, count, maxlength),
        appsClient.getCurrentPlayers(meta.id),
        appsClient.getAppGlobalAchievementPercentages(meta.id),
      ]);

      // Extract relevant data
      const details = detailsResponse.data[meta.id.toString()];
      const news = Object.values(newsResponse.data);
      const players = Object.values(playersResponse.data)[0];
      const achievements = Object.values(achievementsResponse.data)[0];

      return {
        meta,
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
    getAppList,
    loading,
  };
};
