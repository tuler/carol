import { onchainEnum, onchainTable, primaryKey, relations } from "ponder";

export const application = onchainTable(
    "application",
    (t) => ({
        chainId: t.integer().notNull(),
        address: t.hex().notNull(),
        templateHash: t.hex().notNull(),
        owner: t.hex().notNull(),
    }),
    (table) => ({
        pk: primaryKey({ columns: [table.chainId, table.address] }),
    }),
);

export const authorityConsensus = onchainTable(
    "authority_consensus",
    (t) => ({
        chainId: t.integer().notNull(),
        address: t.hex().notNull(),
        owner: t.hex().notNull(),
    }),
    (table) => ({
        pk: primaryKey({ columns: [table.chainId, table.address] }),
    }),
);

export const daveConsensus = onchainTable(
    "dave_consensus",
    (t) => ({
        chainId: t.integer().notNull(),
        address: t.hex().notNull(),
        applicationAddress: t.hex(),
    }),
    (table) => ({
        pk: primaryKey({ columns: [table.chainId, table.address] }),
    }),
);

export const epochStatus = onchainEnum("status", ["OPEN", "SEALED", "CLOSED"]);

export const epoch = onchainTable(
    "epoch",
    (t) => ({
        chainId: t.integer().notNull(),
        applicationAddress: t.hex().notNull(),
        index: t.bigint().notNull(),
        status: epochStatus().notNull().default("OPEN"),
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
        fields: [epoch.applicationAddress],
        references: [application.address],
    }),
    inputs: many(input),
}));

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
    }),
    (table) => ({
        pk: primaryKey({
            columns: [table.chainId, table.applicationAddress, table.index],
        }),
    }),
);

export const inputRelations = relations(input, ({ one }) => ({
    application: one(application, {
        fields: [input.applicationAddress],
        references: [application.address],
    }),
    epoch: one(epoch, {
        fields: [input.applicationAddress, input.epochIndex],
        references: [epoch.applicationAddress, epoch.index],
    }),
}));
