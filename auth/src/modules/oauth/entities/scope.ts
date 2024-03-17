import { OAuthScope } from '@jmondi/oauth2-server';

export class Scope implements OAuthScope {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly createdAt: Date,
  ) {}

  public static fromJSON(serialized: string) {
    return this.create(JSON.parse(serialized));
  }
  public static create(data: any) {
    if (!data.id || !data.name) return undefined;
    return new Scope(
      data.id,
      data.name,
      data.createdAt ? new Date(data.createdAt) : new Date(),
    );
  }
}
