import { IAppMetadata } from 'src/components/models';

export interface ISteamAPIResponse<T = unknown> {
  success: boolean;
  data: Payload<T>;
  errors: string[];
  cached: boolean;
}

export type Payload<T> = T extends Array<infer ValueType>
  ? ValueType[]
  : Record<string, T>;

export type Category = { id: string; description: string };
export type Genres = Category;
export type AppDetails = {
  name: string;
  price_overview:
    | {
        currency: string;
        initial: number;
        final: number;
        discount_percent: number;
        initial_formatted: string;
        final_formatted: string;
      }
    | string;
  categories: Array<Category>;
  genres: Array<Genres>;
};

export type AppNews = {
  gid: string;
  title: string;
  url: string;
  author: string;
  contents: string;
  date: number;
};

export type Achievement = {
  apiname: string;
  unlocktime: number;
  achieved: boolean;
};

export type RecentlyPlayedGame = {
  name: string;
  playtime_2weeks: number;
  playtime_forever: number;
  img_icon_url: string;
};

export type OwnedGame = {
  name: string;
  playtime_forever: number;
  rtime_last_played: number;
  img_icon_url: string;
};

export type Friend = { steamid: number; friend_since: number };
export type AppInfo = Pick<IAppMetadata, 'name'> & {
  last_modified: number;
  price_change_number: number;
};

// Specific response types
export type AppGlobalAchievementPercentagesResponse = Record<
  string,
  Record<string, number>
>;

export type PlayerAchievementsResponse = Record<string, Achievement[]>;

export type AppNewsResponse = AppNews[];

export type FriendListResponse = Friend[];

export type AppDetailsResponse = Record<string, AppDetails>;

export type AppListResponse = Record<string, AppInfo>;

export type NoCurrentPlayersResponse = { player_count: number };
export type RecentlyPlayedResponse = Record<string, RecentlyPlayedGame>;

export type OwnedGamesResponse = OwnedGame[];

export type BackendResponse<T = unknown> = Record<string, T>;
