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
  private pingInterval: NodeJS.Timeout;
  private readonly logger = new Logger(RedisService.name);
  constructor(@Inject('REDIS_CLIENT') private readonly proxy: ClientRedis) {
    this.client = this.proxy.createClient();
  }
  async onModuleInit() {
    this.pingInterval = setInterval(async () => {
      this.logger.verbose(await this.client.ping());
    }, 240000);
  }
  async onModuleDestroy() {
    clearInterval(this.pingInterval);
    await this.client.quit();
  }
}
