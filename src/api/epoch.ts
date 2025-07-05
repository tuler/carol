import { and, eq } from "ponder";
import { db } from "ponder:api";
import { epoch, type epochStatus } from "ponder:schema";
import { numberToHex } from "viem";
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from ".";
import { paramAsAddress, paramAsHexNumber } from "./validation";

type EpochStatus = (typeof epochStatus)["enumValues"][number];

const map = (ep: typeof epoch.$inferSelect) => {
    return {
        index: numberToHex(ep.index),
        status: ep.status,
    };
};

export const listEpochs =
    (chainId: number) =>
    async (params: {
        application: string;
        status?: EpochStatus;
        limit?: number;
        offset?: number;
    }) => {
        const application = paramAsAddress(params, "application", true);

        const {
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
            data: epochs.map(map),
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
        const application = paramAsAddress(params, "application", true);
        const epochIndex = paramAsHexNumber(params, "epoch_index", true);

        const [ep] = await db
            .select()
            .from(epoch)
            .where(
                and(
                    eq(epoch.chainId, chainId),
                    eq(epoch.applicationAddress, application),
                    eq(epoch.index, epochIndex),
                ),
            );

        if (!ep) {
            throw new Error(
                `Epoch not found: ${params.application} ${params.epoch_index}`,
            );
        }
        return { data: map(ep) };
    };
