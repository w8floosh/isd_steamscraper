import { OAuthToken } from '@jmondi/oauth2-server';
import { Client, Scope, User } from 'src/modules/oauth/entities';

export class Token implements OAuthToken {
  private constructor(
    public accessToken: string,
    public client: Client,
    public scopes: Scope[],
    public user: User,
    public accessTokenExpiresAt: Date,
    public refreshToken: string,
    public refreshTokenExpiresAt: Date,
    public userId: string,
    public clientId: string,
    public createdAt: Date,
  ) {}

  static fromJSON(serialized: string) {
    return this.create(JSON.parse(serialized));
  }
  static create(data: any) {
    return new Token(
      data.accessToken,
      Client.create(data.client),
      data.scopes?.map((s) => Scope.create(s)),
      User.create(data.user),
      new Date(data.accessTokenExpiresAt),
      data.refreshToken,
      new Date(data.refreshTokenExpiresAt),
      data.userId,
      data.clientId,
      new Date(data.createdAt),
    );
  }
}
