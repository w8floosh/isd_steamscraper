import { Logger, Module } from '@nestjs/common';
import { RedisService } from 'src/services/redis.service';
import { RedisInterceptor } from './redis.interceptor';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'REDIS_CLIENT',
        transport: Transport.REDIS,
        options: {
          host: '192.168.56.2',
          port: 6379,
        },
      },
    ]),
  ],
  providers: [RedisService, Logger, RedisInterceptor],
  exports: [RedisService, RedisInterceptor],
})
export class RedisModule {}
