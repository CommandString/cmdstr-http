import {formToJson} from "./formToJson";
import {HttpError, HttpRequestError} from "./Errors";
import {BodyDecoders, BodyDecoder, BodyDecoderNames} from "./BodyDecoders";

/**
 * This is an extension of the global Fetch RequestInit type
 *
 * @see {global.RequestInit}
 */
export type HttpRequestConfig<
    RequestBody = undefined,
    ResponseBody = undefined
> = {
    url: string,
    method: HttpMethod,
    body?: RequestBody,
    /**
     * Query parameters to append to the URL
     */
    query?: Record<string, string>
    keepAlive?: boolean
    headers?: HeadersInit,
    redirect?: RequestRedirect
    integrity?: string
    signal?: AbortSignal | null
    credentials?: RequestCredentials
    mode?: RequestMode
    referrer?: string
    referrerPolicy?: ReferrerPolicy
    /**
     * Used for decoding the response body
     *
     * @see {BodyDecoders}
     */
    decodeBody: ResponseBody extends undefined ? undefined : (BodyDecoder<ResponseBody> | BodyDecoderNames)
    onError?: ((r: Response) => Promise<boolean | void> | boolean | void) | false
}

export type HttpMethod =
    'GET' |
    'DELETE' |
    'HEAD' |
    'OPTIONS' |
    'POST' |
    'PUT' |
    'PATCH' |
    'PURGE' |
    'LINK' |
    'UNLINK';

export type HttpModuleMap = Record<string, HttpModule<HttpModuleMap>>;

export class Http<Modules extends HttpModuleMap> {
    private _modules: Modules | null = null;

    constructor() {

    }

    m<Module extends keyof Modules>(module: Module): Modules[Module] {
        if (this._modules === null) {
            throw new HttpError('This Http instance was not created with any modules!')
        }

        return this._modules[module];
    }

    modules(): Readonly<Modules> {
        if (this._modules === null) {
            throw new HttpError('This Http instance was not created with any modules!')
        }

        return this._modules;
    }

    /**
     * @throws {HttpError|HttpRequestError}
     */
    async request<
        RequestBody extends any = undefined,
        ResponseBody extends any = undefined,
        ResponseBodyDecoder = ResponseBody extends undefined ? null : () => Promise<ResponseBody>
    >(config: HttpRequestConfig<RequestBody, ResponseBody>): Promise<{
        response: Response,
        getData: ResponseBodyDecoder
    }> {
        let headers = new Headers(config.headers);
        let body = undefined;

        const isJsonBody = headers.get('content-type')?.startsWith('application/json') ?? false;

        if (isJsonBody && typeof window !== 'undefined' && config.body instanceof HTMLFormElement) {
            body = formToJson(config.body);
        } else if (config.body instanceof FormData) {
            body = config.body;
        } else if (['object', 'array', 'string', 'undefined'].includes(typeof config.body)) {
            body = config.body;
        } else {
            throw new HttpError(`Invalid request body type ${typeof config.body}. Please see RequestInit.body https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#body `)
        }

        if (config.method === 'GET' && body !== undefined) {
            throw new HttpError('You cannot provide a body on a GET request');
        }

        if (config.query) {
            config.url += `?${new URLSearchParams(config.query)}`
        }

        let r = await fetch(config.url, {
            headers,
            body: isJsonBody ? JSON.stringify(body) : body as BodyInit,
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
            throw new HttpRequestError(r)
        }

        type RequestDecoder = BodyDecoder<ResponseBody>;

        let decoder: RequestDecoder | null = null;

        if (config.decodeBody && typeof config.decodeBody === 'string') {
            decoder = BodyDecoders[config.decodeBody];
        }

        return {
            response: r,
            getData: (decoder ? () => decoder(r) as Promise<ResponseBody> : null) as ResponseBodyDecoder
        };
    }

    static createWithModules<Modules extends HttpModuleMap>(config: {
        modules: Record<keyof Modules, CreateModule<Modules[keyof Modules]>>
    }): Http<Modules> {
        let http = new Http();
        let createdModules = {};

        for (const [name, module] of Object.entries(config.modules)) {
            // @ts-expect-error - This is an implementation of ApiModule
            createdModules[name] = module(http) as Modules[ModuleNames];
        }

        http._modules = createdModules;

        return http as Http<Modules>;
    }
}

export class HttpModule<Modules extends HttpModuleMap> {
    constructor(
        protected http: Http<Modules>
    ) {

    }
}

export type CreateModule<Module extends HttpModule<any>> = (http: Http<any>) => Module

export function createModule<
    Module extends typeof HttpModule<Modules>,
    Modules extends HttpModuleMap
>(module: Module): CreateModule<InstanceType<Module>> {
    return (http) => new module(http) as InstanceType<Module>;
}
