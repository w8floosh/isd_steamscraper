import {
  OAuthAuthCode,
  OAuthAuthCodeRepository,
  OAuthClient,
  OAuthScope,
  OAuthUser,
} from '@jmondi/oauth2-server';
import { RedisService } from './redis.service';
import { JwtService } from '@jmondi/oauth2-server';
import { Injectable, Logger, UseInterceptors } from '@nestjs/common';
import { RedisInterceptor } from 'src/controllers/interceptors/redis.interceptor';
import { AUTHCODES_KEY } from 'src/lib/constants';

@Injectable()
@UseInterceptors(RedisInterceptor)
export class AuthcodeService implements OAuthAuthCodeRepository {
  private readonly logger = new Logger(AuthcodeService.name);
  constructor(
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
  ) {}

  async getByIdentifier(authcodeCode: string): Promise<OAuthAuthCode> {
    const code = await this.redisService.client.hget(
      AUTHCODES_KEY,
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
    const code = await this.jwtService.sign({
      client: client.id,
      user: user.id,
      scopes: scopes.map((s) => s.id),
    });
    const authCode: OAuthAuthCode = {
      client,
      user,
      scopes,
      code,
      expiresAt,
    };
    console.log('issued', authCode.code.split('.')[0]);

    return authCode;
  }
  async persist(authCode: OAuthAuthCode): Promise<void> {
    const result = await this.redisService.client.hset(
      AUTHCODES_KEY,
      authCode.code,
      JSON.stringify(authCode),
    );
    console.log('persisted', result, authCode.code.split('.')[0]);

    if (!result) {
      throw new Error('Failed to persist authcode: ' + authCode.code);
    }
  }
  async isRevoked(authcode: string): Promise<boolean> {
    const code: OAuthAuthCode = await this.getByIdentifier(authcode);

    return code ? new Date() > code.expiresAt : true;
  }

  async revoke(authcode: string): Promise<void> {
    const result = await this.redisService.client.hdel(AUTHCODES_KEY, authcode);
    if (!result) {
      throw new Error('Failed to revoke authcode: ' + authcode);
    }
  }
}
