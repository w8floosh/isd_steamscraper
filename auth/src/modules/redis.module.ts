import { Logger, Module } from '@nestjs/common';
import { RedisService } from 'src/services/redis.service';
import { RedisInterceptor } from '../controllers/interceptors/redis.interceptor';
import { ClientsModule, RedisOptions, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'REDIS_CLIENT',
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST || '192.168.56.2',
          port: process.env.REDIS_PORT || 6379,
        },
        retryAttempts: 5,
        retryDelay: 1000,
      } as RedisOptions & { name: string },
    ]),
  ],
  providers: [RedisService, Logger, RedisInterceptor],
  exports: [RedisService, RedisInterceptor],
})
export class RedisModule {}
