import { OAuthAuthCode, CodeChallengeMethod } from '@jmondi/oauth2-server';
import { Client, Scope, User } from 'src/modules/oauth/entities';

export class AuthCode implements OAuthAuthCode {
  private constructor(
    public readonly code: string,
    public client: Client,
    public scopes: Scope[],
    public expiresAt: Date,
    public createdAt: Date,
    public user?: User,
    public codeChallenge?: string,
    public codeChallengeMethod?: CodeChallengeMethod,
  ) {}

  public static fromJSON(serialized: string) {
    return this.create(JSON.parse(serialized));
  }
  public static create(data: any) {
    if (!data.code || !data.client) return undefined;
    return new AuthCode(
      data.code,
      data.client,
      data.scopes?.map((s) => Scope.create(s)) || [],
      data.expiresAt
        ? new Date(data.expiresAt)
        : new Date(Date.now() + 3600 * 1000),
      data.createdAt ? new Date(data.createdAt) : new Date(),
      User.create(data.user),
      data.codeChallenge,
      data.codeChallengeMethod,
    );
  }
}
