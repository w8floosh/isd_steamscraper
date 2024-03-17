import { Logger, Module } from '@nestjs/common';
import { RedisService } from 'src/services/redis.service';
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
  providers: [RedisService, Logger],
  exports: [RedisService],
})
export class RedisModule {}
