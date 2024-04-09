import { api as axios } from 'src/boot/axios';
import {
  AppDetailsResponse,
  AppGlobalAchievementPercentagesResponse,
  AppListResponse,
  AppNewsResponse,
  ISteamAPIResponse,
  NoCurrentPlayersResponse,
  SteamAPIError,
} from './responses';
import { useAuthStore } from 'src/stores/auth';
import { storeToRefs } from 'pinia';

export default new (class AppsClient {
  private endpoint_apps = '/stats/apps';
  private endpoint_store = '/store';

  private endpoint_news = '/news';
  async getAppList(
    max_results?: number,
    last_appid?: string
  ): Promise<ISteamAPIResponse<AppListResponse>> {
    const url = process.env.STEAMAPI_PROXY_URL + this.endpoint_store;
    const params = {
      max_results,
      last_appid,
      key: storeToRefs(useAuthStore()).steamWebAPIToken.value,
    };

    try {
      const response = await axios.get<ISteamAPIResponse<AppListResponse>>(
        url,
        {
          params,
        }
      );
      if (response.data.errors.length)
        throw new SteamAPIError(response.data.errors.join('\n'));
      return response.data;
    } catch (error) {
      console.error('Error getting app list:', error);
      throw error;
    }
  }

  async getNews(
    id: number,
    count?: number,
    maxlength?: number
  ): Promise<ISteamAPIResponse<AppNewsResponse>> {
    const url = process.env.STEAMAPI_PROXY_URL + this.endpoint_news;
    const params = {
      id,
      count,
      maxlength,
      key: storeToRefs(useAuthStore()).steamWebAPIToken.value,
    };

    try {
      const response = await axios.get<ISteamAPIResponse<AppNewsResponse>>(
        url,
        {
          params,
        }
      );
      if (response.data.errors.length)
        throw new SteamAPIError(response.data.errors.join('\n'));
      return response.data;
    } catch (error) {
      console.error('Error getting app news:', error);
      throw error;
    }
  }

  async getDetails(
    id: number,
    filters?: string,
    cc?: string,
    language?: string
  ): Promise<ISteamAPIResponse<AppDetailsResponse>> {
    const url =
      process.env.STEAMAPI_PROXY_URL + this.endpoint_store + '/details';
    const params = {
      id,
      filters,
      cc,
      language,
      key: storeToRefs(useAuthStore()).steamWebAPIToken.value,
    };

    try {
      const response = await axios.get<ISteamAPIResponse<AppDetailsResponse>>(
        url,
        {
          params,
        }
      );
      if (response.data.errors.length)
        throw new SteamAPIError(response.data.errors.join('\n'));
      return response.data;
    } catch (error) {
      console.error('Error getting app details:', error);
      throw error;
    }
  }

  async getAppGlobalAchievementPercentages(
    gameid: number
  ): Promise<ISteamAPIResponse<AppGlobalAchievementPercentagesResponse>> {
    const url =
      process.env.STEAMAPI_PROXY_URL +
      this.endpoint_apps +
      gameid +
      '/achievements';
    const params = {
      key: storeToRefs(useAuthStore()).steamWebAPIToken.value,
    };

    try {
      const response = await axios.get<
        ISteamAPIResponse<AppGlobalAchievementPercentagesResponse>
      >(url, {
        params,
      });
      if (response.data.errors.length)
        throw new SteamAPIError(response.data.errors.join('\n'));
      return response.data;
    } catch (error) {
      console.error('Error getting app global achievement percentages:', error);
      throw error;
    }
  }

  async getCurrentPlayers(
    id: number
  ): Promise<ISteamAPIResponse<NoCurrentPlayersResponse>> {
    const url =
      process.env.STEAMAPI_PROXY_URL + this.endpoint_apps + id + '/current';
    const params = {
      key: storeToRefs(useAuthStore()).steamWebAPIToken.value,
    };

    try {
      const response = await axios.get<
        ISteamAPIResponse<NoCurrentPlayersResponse>
      >(url, {
        params,
      });
      if (response.data.errors.length)
        throw new SteamAPIError(response.data.errors.join('\n'));
      return response.data;
    } catch (error) {
      console.error('Error getting app current players:', error);
      throw error;
    }
  }
})();
