import { OAuthUser, OAuthUserIdentifier } from '@jmondi/oauth2-server/';

export interface IUserData {
  email: string;
  username: string;
  passwordHash: string;
  lastLoginAt: Date;
  lastLoginIP: string;
  createdIP: string;
  createdAt: Date;
}

export type IUserSummary = OAuthUser &
  Omit<IUserData, 'passwordHash' | 'createdIP' | 'createdAt'>;

export class User implements IUserSummary {
  private constructor(
    public readonly id: OAuthUserIdentifier,
    public readonly email: string,
    public username: string,
    public lastLoginAt: Date,
    public lastLoginIP: string,
    public passwordHash?: string,
    public createdIP?: string,
    public createdAt?: Date,
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
      data.lastLoginAt ? new Date(data.lastLoginAt) : undefined,
      data.lastLoginIP,
      extras?.passwordHash,
      extras?.createdIP,
      extras?.createdAt,
    );
  }
}
