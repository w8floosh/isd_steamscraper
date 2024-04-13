import { AppDetails, AppNews } from 'src/clients/entities';

export interface IAppMetadata {
  id: number;
  name: string;
  lastUpdate?: Date;
}

export interface IPlayerMetadata {
  id: string;
  name?: string;
  friendSince?: Date;
}

export interface IAchievementMetadata {
  appName: string;
  apiName: string;
  name: string;
  unlockTime?: Date;
  globalCompletionPercentage?: number;
}

export interface IAppData {
  meta: IAppMetadata;
  details?: AppDetails;
  news?: AppNews[];
  players?: number;
  achievements?: IAchievementMetadata[];
}

export interface ILeaderboardsData {
  achievementScore: ILeaderboardEntry[];
  playtime: ILeaderboardEntry[];
  versatility: ILeaderboardEntry[];
}

export interface ILeaderboardEntry {
  username: string;
  steamId: string;
  score: number;
}

export interface IRecentlyPlayedGameMetadata {
  id: number;
  name: string;
  playtime_2weeks: number;
  playtime_forever: number;
  img_icon_url: string;
}

export interface IBreadcrumbs {
  name: string;
  icon: string;
}

export interface IDrawerOption {
  title: string;
  icon: string;
  caption?: string;
  endpoint?: string;
}
