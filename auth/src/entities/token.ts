import { OAuthToken } from '@jmondi/oauth2-server';
import { Client, Scope, User } from 'src/entities';
export interface ITokenMetadata {
  client: Client;
  scopes: Scope[];
  user: User;
}
export type TokenRaw = Omit<OAuthToken, 'client' | 'scopes' | 'user'> &
  ITokenMetadata;

export class Token implements TokenRaw {
  private constructor(
    public accessToken: string,
    public client: Client,
    public scopes: Scope[],
    public user: User,
    public accessTokenExpiresAt: Date,
    public refreshToken: string,
    public refreshTokenExpiresAt: Date,
  ) {}

  static fromJSON(serialized: string) {
    return this.create(JSON.parse(serialized));
  }
  static create(data: TokenRaw) {
    return new Token(
      data.accessToken,
      Client.create(data.client),
      data.scopes.map((s) => Scope.create(s)),
      User.create(data.user),
      new Date(data.accessTokenExpiresAt),
      data.refreshToken,
      new Date(data.refreshTokenExpiresAt),
    );
  }
}
