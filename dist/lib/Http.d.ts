import { BodyDecoder, BodyDecoderNames } from "./BodyDecoders";
/**
 * This is an extension of the global Fetch RequestInit type
 *
 * @see {global.RequestInit}
 */
export type HttpRequestConfig<RequestBody = undefined, ResponseBody = undefined> = {
    url: string;
    method: HttpMethod;
    body?: RequestBody;
    /**
     * Query parameters to append to the URL
     */
    query?: Record<string, string>;
    keepAlive?: boolean;
    headers?: HeadersInit;
    redirect?: RequestRedirect;
    integrity?: string;
    signal?: AbortSignal | null;
    credentials?: RequestCredentials;
    mode?: RequestMode;
    referrer?: string;
    referrerPolicy?: ReferrerPolicy;
    /**
     * Used for decoding the response body
     *
     * @see {BodyDecoders}
     */
    decodeBody: ResponseBody extends undefined ? undefined : (BodyDecoder<ResponseBody> | BodyDecoderNames);
    onError?: ((r: Response) => Promise<boolean | void> | boolean | void) | false;
};
export type HttpMethod = 'GET' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'POST' | 'PUT' | 'PATCH' | 'PURGE' | 'LINK' | 'UNLINK';
export type HttpModuleMap = Record<string, HttpModule<HttpModuleMap>>;
export declare class Http<Modules extends HttpModuleMap> {
    private _modules;
    constructor();
    m<Module extends keyof Modules>(module: Module): Modules[Module];
    modules(): Readonly<Modules>;
    /**
     * @throws {HttpError|HttpRequestError}
     */
    request<RequestBody extends any = undefined, ResponseBody extends any = undefined, ResponseBodyDecoder = ResponseBody extends undefined ? null : () => Promise<ResponseBody>>(config: HttpRequestConfig<RequestBody, ResponseBody>): Promise<[
        Response,
        ResponseBodyDecoder
    ]>;
    static createWithModules<Modules extends HttpModuleMap>(config: {
        modules: Record<keyof Modules, CreateModule<Modules[keyof Modules]>>;
    }): Http<Modules>;
}
export declare class HttpModule<Modules extends HttpModuleMap> {
    protected http: Http<Modules>;
    constructor(http: Http<Modules>);
}
export type CreateModule<Module extends HttpModule<any>> = (http: Http<any>) => Module;
export declare function createModule<Module extends typeof HttpModule<Modules>, Modules extends HttpModuleMap>(module: Module): CreateModule<InstanceType<Module>>;
