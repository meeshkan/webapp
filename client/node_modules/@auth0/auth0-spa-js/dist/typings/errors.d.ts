export declare class GenericError extends Error {
    error: string;
    error_description: string;
    constructor(error: string, error_description: string);
}
export declare class AuthenticationError extends GenericError {
    state: string;
    appState: any;
    constructor(error: string, error_description: string, state: string, appState?: any);
}
