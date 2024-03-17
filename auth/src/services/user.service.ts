import {
  GrantIdentifier,
  OAuthClient,
  OAuthUserIdentifier,
  OAuthUserRepository,
} from '@jmondi/oauth2-server';
import { RedisService } from './redis.service';
import { User } from 'src/modules/oauth/entities';
import { InvalidCredentialsException, PersistenceError } from 'src/lib/errors';
import { hash } from 'bcrypt';
import { SALT_ROUNDS } from 'src/lib/constants';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService implements OAuthUserRepository {
  private usersKey = 'users';

  constructor(private readonly redisService: RedisService) {}
  async getUserByCredentials(
    identifier: OAuthUserIdentifier,
    password?: string,
    grantType?: GrantIdentifier,
    client?: OAuthClient,
  ): Promise<User | undefined> {
    const id = await hash(identifier.toString(), SALT_ROUNDS);
    const user = await this.redisService.client.hget(this.usersKey, id);

    if (user) {
      const parsed = User.fromJSON(user);
      if (id && !password && !grantType && !client) return parsed;
      if (
        password &&
        grantType &&
        client &&
        parsed.passwordHash === (await hash(password, SALT_ROUNDS)) &&
        client.allowedGrants.includes(grantType)
      ) {
        return parsed;
      } else throw new InvalidCredentialsException();
    }
    return undefined;
  }

  async registerUser(user: User) {
    const result = await this.redisService.client.hsetnx(
      this.usersKey,
      user.id.toString(),
      JSON.stringify(user),
    );
    if (!result) throw new PersistenceError('user registration');
  }

  async updateUser(user: User) {
    const result = await this.redisService.client.hset(
      this.usersKey,
      user.id.toString(),
      JSON.stringify(user),
    );
    if (!result) throw new PersistenceError('user update');
  }
}
