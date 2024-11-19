export type BodyDecoder<ResponseBody = undefined> = (r: Response) => Promise<ResponseBody>;

export const BodyDecoders: Record<string, BodyDecoder<any>> = {
    json: (r) => {
        return r.json();
    }
}

export type BodyDecoderNames = 'json'
