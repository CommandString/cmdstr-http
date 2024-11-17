export type HttpModuleMap = Record<string, HttpModule<HttpModuleMap>>;
export type HttpRequestConfig = {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
};
export declare class Http<Modules extends HttpModuleMap> {
    private modules;
    protected constructor();
    m<Module extends keyof Modules>(module: Module): Modules[Module];
    request(url: string, init?: RequestInit): Promise<Response>;
    static create<Modules extends HttpModuleMap>(config: {
        modules: Record<keyof Modules, (http: Http<Modules>) => Modules[keyof Modules]>;
    }): Http<Modules>;
}
export declare class HttpModule<Modules extends HttpModuleMap> {
    protected http: Http<Modules>;
    constructor(http: Http<Modules>);
    static moduleInitializer<T extends HttpModule<Modules>, Modules extends HttpModuleMap>(): (http: Http<Modules>) => T;
}
