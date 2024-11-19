"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpModule = exports.Http = void 0;
exports.createModule = createModule;
const formToJson_1 = require("./formToJson");
const Errors_1 = require("./Errors");
const BodyDecoders_1 = require("./BodyDecoders");
class Http {
    constructor() {
        this._modules = null;
    }
    m(module) {
        if (this._modules === null) {
            throw new Errors_1.HttpError('This Http instance was not created with any modules!');
        }
        return this._modules[module];
    }
    modules() {
        if (this._modules === null) {
            throw new Errors_1.HttpError('This Http instance was not created with any modules!');
        }
        return this._modules;
    }
    /**
     * @throws {HttpError|HttpRequestError}
     */
    request(config) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            let headers = new Headers(config.headers);
            let body = undefined;
            const isJsonBody = (_b = (_a = headers.get('content-type')) === null || _a === void 0 ? void 0 : _a.startsWith('application/json')) !== null && _b !== void 0 ? _b : false;
            if (isJsonBody && typeof window !== 'undefined' && config.body instanceof HTMLFormElement) {
                body = (0, formToJson_1.formToJson)(config.body);
            }
            else if (config.body instanceof FormData) {
                body = config.body;
            }
            else if (['object', 'array', 'string', 'undefined'].includes(typeof config.body)) {
                body = config.body;
            }
            else {
                throw new Errors_1.HttpError(`Invalid request body type ${typeof config.body}. Please see RequestInit.body https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#body `);
            }
            if (config.method === 'GET' && body !== undefined) {
                throw new Errors_1.HttpError('You cannot provide a body on a GET request');
            }
            if (config.query) {
                config.url += `?${new URLSearchParams(config.query)}`;
            }
            let r = yield fetch(config.url, {
                headers,
                body: isJsonBody ? JSON.stringify(body) : body,
                method: config.method,
                keepalive: config.keepAlive,
                redirect: config.redirect,
                integrity: config.integrity,
                signal: config.signal,
                credentials: config.credentials,
                mode: config.mode,
                referrer: config.referrer,
                referrerPolicy: config.referrerPolicy,
            });
            if (!r.ok && config.onError !== false && (!config.onError || !config.onError(r))) {
                throw new Errors_1.HttpRequestError(r);
            }
            let decoder = null;
            if (config.decodeBody && typeof config.decodeBody === 'string') {
                decoder = BodyDecoders_1.BodyDecoders[config.decodeBody];
            }
            return [r, (decoder ? () => decoder(r) : null)];
        });
    }
    static createWithModules(config) {
        let http = new Http();
        let createdModules = {};
        for (const [name, module] of Object.entries(config.modules)) {
            // @ts-expect-error - This is an implementation of ApiModule
            createdModules[name] = module(http);
        }
        http._modules = createdModules;
        return http;
    }
}
exports.Http = Http;
class HttpModule {
    constructor(http) {
        this.http = http;
    }
}
exports.HttpModule = HttpModule;
function createModule(module) {
    return (http) => new module(http);
}
