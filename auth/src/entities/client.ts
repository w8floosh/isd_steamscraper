import { GrantIdentifier, OAuthClient } from '@jmondi/oauth2-server/';
import { Scope } from 'src/entities';

export class Client implements OAuthClient {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly redirectUris: string[],
    public readonly allowedGrants: GrantIdentifier[],
    public readonly scopes: Scope[],
    public readonly secret?: string,
  ) {}

  static fromJSON(serialized: string) {
    return this.create(JSON.parse(serialized));
  }
  static create(data: OAuthClient) {
    if (!data.id || !data.name) return undefined;
    return new Client(
      data.id,
      data.name,
      data.redirectUris,
      data.allowedGrants,
      data.scopes.map((s) => Scope.create(s)),
      data.secret,
    );
  }
}
