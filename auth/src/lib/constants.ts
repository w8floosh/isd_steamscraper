import { OAuthScope } from '@jmondi/oauth2-server/index';

export const SALT_ROUNDS = 8;
export const OAUTH_SCOPES = new Map<string, OAuthScope>([
  ['all', { id: 'all', name: 'all' }],
]);
export const SCOPES_KEY = 'oauth2:scopes';
export const CLIENTS_KEY = 'oauth2:clients';
export const USERS_KEY = 'oauth2:users';
export const AUTHCODES_KEY = 'oauth2:authcodes';
export const TOKENS_KEY = 'oauth2:tokens';
