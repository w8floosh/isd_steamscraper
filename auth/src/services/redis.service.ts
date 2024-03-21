import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ClientRedis } from '@nestjs/microservices';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy, OnModuleInit {
  public client: Redis;
  private readonly logger = new Logger(RedisService.name);
  constructor(@Inject('REDIS_CLIENT') private readonly proxy: ClientRedis) {
    this.client = this.proxy.createClient();
  }
  async onModuleInit() {
    // while (true) {
    this.logger.verbose(await this.client.ping());
    // await new Promise((resolve) => setTimeout(resolve, 10000));
    // }
  }
  async onModuleDestroy() {
    await this.client.quit();
  }
}
