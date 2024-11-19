"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpRequestError = exports.HttpError = void 0;
/**
 * The base for all errors in cmdstr-http
 *
 * You can catch all errors thrown by cmdstr-http by catching this error
 */
class HttpError extends Error {
}
exports.HttpError = HttpError;
/**
 * Thrown when a request response is not ok
 * @see {HttpError}
 */
class HttpRequestError extends HttpError {
    constructor(response) {
        super(`Request to ${response.url} failed with a response code ${response.status} | ${response.statusText}`);
        this.response = response;
    }
}
exports.HttpRequestError = HttpRequestError;
