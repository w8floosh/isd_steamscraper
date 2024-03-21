import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { RedisException } from 'src/lib/errors';
import { RedisService } from 'src/services/redis.service';

@Injectable()
export class RedisInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RedisInterceptor.name);
  constructor(private readonly redisService: RedisService) {}
  async intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    if ((await this.redisService.client.ping()) !== 'PONG') {
      try {
        this.logger.verbose('Connecting to Redis');
        await this.redisService.client.connect();
        return next.handle();
      } catch (error) {
        this.logger.error('Failed to connect to Redis');
        throw new RedisException('Failed to connect to Redis');
      }
    }
    return next.handle();
  }
}
