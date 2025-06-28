import { and, eq } from "ponder";
import { db } from "ponder:api";
import { input } from "ponder:schema";
import {
    getAddress,
    type Hex,
    hexToBigInt,
    isAddress,
    isHex,
    numberToHex,
} from "viem";
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from ".";

export const listInputs =
    (chainId: number) =>
    async (params: {
        application: string;
        epoch_index?: string;
        sender?: string;
        limit?: number;
        offset?: number;
    }) => {
        if (!isAddress(params.application)) {
            throw new Error(
                `Invalid 'application' parameter: ${params.application}`,
            );
        }
        if (params.epoch_index && !isHex(params.epoch_index)) {
            throw new Error(
                `Invalid 'epoch_index' parameter: ${params.epoch_index}`,
            );
        }
        if (params.sender && !isAddress(params.sender)) {
            throw new Error(`Invalid 'sender' parameter: ${params.sender}`);
        }

        const {
            application,
            epoch_index,
            sender,
            limit = DEFAULT_LIMIT,
            offset = DEFAULT_OFFSET,
        } = params;
        const epochIndex = epoch_index
            ? hexToBigInt(epoch_index as Hex)
            : undefined;

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
            data: inputs.map((input) => ({
                block_number: numberToHex(input.blockNumber),
                decoded_data: {
                    application_contract: input.applicationAddress,
                    block_number: numberToHex(input.blockNumber),
                    block_timestamp: numberToHex(input.blockTimestamp),
                    chain_id: numberToHex(input.chainId),
                    index: numberToHex(input.index),
                    payload: input.payload,
                    prev_randao: numberToHex(input.prevRandao),
                    sender: input.msgSender,
                },
                epoch_index: numberToHex(input.epochIndex),
                index: numberToHex(input.index),
                raw_data: input.rawPayload,
            })),
            pagination: {
                limit,
                offset,
                total_count,
            },
        };
    };
