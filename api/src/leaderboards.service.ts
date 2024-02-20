import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisMessageType } from './types';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { decode, encode_channel } from './utils';

@Injectable()
export class AppService {
  constructor(@Inject('REDIS_CLIENT') public redisService: Redis) {}

  @MessagePattern({ type: RedisMessageType.LEADERBOARD_ACHIEVEMENTS_SCORE })
  async getAchievementScoreLeaderboard(@Payload() data: any) {
    const message = decode(data);
    const resch = encode_channel(
      RedisMessageType.USER_ACHIEVEMENTS_SCORE,
      message.requester,
    );
    console.log(message, this.getAchievementScoreLeaderboard.name);
    await this.redisService.publish(resch, JSON.stringify(message));
  }

  @MessagePattern({ type: RedisMessageType.LEADERBOARD_LIBRARY_VALUE })
  async getLibraryValueLeaderboard(@Payload() data: any) {
    const message = decode(data);
    const resch = encode_channel(
      RedisMessageType.LEADERBOARD_LIBRARY_VALUE,
      message.requester,
    );
    console.log(message, this.getLibraryValueLeaderboard.name);
    await this.redisService.publish(resch, JSON.stringify(message));
  }
}
