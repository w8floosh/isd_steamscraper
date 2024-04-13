import { Injectable } from '@nestjs/common';
import {
  APIService,
  RedisMessage,
  RedisMessageParsed,
  RedisMessageType,
  RedisRequestHandler,
} from '../types';
import { differenceInYears, toDate } from 'date-fns';

@Injectable()
export class UsersService extends APIService {
  protected operationMapping: Map<
    RedisMessageType,
    RedisRequestHandler<UsersService>
  > = new Map([
    [
      RedisMessageType.USER_ACHIEVEMENTS_SCORE,
      this.getUserAchievementsScore.bind(this),
    ],
    [
      RedisMessageType.USER_FAVORITE_GENRES_CATEGORIES,
      this.getUserFavoriteGenresCategories.bind(this),
    ],
    [
      RedisMessageType.USER_FORGOTTEN_GAMES,
      this.getUserForgottenGames.bind(this),
    ],
    // [RedisMessageType.USER_LIBRARY_VALUE, this.getUserLibraryValue.bind(this)],
  ]);
  constructor() {
    super();
  }

  private getUserAchievementsScore(data: RedisMessageParsed) {
    const reply = new RedisMessage(data.consumer, data.requester, data.type);
    try {
      console.log(data.payload);
      const payload = data.payload as {
        steamid: string;
        games: Record<string, any>;
      };
      reply.payload.data = {
        steamid: payload.steamid,
        score: Object.values(payload.games)
          .map((x: any) => (x.hasOwnProperty('length') ? x.length : 0))
          .reduce((acc, curr) => acc + curr),
      };
      reply.payload.success = true;
    } catch (e) {
      reply.payload.success = false;
      reply.payload.errors.push(e);
    }
    return reply;
  }

  private getUserFavoriteGenresCategories(data: RedisMessageParsed) {
    const reply = new RedisMessage(data.consumer, data.requester, data.type);
    try {
      const apps = Object.values(data.payload);
      const genres: Record<string, any> = {};
      const categories: Record<string, any> = {};

      // for each app, map each genre to the app playtime
      apps.forEach((app: any) => {
        app.genres.forEach((gen: any) => {
          const acc_genre_playtime = (genres[gen.description] ??= 0);
          genres[gen.description] = acc_genre_playtime + app.playtime;
        });
        app.categories.forEach((cat: any) => {
          const acc_category_playtime = (categories[cat.description] ??= 0);
          categories[cat.description] = acc_category_playtime + app.playtime;
        });
      });

      reply.payload.data = {
        genres,
        categories,
      };
    } catch (e) {
      reply.payload.success = false;
      reply.payload.errors.push(e);
    }
    return reply;
  }

  private getUserForgottenGames(data: RedisMessageParsed) {
    const reply = new RedisMessage(data.consumer, data.requester, data.type);
    try {
      const games: [string, any][] = Object.entries(data.payload);
      const forgottenGames = games.filter(
        (game) =>
          game[1].playtime_forever === 0 ||
          differenceInYears(
            Date.now(),
            toDate(game[1].rtime_last_played * 1000),
          ) > 0,
      );
      reply.payload.data = Object.fromEntries(forgottenGames);
    } catch (e) {
      reply.payload.success = false;
      reply.payload.errors.push(e);
    }
    return reply;
  }
}
