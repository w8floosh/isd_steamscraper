import { OAuthAuthCode, CodeChallengeMethod } from '@jmondi/oauth2-server';
import { Client, Scope, User } from 'src/entities';

export type AuthCodeRaw = Omit<OAuthAuthCode, 'user'> & { user?: User };
export class AuthCode implements AuthCodeRaw {
  private constructor(
    public readonly code: string,
    public client: Client,
    public scopes: Scope[],
    public expiresAt: Date,
    public user?: User,
    public codeChallenge?: string,
    public codeChallengeMethod?: CodeChallengeMethod,
  ) {}

  public static fromJSON(serialized: string) {
    return this.create(JSON.parse(serialized));
  }
  public static create(data: AuthCodeRaw) {
    if (!data.code || !data.client) return undefined;
    return new AuthCode(
      data.code,
      Client.create(data.client),
      data.scopes.map((s) => Scope.create(s)),
      data.expiresAt,
      User.create(data.user),
      data.codeChallenge,
      data.codeChallengeMethod,
    );
  }
}
