import { Injectable } from '@nestjs/common';
import {
  APIService,
  RedisMessage,
  RedisMessageParsed,
  RedisMessageType,
  RedisRequestHandler,
} from '../types';

import { standardDeviation } from 'simple-statistics';

@Injectable()
export class LeaderboardsService extends APIService {
  protected operationMapping: Map<
    RedisMessageType,
    RedisRequestHandler<LeaderboardsService>
  > = new Map([
    [
      RedisMessageType.LEADERBOARD_ACHIEVEMENTS_SCORE,
      this.getAchievementsScoreLeaderboard.bind(this),
    ],
    [
      RedisMessageType.LEADERBOARD_VERSATILITY_SCORE,
      this.getVersatilityScoreLeaderboard.bind(this),
    ],
    [
      RedisMessageType.LEADERBOARD_PLAYTIME,
      this.getPlaytimeLeaderboard.bind(this),
    ],
    // [RedisMessageType.USER_LIBRARY_VALUE, this.getUserLibraryValue.bind(this)],
  ]);
  constructor() {
    super();
  }
  private getAchievementsScoreLeaderboard(data: RedisMessageParsed) {
    const reply = new RedisMessage(data.consumer, data.requester, data.type);
    try {
      const user_data = data.payload as Array<{
        steamid: string;
        score: number;
      }>;
      reply.payload.data = user_data.sort((l, r) => r.score - l.score);
    } catch (e) {
      reply.payload.success = false;
      reply.payload.errors.push(e);
    }
    return reply;
  }

  private getVersatilityScoreLeaderboard(data: RedisMessageParsed) {
    const reply = new RedisMessage(data.consumer, data.requester, data.type);
    try {
      const user_data = data.payload as Array<{
        steamid: string;
        games: Record<string, { playtime_forever: number; [key: string]: any }>;
      }>;
      reply.payload.data = user_data
        .map((x) => {
          const stddev = standardDeviation(
            Object.values(x.games).map((game) => game.playtime_forever),
          );

          return {
            steamid: x.steamid,
            score: stddev !== 0 ? 1 / stddev : 0,
          };
        })
        .sort((l, r) => r.score - l.score);
    } catch (e) {
      reply.payload.success = false;
      reply.payload.errors.push(e);
    }
    return reply;
  }
  private getPlaytimeLeaderboard(data: RedisMessageParsed) {
    const reply = new RedisMessage(data.consumer, data.requester, data.type);
    try {
      const user_data = Object.entries(data.payload);
      //  as Array<{
      //   steamid: string;
      //   games: Record<number, number>;
      // }>;
      reply.payload.data = user_data
        .map(([steamid, games]) => {
          const score = Object.values(games).reduce(
            (total, playtime) => total + playtime,
            0,
          );

          return {
            steamid,
            score,
          };
        })
        .sort((l, r) => r.score - l.score);
    } catch (e) {
      reply.payload.success = false;
      reply.payload.errors.push(e);
    }
    return reply;
  }
}
