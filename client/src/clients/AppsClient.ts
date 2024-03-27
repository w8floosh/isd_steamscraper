import { api as axios } from 'src/boot/axios';
import { ISteamAPIResponse } from './types';
import { useAuthStore } from 'src/stores/auth';
import { IAppMetadata } from 'src/components/models';
import { storeToRefs } from 'pinia';

const { steamWebAPIToken: token } = storeToRefs(useAuthStore());

export default new (class AppsClient {
  private endpoint_apps = '/stats/apps';
  private endpoint_store = '/store';

  private endpoint_news = '/news';
  async getAppList(
    max_results?: number,
    last_appid?: string
  ): Promise<ISteamAPIResponse<IAppMetadata>> {
    const url = process.env.STEAMAPI_PROXY_URL + this.endpoint_store;
    const params = {
      max_results,
      last_appid,
      token,
    };

    try {
      const response = await axios.get<ISteamAPIResponse<IAppMetadata>>(url, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Error getting app list:', error);
      throw error;
    }
  }

  async getNews(
    id: string,
    count?: number,
    maxlength?: number
  ): Promise<ISteamAPIResponse> {
    const url = process.env.STEAMAPI_PROXY_URL + this.endpoint_news;
    const params = {
      id,
      count,
      maxlength,
      token,
    };

    try {
      const response = await axios.get<ISteamAPIResponse>(url, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Error getting app news:', error);
      throw error;
    }
  }

  async getDetails(
    id: string,
    filters?: string,
    cc?: string,
    language?: string
  ): Promise<ISteamAPIResponse> {
    const url =
      process.env.STEAMAPI_PROXY_URL + this.endpoint_store + '/details';
    const params = {
      id,
      filters,
      cc,
      language,
      token,
    };

    try {
      const response = await axios.get<ISteamAPIResponse>(url, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Error getting app details:', error);
      throw error;
    }
  }

  async getAppGlobalAchievementPercentages(
    gameid: string
  ): Promise<ISteamAPIResponse> {
    const url =
      process.env.STEAMAPI_PROXY_URL +
      this.endpoint_apps +
      gameid +
      '/achievements';
    const params = {
      token,
    };

    try {
      const response = await axios.get<ISteamAPIResponse>(url, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Error getting app global achievement percentages:', error);
      throw error;
    }
  }

  async getCurrentPlayers(id: string): Promise<ISteamAPIResponse> {
    const url =
      process.env.STEAMAPI_PROXY_URL + this.endpoint_apps + id + '/current';
    const params = {
      token,
    };

    try {
      const response = await axios.get<ISteamAPIResponse>(url, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Error getting app current players:', error);
      throw error;
    }
  }
})();
