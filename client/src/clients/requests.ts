import { UserTab } from 'src/composables/types';

export type DataRequestParams<T extends UserTab = never> = T extends 'games'
  ? OwnedGamesRequestParams
  : T extends 'achievements'
  ? PlayerAchievementsRequestParams
  : T extends 'friends'
  ? FriendListRequestParams
  : T extends 'recent'
  ? RecentlyPlayedRequestParams
  : undefined;

export type OwnedGamesRequestParams = {
  include_appinfo?: boolean;
  include_played_free_games?: boolean;
  appids_filter?: string;
};
export type PlayerAchievementsRequestParams = {
  appid: number;
};
export type FriendListRequestParams = undefined;
export type RecentlyPlayedRequestParams = undefined;
