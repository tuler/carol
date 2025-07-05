import {
    type Address,
    getAddress,
    type Hex,
    hexToBigInt,
    isAddress,
    isHex,
} from "viem";

export function paramAsAddress(
    params: { [key: string]: string | number },
    key: string,
    required: true,
): Address;
export function paramAsAddress(
    params: { [key: string]: string | number },
    key: string,
    required?: false,
): Address | undefined;

export function paramAsAddress(
    params: { [key: string]: string | number },
    key: string,
    required: boolean = false,
) {
    if (required && params[key] === undefined) {
        throw new Error(`Missing '${key}' parameter`);
    }
    if (!required && params[key] === undefined) {
        return undefined;
    }
    if (typeof params[key] !== "string" || !isAddress(params[key])) {
        throw new Error(`Invalid '${key}' parameter: ${params[key]}`);
    }
    return getAddress(params[key]);
}

export function paramAsHexNumber(
    params: { [key: string]: string | number },
    key: string,
    required: true,
): bigint;
export function paramAsHexNumber(
    params: { [key: string]: string | number },
    key: string,
    required?: false,
): bigint | undefined;
export function paramAsHexNumber(
    params: { [key: string]: string | number },
    key: string,
    required: boolean = false,
): bigint | undefined {
    if (required && params[key] === undefined) {
        throw new Error(`Missing '${key}' parameter`);
    }
    if (!required && params[key] === undefined) {
        return undefined;
    }
    if (typeof params[key] !== "string" && !isHex(params[key])) {
        throw new Error(`Invalid '${key}' parameter: ${params[key]}`);
    }
    return hexToBigInt(params[key] as Hex);
}
