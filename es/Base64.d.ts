declare function utf8Encode(str: any): Uint8Array;
declare function utf8Decode(buffer: ArrayBuffer | Uint8Array | number[]): string;
declare function encode(u8arr: ArrayBuffer | Uint8Array | number[] | string): string;
declare function decode(base64Str: string): Uint8Array;
export { decode, encode, utf8Encode, utf8Decode };
