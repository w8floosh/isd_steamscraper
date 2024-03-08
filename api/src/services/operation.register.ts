import { Injectable } from '@nestjs/common';
import { RedisMessage, RedisMessageType } from '../types';
import { UsersService } from './users.service';
import { APIService } from '../types';
import { LeaderboardsService } from './leaderboards.service';

@Injectable()
export class OperationRegistry {
  private registry: Map<RedisMessageType, APIService> = new Map();
  constructor(
    private readonly usersService: UsersService,
    private readonly leaderboardsService: LeaderboardsService,
  ) {
    for (const key in RedisMessageType) {
      if (key.startsWith('USER'))
        this.registry.set(RedisMessageType[key], this.usersService);
      else if (key.startsWith('LEADERBOARD'))
        this.registry.set(RedisMessageType[key], this.leaderboardsService);
    }
  }

  get(key: RedisMessageType) {
    return this.registry.get(key);
  }
  execute(op: RedisMessageType, data: any): RedisMessage {
    return this.registry.get(op).execute(op, data);
  }
}
