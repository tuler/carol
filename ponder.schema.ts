import { onchainEnum, onchainTable, primaryKey, relations } from "ponder";
import type { Hash } from "viem";

export const application = onchainTable(
    "application",
    (t) => ({
        chainId: t.integer().notNull(),
        address: t.hex().notNull(),
        daveConsensusAddress: t.hex(),
        templateHash: t.hex().notNull(),
        owner: t.hex().notNull(),
        dataAvailability: t.hex().notNull(),
        createdAt: t.bigint().notNull(),
        updatedAt: t.bigint().notNull(),
    }),
    (table) => ({
        pk: primaryKey({ columns: [table.chainId, table.address] }),
    }),
);

export const epochStatus = onchainEnum("epoch_status", [
    "OPEN",
    "SEALED",
    "CLOSED",
]);

export const epoch = onchainTable(
    "epoch",
    (t) => ({
        chainId: t.integer().notNull(),
        applicationAddress: t.hex().notNull(),
        index: t.bigint().notNull(),
        tournamentAddress: t.hex(),
        claimHash: t.hex(),
        status: epochStatus().notNull().default("OPEN"),
        createdAt: t.bigint().notNull(),
        updatedAt: t.bigint().notNull(),
    }),
    (table) => ({
        pk: primaryKey({
            columns: [table.chainId, table.applicationAddress, table.index],
        }),
    }),
);

export const applicationRelations = relations(application, ({ many }) => ({
    epochs: many(epoch),
    inputs: many(input),
}));

export const epochRelations = relations(epoch, ({ many, one }) => ({
    application: one(application, {
        fields: [epoch.chainId, epoch.applicationAddress],
        references: [application.chainId, application.address],
    }),
    inputs: many(input),
}));

export const inputStatus = onchainEnum("input_status", [
    "NONE",
    "ACCEPTED",
    "REJECTED",
    "EXCEPTION",
    "MACHINE_HALTED",
    "OUTPUTS_LIMIT_EXCEEDED",
    "CYCLE_LIMIT_EXCEEDED",
    "TIME_LIMIT_EXCEEDED",
    "PAYLOAD_LENGTH_LIMIT_EXCEEDED",
]);

export const input = onchainTable(
    "input",
    (t) => ({
        chainId: t.integer().notNull(),
        applicationAddress: t.hex().notNull(),
        epochIndex: t.bigint().notNull(),
        index: t.bigint().notNull(),
        blockNumber: t.bigint().notNull(),
        blockTimestamp: t.bigint().notNull(),
        prevRandao: t.bigint().notNull(),
        msgSender: t.hex().notNull(),
        rawPayload: t.hex().notNull(),
        payload: t.hex().notNull(),
        status: inputStatus().notNull().default("NONE"),
        transactionHash: t.hex().notNull(),
        createdAt: t.bigint().notNull(),
        updatedAt: t.bigint().notNull(),
    }),
    (table) => ({
        pk: primaryKey({
            columns: [table.chainId, table.applicationAddress, table.index],
        }),
    }),
);

export const inputRelations = relations(input, ({ one }) => ({
    application: one(application, {
        fields: [input.chainId, input.applicationAddress],
        references: [application.chainId, application.address],
    }),
    epoch: one(epoch, {
        fields: [input.chainId, input.applicationAddress, input.epochIndex],
        references: [epoch.chainId, epoch.applicationAddress, epoch.index],
    }),
}));

export const output = onchainTable(
    "output",
    (t) => ({
        chainId: t.integer().notNull(),
        applicationAddress: t.hex().notNull(),
        epochIndex: t.bigint().notNull(),
        inputIndex: t.bigint().notNull(),
        index: t.bigint().notNull(),
        rawPayload: t.hex().notNull(),
        voucherAddress: t.hex(),
        proof: t.json().$type<Hash[]>(),
        executionTransactionHash: t.hex(),
        createdAt: t.bigint().notNull(),
        updatedAt: t.bigint().notNull(),
    }),
    (table) => ({
        pk: primaryKey({
            columns: [table.chainId, table.applicationAddress, table.index],
        }),
    }),
);

export const outputRelations = relations(output, ({ one }) => ({
    application: one(application, {
        fields: [output.chainId, output.applicationAddress],
        references: [application.chainId, application.address],
    }),
    epoch: one(epoch, {
        fields: [output.chainId, output.applicationAddress, output.epochIndex],
        references: [epoch.chainId, epoch.applicationAddress, epoch.index],
    }),
    input: one(input, {
        fields: [output.chainId, output.applicationAddress, output.inputIndex],
        references: [input.chainId, input.applicationAddress, input.index],
    }),
}));

export const report = onchainTable(
    "report",
    (t) => ({
        chainId: t.integer().notNull(),
        applicationAddress: t.hex().notNull(),
        epochIndex: t.bigint().notNull(),
        inputIndex: t.bigint().notNull(),
        index: t.bigint().notNull(),
        rawPayload: t.hex().notNull(),
        createdAt: t.bigint().notNull(),
        updatedAt: t.bigint().notNull(),
    }),
    (table) => ({
        pk: primaryKey({
            columns: [
                table.chainId,
                table.applicationAddress,
                table.inputIndex,
                table.index,
            ],
        }),
    }),
);

export const reportRelations = relations(report, ({ one }) => ({
    application: one(application, {
        fields: [report.chainId, report.applicationAddress],
        references: [application.chainId, application.address],
    }),
    epoch: one(epoch, {
        fields: [report.chainId, report.applicationAddress, report.epochIndex],
        references: [epoch.chainId, epoch.applicationAddress, epoch.index],
    }),
    input: one(input, {
        fields: [report.chainId, report.applicationAddress, report.inputIndex],
        references: [input.chainId, input.applicationAddress, input.index],
    }),
}));
