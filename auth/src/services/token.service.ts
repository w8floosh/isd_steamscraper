import {
  JwtService,
  OAuthClient,
  OAuthScope,
  OAuthToken,
  OAuthTokenRepository,
  OAuthUser,
} from '@jmondi/oauth2-server';
import { RedisService } from './redis.service';
import { Injectable, UseInterceptors } from '@nestjs/common';
import { TOKENS_KEY } from 'src/lib/constants';
import { RedisInterceptor } from 'src/modules/redis/redis.interceptor';

@Injectable()
@UseInterceptors(RedisInterceptor)
export class TokenService implements OAuthTokenRepository {
  constructor(
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
  ) {}

  async issueToken(
    client: OAuthClient,
    scopes: OAuthScope[],
    user?: OAuthUser,
  ): Promise<OAuthToken> {
    const token: OAuthToken = {
      accessToken: await this.jwtService.sign({ client, scopes, user }),
      accessTokenExpiresAt: new Date(Date.now() + 3600 * 1000),
      client,
      scopes,
      user,
    };
    return token;
  }

  async getByRefreshToken(refreshTokenToken: string): Promise<OAuthToken> {
    const token = await this.redisService.client.hget(
      TOKENS_KEY,
      refreshTokenToken,
    );
    return token ? JSON.parse(token) : null;
  }

  async isRefreshTokenRevoked(refreshToken: OAuthToken): Promise<boolean> {
    return !!(await this.redisService.client.hexists(
      TOKENS_KEY,
      refreshToken.client.id,
    ));
  }

  async issueRefreshToken(
    accessToken: OAuthToken,
    client: OAuthClient,
  ): Promise<OAuthToken> {
    const token: OAuthToken = {
      ...accessToken,
      refreshToken: await this.jwtService.sign({
        accessToken,
        client,
        time: Date.now(),
      }),
      refreshTokenExpiresAt: new Date(Date.now() + 3600 * 1000),
    };
    return token;
  }

  async persist(accessToken: OAuthToken): Promise<void> {
    const result = await this.redisService.client.hset(
      TOKENS_KEY,
      accessToken.refreshToken,
      JSON.stringify(accessToken),
    );
    if (!result) {
      throw new Error('Failed to persist token');
    }
  }
  async revoke(accessToken: OAuthToken): Promise<void> {
    const result = await this.redisService.client.hdel(
      TOKENS_KEY,
      accessToken.client.id,
    );
    if (!result) {
      throw new Error('Failed to revoke token');
    }
  }
}
