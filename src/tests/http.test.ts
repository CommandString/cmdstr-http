import {Http, HttpModule} from "../index";

type Modules = {
    random: Random
}

abstract class BaseModule extends HttpModule<Modules> { }

class Random extends BaseModule {
    async user(): Promise<RandomUserResponse> {
        const r = await this.http.request('https://randomuser.me/api/');

        if (!r.ok) {
            throw new Error('Request Failed!');
        }

        return r.json() as unknown as RandomUserResponse;
    }
}

type TestHttp = Http<Modules>

let http: TestHttp;

test('Http.create', () => {
    http = Http.create<Modules>({
        modules: {
            random: Random.moduleInitializer()
        }
    });

    expect(http).toBeInstanceOf(Http);
});

test('Http.m', () => {
    expect(http.m('random')).toBeInstanceOf(Random);
});

test('Http.request', async () => {
    let r = await http.m('random').user();

    expect(r).toHaveProperty('results');
    expect(r).toHaveProperty('info');
    expect(r.results).toBeDefined();
    expect(r.results[0]).toHaveProperty('name')
});

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
