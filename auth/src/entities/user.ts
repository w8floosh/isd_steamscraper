import { OAuthUser, OAuthUserIdentifier } from '@jmondi/oauth2-server/';

export interface IUserData {
  email: string;
  username: string;
  passwordHash: string;
  lastLoginAt: number;
  lastLoginIP: string;
  steamWebAPIToken: string;
  createdIP: string;
  createdAt: number;
}

export type IUserSummary = OAuthUser &
  Omit<IUserData, 'passwordHash' | 'createdIP' | 'createdAt'>;

export class User implements IUserSummary {
  private constructor(
    public readonly id: OAuthUserIdentifier,
    public readonly email: string,
    public username: string,
    public lastLoginAt: number,
    public lastLoginIP: string,
    public steamWebAPIToken: string,
    public passwordHash?: string,
    public createdIP?: string,
    public createdAt?: number,
  ) {}

  static fromJSON(serialized: string, mode: 'full' | 'summary' = 'full') {
    return this.create(JSON.parse(serialized), mode);
  }
  static create(
    data: IUserSummary | (IUserData & OAuthUser),
    mode: 'full' | 'summary' = 'full',
  ) {
    if (!data.id || !data.email || (!data.passwordHash && mode === 'full'))
      return undefined;
    let extras: Partial<IUserData>;
    if (mode === 'full') {
      extras = {
        passwordHash: data.passwordHash,
        createdIP: data.createdIP,
        createdAt: data.createdAt,
      };
    }
    return new User(
      data.id,
      data.email,
      data.username,
      data.lastLoginAt,
      data.lastLoginIP,
      data.steamWebAPIToken,
      extras?.passwordHash,
      extras?.createdIP,
      extras?.createdAt,
    );
  }
}
