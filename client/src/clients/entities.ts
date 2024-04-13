import { IAppMetadata } from 'src/components/models';

export type Category = { id?: string; description: string; playtime?: number };

export type Genre = Category;

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
  genres: Array<Genre>;
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
  name?: string;
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
  playtime_windows_forever: number;
  playtime_mac_forever: number;
  playtime_linux_forever: number;
  rtime_last_played: number;
  playtime_disconnected: number;
};

export type Friend = { steamid: string; friend_since: number };

export type PlayerSummary = {
  avatarmedium: string;
  personaname: string;
};
export type AppInfo = Pick<IAppMetadata, 'name'> & {
  last_modified: number;
  price_change_number: number;
};

export type LeaderboardEntry = {
  steamid: string;
  score: number;
};