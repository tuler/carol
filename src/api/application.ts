import { and, eq } from "ponder";
import { db } from "ponder:api";
import { application } from "ponder:schema";
import { decodeFunctionData, numberToHex, zeroAddress } from "viem";
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from ".";
import { dataAvailabilityAbi } from "../contracts";
import { paramAsAddress } from "./validation";

const map = (app: typeof application.$inferSelect) => {
    // decode data availability
    const { functionName, args } = decodeFunctionData({
        abi: dataAvailabilityAbi,
        data: app.dataAvailability,
    });
    let inputbox_address: string;
    switch (functionName) {
        case "InputBox":
            inputbox_address = args[0];
            break;
        case "InputBoxAndEspresso":
            inputbox_address = args[0];
    }

    return {
        name: app.address,
        iapplication_address: app.address,
        iconsensus_address: zeroAddress, // XXX: relation to consensus
        inputbox_address,
        template_hash: app.templateHash,
        epoch_length: numberToHex(10), // XXX: does not make sense for PRT
        data_availability: app.dataAvailability,
        state: "DISABLED",
        iinputbox_block: numberToHex(0), // XXX: does not make sense for PRT
        last_input_check_block: numberToHex(0), // XXX: does not make sense for PRT
        last_output_check_block: numberToHex(0), // XXX: does not make sense for PRT
        processed_inputs: numberToHex(0), // XXX: not implemented
        created_at: new Date(Number(app.createdAt) * 1000).toISOString(),
        updated_at: new Date(Number(app.updatedAt) * 1000).toISOString(),
    };
};

export const listApplications =
    (chainId: number) =>
    async (params?: { limit?: number; offset?: number }) => {
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
            data: applications.map(map),
            pagination: {
                limit,
                offset,
                total_count,
            },
        };
    };

export const getApplication =
    (chainId: number) => async (params: { application: string }) => {
        const address = paramAsAddress(params, "application", true);
        const [app] = await db
            .select()
            .from(application)
            .where(
                and(
                    eq(application.chainId, chainId),
                    eq(application.address, address),
                ),
            );

        if (!app) {
            throw new Error(`Application not found: ${address}`);
        }
        return { data: map(app) };
    };
