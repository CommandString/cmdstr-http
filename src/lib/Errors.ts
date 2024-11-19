/**
 * The base for all errors in cmdstr-http
 *
 * You can catch all errors thrown by cmdstr-http by catching this error
 */
export class HttpError extends Error {

}

/**
 * Thrown when a request response is not ok
 * @see {HttpError}
 */
export class HttpRequestError extends HttpError {
    constructor(
        public readonly response: Response
    ) {
        super(`Request to ${response.url} failed with a response code ${response.status} | ${response.statusText}`);
    }
}
