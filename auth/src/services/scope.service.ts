import {
  GrantIdentifier,
  OAuthClient,
  OAuthScope,
  OAuthScopeRepository,
  OAuthUserIdentifier,
} from '@jmondi/oauth2-server';
import { RedisService } from './redis.service';
import { RedisError, ScopeNotFoundException } from 'src/lib/errors';
import { Scope } from 'src/modules/oauth/entities';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class ScopeService implements OAuthScopeRepository, OnModuleInit {
  private scopesKey = 'scopes';
  constructor(private readonly redisService: RedisService) {}

  async onModuleInit() {
    try {
      await this.redisService.client.hsetnx(
        this.scopesKey,
        'all',
        JSON.stringify(Scope.create({ id: 'all', name: 'all' })),
      );
    } catch (e) {
      throw new RedisError(
        `Encountered ${e.message} when initializing OAuth2 scopes`,
      );
    }
  }

  async getAllByIdentifiers(scopeNames: string[]): Promise<OAuthScope[]> {
    const scopes = await this.redisService.client.hmget(
      this.scopesKey,
      ...scopeNames,
    );
    if (!scopes.length) {
      throw new ScopeNotFoundException(...scopeNames);
    }
    return scopes.map((scope) => Scope.fromJSON(scope));
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
