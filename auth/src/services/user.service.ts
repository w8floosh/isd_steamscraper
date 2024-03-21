import {
  GrantIdentifier,
  OAuthClient,
  OAuthUserIdentifier,
  OAuthUserRepository,
} from '@jmondi/oauth2-server';
import { RedisService } from './redis.service';
import { User } from 'src/modules/oauth/entities';
import {
  InvalidCredentialsException,
  PersistenceException,
} from 'src/lib/errors';
import { compare } from 'bcrypt';
import { Injectable, Logger, UseInterceptors } from '@nestjs/common';
import { USERS_KEY } from 'src/lib/constants';
import { RedisInterceptor } from 'src/modules/redis/redis.interceptor';

@Injectable()
@UseInterceptors(RedisInterceptor)
export class UserService implements OAuthUserRepository {
  private readonly logger = new Logger(UserService.name);
  constructor(private readonly redisService: RedisService) {}

  async getUserByCredentials(
    identifier: OAuthUserIdentifier,
    password?: string,
    grantType?: GrantIdentifier,
    client?: OAuthClient,
  ): Promise<User | undefined> {
    const user = await this.redisService.client.hscan(
      USERS_KEY,
      0,
      'MATCH',
      `*${identifier}*`,
    );

    if (user[1]) {
      const parsed = User.fromJSON(user[1][1]);
      let passwordMatches: boolean;
      if (password)
        passwordMatches = await compare(password, parsed.passwordHash);
      if (identifier && !password && !grantType && !client) return parsed;
      if (
        password &&
        grantType &&
        client &&
        passwordMatches &&
        client.allowedGrants.includes(grantType)
      ) {
        return parsed;
      } else throw new InvalidCredentialsException();
    }
    return undefined;
  }

  async registerUser(user: User) {
    const result = await this.redisService.client.hsetnx(
      USERS_KEY,
      user.id as string,
      JSON.stringify(user),
    );
    if (!result) throw new PersistenceException('user registration');
  }

  async updateUser(user: User) {
    const error = await this.redisService.client.hset(
      USERS_KEY,
      user.id as string,
      JSON.stringify(user),
    );
    if (error) {
      this.logger.error(`Failed to persist user ${user.id}`);
      throw new PersistenceException('user update');
    }
  }
}
