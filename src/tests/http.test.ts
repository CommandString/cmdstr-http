import {
    createModule,
    Http,
    HttpModule
} from "../index";

//#####################//
//   UNIT TEST TYPES   //
//#####################//

type RandomUser = {
    name: {
        title: string,
        first: string,
        last: string
    },
    // ...
}

type RandomUserInfo = {
    seed: string,
    results: number,
    page: number,
    version: string
}

type RandomUserResponse = {
    results: RandomUser[]
    info: RandomUserInfo,
    // ...
}

type TestModules = {
    random: Random
}

abstract class TestModule extends HttpModule<TestModules> { }

class Random extends TestModule {
    async user() {
        const [r, getUser] = await this.http
            .request<
                undefined,
                RandomUserResponse
            >({
                method: 'GET',
                url: 'https://randomuser.me/api/',
                onError: (r) => {
                    console.error(`Request failed ${r.status} | ${r.statusText}`);
                },
                decodeBody: 'json'
            })

        return await getUser();
    }
}

type TestHttp = Http<TestModules>

let http: TestHttp;

//##################//
//   PROPER USAGE   //
//##################//

describe('proper usage', () => {
    test('Http.create', () => {
        http = Http.createWithModules<TestModules>({
            modules: {
                random: createModule(Random)
            }
        });

        expect(http).toBeInstanceOf(Http);
    });

    test('Http.m', () => {
        expect(http.m('random')).toBeInstanceOf(Random);
    });

    test('Http.request', async () => {
        const { random } = http.modules();

        let r = await random.user();

        expect(r).toHaveProperty('results');
        expect(r).toHaveProperty('info');
        expect(r.results).toBeDefined();
        expect(r.results[0]).toHaveProperty('name')
    });
});
