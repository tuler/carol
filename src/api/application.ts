import { and, eq } from "ponder";
import { db } from "ponder:api";
import { application } from "ponder:schema";
import { isAddress } from "viem";
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from ".";

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
            data: applications.map((app) => ({
                iapplication_address: app.address,
                name: app.address,
                template_hash: app.templateHash,
            })),
            pagination: {
                limit,
                offset,
                total_count,
            },
        };
    };

export const getApplication =
    (chainId: number) => async (params: { application: string }) => {
        if (isAddress(params.application)) {
            const [app] = await db
                .select()
                .from(application)
                .where(
                    and(
                        eq(application.chainId, chainId),
                        eq(application.address, params.application),
                    ),
                );
            if (app) {
                return {
                    iapplication_address: app.address,
                    name: app.address,
                    template_hash: app.templateHash,
                };
            }
            throw new Error(`Application not found: ${params.application}`);
        }
        throw new Error(
            `Invalid 'application' parameter: ${params.application}`,
        );
    };
