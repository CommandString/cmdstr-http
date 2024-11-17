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
class Http {
    constructor() {
        this.modules = null;
    }
    m(module) {
        return this.modules[module];
    }
    request(url, init) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield fetch(url, init);
        });
    }
    static create(config) {
        let http = new Http();
        let createdModules = {};
        for (const [name, module] of Object.entries(config.modules)) {
            // @ts-expect-error - This is an implementation of ApiModule
            createdModules[name] = module(http);
        }
        http.modules = createdModules;
        return http;
    }
}
exports.Http = Http;
class HttpModule {
    constructor(http) {
        this.http = http;
    }
    static moduleInitializer() {
        return (http) => new this(http);
    }
}
exports.HttpModule = HttpModule;
