import { and, eq } from "ponder";
import { db } from "ponder:api";
import { epoch, type epochStatus } from "ponder:schema";
import { hexToBigInt, isAddress, isHex, numberToHex } from "viem";
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from ".";

type EpochStatus = (typeof epochStatus)["enumValues"][number];

export const listEpochs =
    (chainId: number) =>
    async (params: {
        application: string;
        status?: EpochStatus;
        limit?: number;
        offset?: number;
    }) => {
        if (!isAddress(params.application)) {
            throw new Error(
                `Invalid 'application' parameter: ${params.application}`,
            );
        }

        const {
            application,
            status,
            limit = DEFAULT_LIMIT,
            offset = DEFAULT_OFFSET,
        } = params;

        const epochs = await db
            .select()
            .from(epoch)
            .where(
                and(
                    eq(epoch.chainId, chainId),
                    eq(epoch.applicationAddress, application),
                    status ? eq(epoch.status, status) : undefined,
                ),
            )
            .limit(limit)
            .offset(offset);
        const total_count = await db.$count(
            epoch,
            and(
                eq(epoch.chainId, chainId),
                eq(epoch.applicationAddress, application),
            ),
        );

        return {
            data: epochs.map((epoch) => ({
                index: numberToHex(epoch.index),
                status: epoch.status,
            })),
            pagination: {
                limit,
                offset,
                total_count,
            },
        };
    };

export const getEpoch =
    (chainId: number) =>
    async (params: { application: string; epoch_index: string }) => {
        if (!isAddress(params.application)) {
            throw new Error(
                `Invalid 'application' parameter: ${params.application}`,
            );
        }
        if (!isHex(params.epoch_index)) {
            throw new Error(
                `Invalid 'epoch_index' parameter: ${params.epoch_index}`,
            );
        }
        const index = hexToBigInt(params.epoch_index);

        const [ep] = await db
            .select()
            .from(epoch)
            .where(
                and(
                    eq(epoch.chainId, chainId),
                    eq(epoch.applicationAddress, params.application),
                    eq(epoch.index, index),
                ),
            );
        if (!ep) {
            throw new Error(
                `Epoch not found: ${params.application} ${params.epoch_index}`,
            );
        }

        return {
            index: numberToHex(ep.index),
            status: ep.status,
        };
    };
