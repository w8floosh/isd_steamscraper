import {
  GrantIdentifier,
  OAuthClient,
  OAuthScope,
  OAuthScopeRepository,
  OAuthUserIdentifier,
} from '@jmondi/oauth2-server';
import { RedisService } from './redis.service';
import { RedisException, ScopeNotFoundException } from 'src/lib/errors';
import { Injectable, OnModuleInit, UseInterceptors } from '@nestjs/common';
import { OAUTH_SCOPES, SCOPES_KEY } from 'src/lib/constants';
import { RedisInterceptor } from 'src/controllers/interceptors/redis.interceptor';

@Injectable()
@UseInterceptors(RedisInterceptor)
export class ScopeService implements OAuthScopeRepository, OnModuleInit {
  constructor(private readonly redisService: RedisService) {}

  async onModuleInit() {
    try {
      for (const [id, data] of OAUTH_SCOPES) {
        await this.redisService.client.hsetnx(
          SCOPES_KEY,
          id,
          JSON.stringify(data),
        );
      }
    } catch (e) {
      throw new RedisException(
        `Encountered ${e.message} when initializing OAuth2 scopes`,
      );
    }
  }

  async getAllByIdentifiers(scopeNames: string[]): Promise<OAuthScope[]> {
    const scopes = await this.redisService.client.hmget(
      SCOPES_KEY,
      ...scopeNames,
    );
    if (!scopes.length) {
      throw new ScopeNotFoundException(...scopeNames);
    }
    return scopes.map((scope) => JSON.parse(scope));
  }

  async finalize(
    scopes: OAuthScope[],
    identifier: GrantIdentifier,
    client: OAuthClient,
    user_id?: OAuthUserIdentifier,
  ): Promise<OAuthScope[]> {
    identifier && client && user_id; // avoid unused variable warning
    return scopes;
  }
}
