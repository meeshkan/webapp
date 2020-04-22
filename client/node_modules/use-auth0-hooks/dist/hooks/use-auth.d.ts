import { LoginOptions, AccessTokenRequestOptions } from '../context/auth0-context';
export interface UseAuthResult {
    /**
     * The current user.
     */
    user: any;
    /**
     * The access token.
     */
    accessToken?: string | null;
    /**
     * If the transaction failed, this will contain the error.
     */
    error: Error | null;
    /**
     * Is the transaction still ongoing.
     */
    isLoading: boolean;
    /**
     * Is the user authenticated.
     */
    isAuthenticated: boolean;
    /**
     * Sign in.
     */
    login: (options: LoginOptions) => Promise<void>;
    /**
     * Sign out.
     */
    logout: (options: LogoutOptions) => void;
}
export default function useAuth(accessTokenRequest?: AccessTokenRequestOptions): UseAuthResult;
