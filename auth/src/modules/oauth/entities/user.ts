import { OAuthUser, OAuthUserIdentifier } from '@jmondi/oauth2-server/';

export class User implements OAuthUser {
  private constructor(
    public readonly id: OAuthUserIdentifier,
    public readonly email: string,
    public username: string,
    public passwordHash: string,
    public lastLoginAt: Date,
    public lastLoginIP: string,
    public createdIP: string,
    public createdAt: Date,
  ) {}

  static fromJSON(serialized: string) {
    return this.create(JSON.parse(serialized));
  }
  static create(data: any) {
    if (!data.id || !data.email || !data.passwordHash) return undefined;
    return new User(
      data.id,
      data.email,
      data.username,
      data.passwordHash,
      data.lastLoginAt ? new Date(data.lastLoginAt) : undefined,
      data.lastLoginIP,
      data.createdIP,
      data.createdAt ? new Date(data.createdAt) : new Date(),
    );
  }
}
