import { and, eq } from "ponder";
import { db } from "ponder:api";
import { input } from "ponder:schema";
import { getAddress, numberToHex } from "viem";
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from ".";
import { paramAsAddress, paramAsHexNumber } from "./validation";

const map = (i: typeof input.$inferSelect) => {
    return {
        block_number: numberToHex(i.blockNumber),
        decoded_data: {
            application_contract: i.applicationAddress,
            block_number: numberToHex(i.blockNumber),
            block_timestamp: numberToHex(i.blockTimestamp),
            chain_id: numberToHex(i.chainId),
            index: numberToHex(i.index),
            payload: i.payload,
            prev_randao: numberToHex(i.prevRandao),
            sender: i.msgSender,
        },
        epoch_index: numberToHex(i.epochIndex),
        index: numberToHex(i.index),
        raw_data: i.rawPayload,
    };
};

export const listInputs =
    (chainId: number) =>
    async (params: {
        application: string;
        epoch_index?: string;
        sender?: string;
        limit?: number;
        offset?: number;
    }) => {
        const application = paramAsAddress(params, "application", true);
        const epochIndex = paramAsHexNumber(params, "epoch_index");
        const sender = paramAsAddress(params, "sender");
        const { limit = DEFAULT_LIMIT, offset = DEFAULT_OFFSET } = params;

        const filter = and(
            eq(input.chainId, chainId),
            eq(input.applicationAddress, getAddress(application)),
            epochIndex ? eq(input.epochIndex, epochIndex) : undefined,
            sender ? eq(input.msgSender, getAddress(sender)) : undefined,
        );
        const inputs = await db
            .select()
            .from(input)
            .where(filter)
            .limit(limit)
            .offset(offset);
        const total_count = await db.$count(input, filter);

        return {
            data: inputs.map(map),
            pagination: {
                limit,
                offset,
                total_count,
            },
        };
    };

export const getInput =
    (chainId: number) =>
    async (params: { application: string; input_index: string }) => {
        const application = paramAsAddress(params, "application", true);
        const inputIndex = paramAsHexNumber(params, "input_index", true);
        const [i] = await db
            .select()
            .from(input)
            .where(
                and(
                    eq(input.chainId, chainId),
                    eq(input.applicationAddress, application),
                    eq(input.index, inputIndex),
                ),
            );

        if (!i) {
            throw new Error(`Input not found: ${params.input_index}`);
        }
        return { data: map(i) };
    };
