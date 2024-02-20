import { RedisContext } from '@nestjs/microservices';

export enum RedisMessageType {
  USER_ACHIEVEMENTS_SCORE = 101,
  USER_FAVORITE_GENRES_CATEGORIES = 102,
  USER_LIBRARY_VALUE = 103,
  USER_FORGOTTEN_GAMES = 104,
  LEADERBOARD_ACHIEVEMENTS_SCORE = 201,
  LEADERBOARD_PLAYTIME = 202,
  LEADERBOARD_LIBRARY_VALUE = 203,
  LEADERBOARD_VERSATILITY_SCORE = 204,
}

export type RedisRequestHandler = (
  data: any,
  context: RedisContext,
) => RedisMessage;

export type RedisMessage = {
  requester: string;
  type: RedisMessageType | string | number;
  payload: {
    success: boolean | 'with_warnings';
    errors: string[] | Map<string, string>;
    data: any;
    cached: boolean;
  };
};
