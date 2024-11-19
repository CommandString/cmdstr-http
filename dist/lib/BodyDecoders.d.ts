export type BodyDecoder<ResponseBody = undefined> = (r: Response) => Promise<ResponseBody>;
export declare const BodyDecoders: Record<string, BodyDecoder<any>>;
export type BodyDecoderNames = 'json';
