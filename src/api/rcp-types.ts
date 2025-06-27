import { z } from "zod";

export const jsonRpcRequestSchema = z.object({
    id: z.union([z.string(), z.number(), z.null()]),
    jsonrpc: z.literal("2.0"),
    method: z.string(),
    params: z.unknown().optional(),
});

export type JSONRPCRequest = z.infer<typeof jsonRpcRequestSchema>;

export type JSONRPCSuccessResponse<T = unknown> = {
    jsonrpc: "2.0";
    result: T;
    id: string | number | null;
};

export type JSONRPCError = {
    code: number;
    message: string;
    data?: unknown;
};

export type JSONRPCErrorResponse = {
    jsonrpc: "2.0";
    error: JSONRPCError;
    id: string | number | null;
};

export type JSONRPCResponse<T = unknown> =
    | JSONRPCSuccessResponse<T>
    | JSONRPCErrorResponse;
