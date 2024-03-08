import { Module } from '@nestjs/common';
import { APIModule } from './modules/api.module';
import { RedisModule } from './modules/redis.module';

@Module({
  imports: [APIModule, RedisModule],
})
export class AppModule {}
