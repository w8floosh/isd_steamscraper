import {
  OAuthAuthCode,
  OAuthAuthCodeRepository,
  OAuthClient,
  OAuthScope,
  OAuthUser,
} from '@jmondi/oauth2-server';
import { RedisService } from './redis.service';
import { JwtService } from '@jmondi/oauth2-server';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthcodeService implements OAuthAuthCodeRepository {
  private authcodesKey = 'authcodes';
  constructor(
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
  ) {}

  async getByIdentifier(authcodeCode: string): Promise<OAuthAuthCode> {
    const code = await this.redisService.client.hget(
      this.authcodesKey,
      authcodeCode,
    );
    if (!code) {
      return null;
    }
    const parsed = JSON.parse(code) as OAuthAuthCode;
    return parsed;
  }

  async issueAuthCode(
    client: OAuthClient,
    user: OAuthUser,
    scopes: OAuthScope[],
  ): Promise<OAuthAuthCode> {
    const expiresAt = new Date(Date.now() + 1000 * 60 * 10);
    const code = await this.jwtService.sign({ client, user, scopes });
    const authCode: OAuthAuthCode = {
      client,
      user,
      scopes,
      code,
      expiresAt,
    };

    return authCode;
  }
  async persist(authCode: OAuthAuthCode): Promise<void> {
    const result = await this.redisService.client.hset(
      this.authcodesKey,
      authCode.code,
      JSON.stringify(authCode),
    );
    if (!result) {
      throw new Error('Failed to persist authcode: ' + authCode.code);
    }
  }
  async isRevoked(authcode: string): Promise<boolean> {
    return !!(await this.redisService.client.hexists(
      this.authcodesKey,
      authcode,
    ));
  }

  async revoke(authcode: string): Promise<void> {
    const result = await this.redisService.client.hdel(
      this.authcodesKey,
      authcode,
    );
    if (!result) {
      throw new Error('Failed to revoke authcode: ' + authcode);
    }
  }
}
