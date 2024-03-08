export const REDIS_CLIENT = Symbol('REDIS_CLIENT');
export enum RedisMessageType {
  USER_ACHIEVEMENTS_SCORE = '101',
  USER_FAVORITE_GENRES_CATEGORIES = '102',
  USER_LIBRARY_VALUE = '103',
  USER_FORGOTTEN_GAMES = '104',
  LEADERBOARD_ACHIEVEMENTS_SCORE = '201',
  LEADERBOARD_PLAYTIME = '202',
  LEADERBOARD_LIBRARY_VALUE = '203',
  LEADERBOARD_VERSATILITY_SCORE = '204',
}

export type RedisRequestHandler<T = APIService> = (
  this: T,
  data: any,
) => RedisMessage;

export class RedisMessagePayload {
  constructor(
    public success: boolean | 'with_warnings',
    public errors: string[] = [],
    public data: any = {},
    public cached: boolean = false,
  ) {}
}

export class RedisMessage {
  constructor(
    public consumer: string,
    public requester: string,
    public type: number,
    public payload?: RedisMessagePayload,
  ) {
    this.payload = payload ??= new RedisMessagePayload(true);
  }
}

export type RedisMessageParsed = RedisMessage & { id: string; payload: any };

export abstract class APIService {
  protected abstract operationMapping: Map<
    RedisMessageType,
    RedisRequestHandler
  >;
  execute(op: RedisMessageType, data: any): RedisMessage {
    return this.operationMapping.get(op).call(this, data);
  }
}
