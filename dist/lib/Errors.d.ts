/**
 * The base for all errors in cmdstr-http
 *
 * You can catch all errors thrown by cmdstr-http by catching this error
 */
export declare class HttpError extends Error {
}
/**
 * Thrown when a request response is not ok
 * @see {HttpError}
 */
export declare class HttpRequestError extends HttpError {
    readonly response: Response;
    constructor(response: Response);
}
