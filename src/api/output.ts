import { and, eq, like } from "ponder";
import { db } from "ponder:api";
import { output } from "ponder:schema";
import {
    decodeFunctionData,
    getAddress,
    type Hex,
    isHex,
    keccak256,
    numberToHex,
    slice,
    zeroHash,
} from "viem";
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from ".";
import { outputsAbi } from "../contracts";
import { paramAsAddress, paramAsHexNumber } from "./validation";

const decodePayload = (payload: Hex): Record<string, string> => {
    const type = slice(payload, 0, 4);
    const { functionName, args } = decodeFunctionData({
        abi: outputsAbi,
        data: payload,
    });
    switch (functionName) {
        case "DelegateCallVoucher": {
            const [destination, payload] = args;
            return { type, destination, payload };
        }
        case "Notice": {
            const [payload] = args;
            return { type, payload };
        }
        case "Voucher": {
            const [destination, value, payload] = args;
            return { type, destination, value: numberToHex(value), payload };
        }
    }
};

const map = (o: typeof output.$inferSelect) => {
    const decoded_data = decodePayload(o.rawPayload);
    return {
        epoch_index: numberToHex(o.epochIndex),
        input_index: numberToHex(o.inputIndex),
        index: numberToHex(o.index),
        raw_data: o.rawPayload,
        decoded_data,
        hash: keccak256(o.rawPayload),
        output_hashes_siblings: o.proof,
        execution_transaction_hash: zeroHash, // TODO: monitor execution
        created_at: new Date(Number(o.createdAt) * 1000).toISOString(),
        updated_at: new Date(Number(o.updatedAt) * 1000).toISOString(),
    };
};

export const listOutputs =
    (chainId: number) =>
    async (params: {
        application: string;
        epoch_index?: string;
        input_index?: string;
        output_type?: string;
        voucher_address?: string;
        limit?: number;
        offset?: number;
    }) => {
        const {
            output_type,
            limit = DEFAULT_LIMIT,
            offset = DEFAULT_OFFSET,
        } = params;
        const application = paramAsAddress(params, "application", true);
        const epochIndex = paramAsHexNumber(params, "epoch_index");
        const inputIndex = paramAsHexNumber(params, "input_index");
        const outputType =
            output_type && isHex(output_type) ? output_type : undefined;
        const voucherAddress = paramAsAddress(params, "voucher_address");

        const filter = and(
            eq(output.chainId, chainId),
            eq(output.applicationAddress, application),
            epochIndex ? eq(output.epochIndex, epochIndex) : undefined,
            inputIndex ? eq(output.inputIndex, inputIndex) : undefined,
            outputType ? like(output.rawPayload, `${outputType}%`) : undefined,
            voucherAddress
                ? eq(output.voucherAddress, voucherAddress)
                : undefined,
        );
        const outputs = await db
            .select()
            .from(output)
            .where(filter)
            .limit(limit)
            .offset(offset);
        const total_count = await db.$count(output, filter);

        return {
            data: outputs.map(map),
            pagination: {
                limit,
                offset,
                total_count,
            },
        };
    };

export const getOutput =
    (chainId: number) =>
    async (params: { application: string; output_index: string }) => {
        const application = paramAsAddress(params, "application", true);
        const outputIndex = paramAsHexNumber(params, "output_index", true);
        const [o] = await db
            .select()
            .from(output)
            .where(
                and(
                    eq(output.chainId, chainId),
                    eq(output.applicationAddress, getAddress(application)),
                    eq(output.index, outputIndex),
                ),
            );

        if (!o) {
            throw new Error(`Output not found: ${params.output_index}`);
        }
        return { data: map(o) };
    };
