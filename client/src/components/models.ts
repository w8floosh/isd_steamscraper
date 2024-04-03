import { AppDetails, AppNews } from 'src/clients/entities';

export interface IAppMetadata {
  id: number;
  name: string;
  lastUpdate?: Date;
}

export interface IPlayerMetadata {
  id: number;
  name?: string;
  friendSince?: Date;
}

export interface IAchievementMetadata {
  appName: string;
  name: string;
  unlockTime: Date;
}

export interface IAppData {
  meta: IAppMetadata;
  details?: AppDetails;
  news?: AppNews[];
  players?: number;
  achievements?: any;
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
