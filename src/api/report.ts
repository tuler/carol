import { and, eq } from "ponder";
import { db } from "ponder:api";
import { report } from "ponder:schema";
import { getAddress, numberToHex } from "viem";
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from ".";
import { paramAsAddress, paramAsHexNumber } from "./validation";

const map = (r: typeof report.$inferSelect) => {
    return {
        epoch_index: numberToHex(r.epochIndex),
        input_index: numberToHex(r.inputIndex),
        index: numberToHex(r.index),
        raw_data: r.rawPayload,
        created_at: new Date(Number(r.createdAt) * 1000).toISOString(),
        updated_at: new Date(Number(r.updatedAt) * 1000).toISOString(),
    };
};

export const listReports =
    (chainId: number) =>
    async (params: {
        application: string;
        epoch_index?: string;
        input_index?: string;
        limit?: number;
        offset?: number;
    }) => {
        const { limit = DEFAULT_LIMIT, offset = DEFAULT_OFFSET } = params;
        const application = paramAsAddress(params, "application", true);
        const epochIndex = paramAsHexNumber(params, "epoch_index");
        const inputIndex = paramAsHexNumber(params, "input_index");

        const filter = and(
            eq(report.chainId, chainId),
            eq(report.applicationAddress, application),
            epochIndex ? eq(report.epochIndex, epochIndex) : undefined,
            inputIndex ? eq(report.inputIndex, inputIndex) : undefined,
        );
        const reports = await db
            .select()
            .from(report)
            .where(filter)
            .limit(limit)
            .offset(offset);
        const total_count = await db.$count(report, filter);

        return {
            data: reports.map(map),
            pagination: {
                limit,
                offset,
                total_count,
            },
        };
    };

export const getReport =
    (chainId: number) =>
    async (params: { application: string; report_index: string }) => {
        const application = paramAsAddress(params, "application", true);
        const reportIndex = paramAsHexNumber(params, "report_index", true);
        const [r] = await db
            .select()
            .from(report)
            .where(
                and(
                    eq(report.chainId, chainId),
                    eq(report.applicationAddress, getAddress(application)),
                    eq(report.index, reportIndex),
                ),
            );

        if (!r) {
            throw new Error(`Report not found: ${params.report_index}`);
        }
        return { data: map(r) };
    };
