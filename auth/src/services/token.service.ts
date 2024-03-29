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
import { RedisInterceptor } from 'src/controllers/interceptors/redis.interceptor';

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
    return {
      accessToken: await this.jwtService.sign({
        client: client.id,
        scopes: scopes.map((s) => s.id),
        user: user.id,
      }),
      accessTokenExpiresAt: new Date(Date.now() + 20 * 1000), // @todo CHANGE THIS TO 3600
      client,
      scopes,
      user,
    };
  }

  async getByRefreshToken(refreshTokenToken: string): Promise<OAuthToken> {
    const token = await this.redisService.client.hget(
      TOKENS_KEY,
      refreshTokenToken,
    );
    return token ? JSON.parse(token) : null;
  }

  async isRefreshTokenRevoked(token: OAuthToken): Promise<boolean> {
    const storedToken = await this.getByRefreshToken(token.refreshToken);
    return storedToken ? new Date() > storedToken.refreshTokenExpiresAt : true;
  }

  async issueRefreshToken(
    accessToken: OAuthToken,
    client: OAuthClient,
  ): Promise<OAuthToken> {
    const token = {
      client: client.id,
      ...accessToken,
      refreshToken: await this.jwtService.sign({
        accessToken: accessToken.accessToken,
        iat: Date.now(),
      }),
      refreshTokenExpiresAt: new Date(Date.now() + 60 * 60 * 24 * 1000),
    };
    return token;
  }

  async persist(token: OAuthToken): Promise<void> {
    const result = await this.redisService.client.hset(
      TOKENS_KEY,
      token.accessToken,
      JSON.stringify(token),
    );
    if (!result) {
      throw new Error('Failed to persist token');
    }
  }
  async revoke(token: OAuthToken): Promise<void> {
    const persistedToken = await this.getByRefreshToken(token.refreshToken);

    if (!persistedToken) {
      throw new Error('Failed to revoke token: not found');
    }

    const revokedToken: OAuthToken = { ...persistedToken };
    revokedToken.accessTokenExpiresAt = new Date(0);
    revokedToken.refreshTokenExpiresAt = new Date(0);

    const revoked = await this.redisService.client.hset(
      TOKENS_KEY,
      token.accessToken,
      JSON.stringify(revokedToken),
    );

    if (!revoked) {
      throw new Error('Failed to revoke token: could not persist changes');
    }
  }
}
