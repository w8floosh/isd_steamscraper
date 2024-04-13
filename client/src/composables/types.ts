import { Category, Genre } from 'src/clients/entities';
import {
  IAchievementMetadata,
  IAppMetadata,
  IPlayerMetadata,
  IRecentlyPlayedGameMetadata,
  ILeaderboardsData,
} from 'src/components/models';

export interface IUser {
  email: string;
  username: string;
  accessToken: string;
  steamWebAPIToken: string;
  steamId: string;
  avatarURL?: string;
  lastLoginAt?: Date;
  lastLoginIP?: string;
}

export type UserCredentials = {
  email: string;
  password: string;
  steamWebAPIToken?: string;
  steamId?: string;
};

export type GetAppDataOptions = {
  details?: {
    filters?: string;
    cc?: string;
    language?: string;
  };
  news?: {
    count?: number;
    maxlength?: number;
  };
};

export type TokenResponse = {
  token_type: 'Bearer';
  expires_in: number;
  access_token: string;
  refresh_token: string;
  scope: string;
};

export type SessionResponse = {
  user: IUser;
  token: string;
};

export type SessionCookieVerifierResponse = {
  user: IUser;
  token: string;
  refresh: boolean;
};

export enum AuthenticationError {
  INVALID_SESSION = 'Invalid or missing session token',
  EXPIRED_SESSION = 'Session expired',
  GENERIC = 'Generic error',
}

export type UserTab = 'games' | 'friends' | 'favorites' | 'achievements';
export type UserGamesTab = 'forgottenGames' | 'allGames' | 'recentGames';
export type LeaderboardsTab = keyof ILeaderboardsData;

export type UserData = {
  recent?: IRecentlyPlayedGameMetadata[];
  friends?: IPlayerMetadata[];
  games?: IAppMetadata[];
  achievements?: IAchievementMetadata[];
  forgotten?: IAppMetadata[];
  favorite: {
    genres?: Genre[];
    categories?: Category[];
  };
};
