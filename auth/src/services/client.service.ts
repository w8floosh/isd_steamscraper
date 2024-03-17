import {
  GrantIdentifier,
  OAuthClient,
  OAuthClientRepository,
} from '@jmondi/oauth2-server';
import { RedisService } from './redis.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ClientService implements OAuthClientRepository {
  private clientsKey = 'oauth2_clients';
  constructor(private readonly redisService: RedisService) {}

  async getByIdentifier(clientId: string): Promise<OAuthClient> {
    const clientData = await this.redisService.client.hget(
      this.clientsKey,
      clientId,
    );
    return clientData ? JSON.parse(clientData) : null;
  }

  async isClientValid(
    grantType: GrantIdentifier,
    client: OAuthClient,
    clientSecret?: string,
  ): Promise<boolean> {
    return (
      client.allowedGrants.includes(grantType) && client.secret === clientSecret
    );
  }
}
