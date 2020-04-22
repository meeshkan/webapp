import { Auth0Client } from 'context/auth0-context';
export declare function ensureClient(client: Auth0Client | null | undefined): Auth0Client;
export declare const DEFAULT_SCOPE = "openid profile email";
export declare function getUniqueScopes(...scopes: string[]): string;
export declare function getAccessTokenFromCache(client: Auth0Client, audience: string, scope: string): string | undefined;
