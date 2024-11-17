export type HttpModuleMap = Record<string, HttpModule<HttpModuleMap>>;

export type HttpRequestConfig = {
    url: string,
    method: 'GET'|'POST'|'PUT'|'DELETE',
}

export class Http<Modules extends HttpModuleMap> {
    private modules: Modules|null = null;

    protected constructor() {

    }

    m<Module extends keyof Modules>(module: Module): Modules[Module] {
        return this.modules![module];
    }

    async request(url: string, init?: RequestInit) {
        return await fetch(url, init);
    }

    static create<Modules extends HttpModuleMap>(config: {
        modules: Record<keyof Modules, (http: Http<Modules>) => Modules[keyof Modules]>
    }): Http<Modules> {
        let http = new Http();
        let createdModules = {};

        for (const [name, module] of Object.entries(config.modules)) {
            // @ts-expect-error - This is an implementation of ApiModule
            createdModules[name] = module(http) as Modules[ModuleNames];
        }

        http.modules = createdModules;

        return http as Http<Modules>;
    }
}

export class HttpModule<Modules extends HttpModuleMap> {
    constructor(
        protected http: Http<Modules>
    ) {

    }

    static moduleInitializer<T extends HttpModule<Modules>, Modules extends HttpModuleMap>(): (http: Http<Modules>) => T {
        return (http) => new this(http) as T
    }
}
