import {
  GrantIdentifier,
  OAuthClient,
  OAuthClientRepository,
} from '@jmondi/oauth2-server';
import { RedisService } from './redis.service';
import { Injectable, UseInterceptors } from '@nestjs/common';
import { Client, Scope } from 'src/entities';
import { CLIENTS_KEY, OAUTH_SCOPES, SCOPES_KEY } from 'src/lib/constants';
import { Request } from 'express';
import { AuthorizeEndpointParsedQs } from 'src/lib/types';
import { RedisInterceptor } from 'src/controllers/interceptors/redis.interceptor';

@Injectable()
@UseInterceptors(RedisInterceptor)
export class ClientService implements OAuthClientRepository {
  constructor(private readonly redisService: RedisService) {}

  // async onModuleInit() {
  //   const scopes = [];
  //   for (const scope of OAUTH_SCOPES) {
  //     const serialized = await this.redisService.client.hget(SCOPES_KEY, scope);
  //     scopes.push(Scope.fromJSON(serialized));
  //   }
  //   await this.redisService.client.hset(
  //     CLIENTS_KEY,
  //     'steamscraper_client',
  //     JSON.stringify(
  //       Client.create({
  //         id: 'steamscraper_client',
  //         name: 'Steam Scraper',
  //         redirectUris: [],
  //         allowedGrants: ['authorization_code'],
  //         scopes,
  //       }),
  //     ),
  //   );
  // }
  async getByIdentifier(clientId: string): Promise<OAuthClient> {
    const clientData = await this.redisService.client.hget(
      CLIENTS_KEY,
      clientId,
    );
    return clientData ? JSON.parse(clientData) : null;
  }

  async isClientValid(
    grantType: GrantIdentifier,
    client: OAuthClient,
    clientSecret?: string,
  ): Promise<boolean> {
    return client.allowedGrants.includes(grantType) &&
      client.secret === clientSecret
      ? Promise.resolve(true)
      : Promise.resolve(false);
  }

  async register(request: Request): Promise<void> {
    if ((await this.redisService.client.ping()) !== 'PONG') {
      await this.redisService.client.connect();
    }
    const query = request.query as AuthorizeEndpointParsedQs;
    const scopes: Scope[] = await Promise.all(
      OAUTH_SCOPES.map(async (s) => {
        const serialized = await this.redisService.client.hget(SCOPES_KEY, s);
        const scope = Scope.fromJSON(serialized);
        return scope;
      }),
    );

    const client = Client.create({
      id: query.client_id,
      name: query.client_id,
      redirectUris: [query.redirect_uri],
      allowedGrants: ['authorization_code'],
      scopes,
    });
    await this.redisService.client.hset(
      CLIENTS_KEY,
      client.id,
      JSON.stringify(client),
    );
  }
}
