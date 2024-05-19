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
      const user_data = Object.entries<Record<string, number>>(data.payload);

      reply.payload.data = user_data
        .reduce((acc, [steamid, games]) => {
          if (!Object.keys(games || {}).length) return acc;
          const score = standardDeviation(Object.values(games));

          if (score === undefined || isNaN(score) || score === 0) return acc;
          acc.push({
            steamid,
            score,
          });
          return acc;
        }, [])
        .sort((l, r) => l.score - r.score);
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
        .reduce((acc, [steamid, games]) => {
          const score = Object.values(games).reduce(
            (total, playtime) => total + playtime,
            0,
          );
          if (score === 0) return acc;
          acc.push({
            steamid,
            score,
          });
          return acc;
        }, [])
        .sort((l, r) => r.score - l.score);
    } catch (e) {
      reply.payload.success = false;
      reply.payload.errors.push(e);
    }
    return reply;
  }
}
