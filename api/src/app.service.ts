import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisMessageType } from './types';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { decode, encode_channel } from './utils';

@Injectable()
export class AppService {
  constructor(@Inject('REDIS_CLIENT') public redisService: Redis) {}

  @MessagePattern({ type: RedisMessageType.USER_ACHIEVEMENTS_SCORE })
  async getUserAchievementsScore(@Payload() data: any) {
    const message = decode(data);
    const resch = encode_channel(
      RedisMessageType.USER_ACHIEVEMENTS_SCORE,
      message.requester,
    );
    console.log(message, this.getUserAchievementsScore.name);
    await this.redisService.publish(resch, JSON.stringify(message));
  }

  // @MessagePattern({ type: RedisMessageType.USER_ACHIEVEMENTS_SCORE })
  // async getUserAchievementsScore(@Payload() data: any) {
  //   const message = decode(data);
  //   const resch = encode_channel(
  //     RedisMessageType.USER_ACHIEVEMENTS_SCORE,
  //     message.requester,
  //   );
  //   console.log(message, this.getUserAchievementsScore.name);
  //   await this.redisService.publish(resch, JSON.stringify(message));
  // }
}
