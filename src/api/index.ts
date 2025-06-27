import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { and, eq, graphql } from "ponder";
import { type config, db } from "ponder:api";
import schema, {
    application,
    epoch,
    type epochStatus,
    input,
} from "ponder:schema";
import { handleRpc } from "typed-rpc/server";
import {
    getAddress,
    type Hex,
    hexToBigInt,
    isAddress,
    isHex,
    numberToHex,
} from "viem";
import { jsonRpcRequestSchema } from "./rcp-types";

const app = new Hono();

const DEFAULT_LIMIT = 10000;
const DEFAULT_OFFSET = 0;
type EpochStatus = (typeof epochStatus)["enumValues"][number];

const service = (chainId: number) => ({
    async getApplication(params: { application: string }) {
        if (isAddress(params.application)) {
            const [app] = await db
                .select()
                .from(application)
                .where(
                    and(
                        eq(application.chainId, chainId),
                        eq(application.id, params.application),
                    ),
                );
            if (app) {
                return {
                    iapplication_address: app.id,
                    name: app.id,
                    template_hash: app.templateHash,
                };
            }
            throw new Error(`Application not found: ${params.application}`);
        }
        throw new Error(
            `Invalid 'application' parameter: ${params.application}`,
        );
    },

    async getEpoch(params: { application: string; epoch_index: string }) {
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
                    eq(epoch.applicationId, params.application),
                    eq(epoch.index, index),
                ),
            );
        if (!ep) {
            throw new Error(
                `Epoch not found: ${params.application} ${params.epoch_index}`,
            );
        }

        return {
            first_block: numberToHex(ep.firstBlock),
            index: numberToHex(ep.index),
            last_block:
                ep.lastBlock !== null ? numberToHex(ep.lastBlock) : null,
            status: ep.status,
        };
    },

    async listApplications(params?: { limit?: number; offset?: number }) {
        const { limit = DEFAULT_LIMIT, offset = DEFAULT_OFFSET } = params ?? {};
        const applications = await db
            .select()
            .from(application)
            .where(eq(application.chainId, chainId))
            .limit(limit)
            .offset(offset);
        const total_count = await db.$count(
            application,
            eq(application.chainId, chainId),
        );
        return {
            data: applications.map((app) => ({
                iapplication_address: app.id,
                name: app.id,
                template_hash: app.templateHash,
            })),
            pagination: {
                limit,
                offset,
                total_count,
            },
        };
    },

    async listEpochs(params: {
        application: string;
        status?: EpochStatus;
        limit?: number;
        offset?: number;
    }) {
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
                    eq(epoch.applicationId, application),
                    status ? eq(epoch.status, status) : undefined,
                ),
            )
            .limit(limit)
            .offset(offset);
        const total_count = await db.$count(
            epoch,
            and(
                eq(epoch.chainId, chainId),
                eq(epoch.applicationId, application),
            ),
        );

        return {
            data: epochs.map((epoch) => ({
                first_block: numberToHex(epoch.firstBlock),
                index: numberToHex(epoch.index),
                last_block:
                    epoch.lastBlock !== null
                        ? numberToHex(epoch.lastBlock)
                        : null,
                status: epoch.status,
            })),
            pagination: {
                limit,
                offset,
                total_count,
            },
        };
    },

    async listInputs(params: {
        application: string;
        epoch_index?: string;
        sender?: string;
        limit?: number;
        offset?: number;
    }) {
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
            eq(input.applicationId, getAddress(application)),
            epochIndex ? eq(input.epochId, epochIndex) : undefined,
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
                    application_contract: input.applicationId,
                    block_number: numberToHex(input.blockNumber),
                    block_timestamp: numberToHex(input.blockTimestamp),
                    chain_id: numberToHex(input.chainId),
                    index: numberToHex(input.index),
                    payload: input.payload,
                    prev_randao: numberToHex(input.prevRandao),
                    sender: input.msgSender,
                },
                epoch_index: numberToHex(input.epochId),
                index: numberToHex(input.index),
                raw_data: input.rawPayload,
            })),
            pagination: {
                limit,
                offset,
                total_count,
            },
        };
    },
});

type Chain = keyof config["default"]["chains"];

const services = {
    mainnet: service(1),
    sepolia: service(11155111),
};

app.post("/:chain/rpc", zValidator("json", jsonRpcRequestSchema), async (c) => {
    const chain = c.req.param("chain") as Chain;
    const service = services[chain];
    if (!service) {
        return c.json({ error: "Invalid chain" }, 404);
    }
    const body = c.req.valid("json");
    const result = await handleRpc(body, services[chain]);
    return c.json(result);
});

app.use("/graphql", graphql({ db, schema }));

export default app;
