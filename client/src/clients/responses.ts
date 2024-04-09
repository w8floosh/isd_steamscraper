import {
  Achievement,
  AppDetails,
  AppInfo,
  AppNews,
  Category,
  Friend,
  Genre,
  OwnedGame,
  PlayerSummary,
  RecentlyPlayedGame,
} from './entities';

export interface ISteamAPIResponse<T = unknown> {
  success: boolean;
  data: T;
  errors: string[];
  cached: boolean;
}

// export type Payload<T> = T extends Array<infer ValueType>
//   ? ValueType[]
//   : T extends Record<string, infer RecordValueType>
//   ? (RecordValueType extends string | number | boolean
//     ? RecordValueType
//     : Record<string, RecordValueType>)
//   : Record<string, T>;

export type AppGlobalAchievementPercentagesResponse = Record<
  string,
  Record<string, number>
>;

export type PlayerAchievementsResponse = Record<string, Achievement[]>;

export type AllPlayerAchievementsResponse = PlayerAchievementsResponse;

export type AppNewsResponse = AppNews[];

export type FriendListResponse = Friend[];

export type AppDetailsResponse = Record<string, AppDetails>;

export type AppListResponse = Record<string, AppInfo>;

export type NoCurrentPlayersResponse = { player_count: number };

export type RecentlyPlayedResponse = Record<string, RecentlyPlayedGame>;

export type PlayerSummaryResponse = Record<string, PlayerSummary>;

export type OwnedGamesResponse = Record<string, OwnedGame>;

export type ForgottenGamesResponse = OwnedGamesResponse;

export type AchievementScoreResponse = { score: number };

export type FavoriteGenresCategoriesResponse = {
  genres: Record<string, number>;
  categories: Record<string, number>;
};

export type BackendResponse<T = unknown> = Record<string, T>;

export class SteamAPIError extends Error {
  constructor(message: string) {
    super(message);
  }
}
