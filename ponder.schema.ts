import { onchainEnum, onchainTable, primaryKey, relations } from "ponder";

export const application = onchainTable(
    "application",
    (t) => ({
        chainId: t.integer().notNull(),
        id: t.hex().notNull(),
        templateHash: t.hex().notNull(),
        owner: t.hex().notNull(),
    }),
    (table) => ({
        pk: primaryKey({ columns: [table.chainId, table.id] }),
    }),
);

export const daveConsensus = onchainTable(
    "dave_consensus",
    (t) => ({
        chainId: t.integer().notNull(),
        id: t.hex().notNull(),
        applicationId: t.hex(),
    }),
    (table) => ({
        pk: primaryKey({ columns: [table.chainId, table.id] }),
    }),
);

export const epochStatus = onchainEnum("status", ["OPEN", "SEALED", "CLOSED"]);

export const epoch = onchainTable(
    "epoch",
    (t) => ({
        chainId: t.integer().notNull(),
        applicationId: t.hex().notNull(),
        index: t.bigint().notNull(),
        firstBlock: t.bigint().notNull(),
        lastBlock: t.bigint(),
        status: epochStatus().notNull().default("OPEN"),
    }),
    (table) => ({
        pk: primaryKey({
            columns: [table.chainId, table.applicationId, table.index],
        }),
    }),
);

export const applicationRelations = relations(application, ({ many }) => ({
    epochs: many(epoch),
    inputs: many(input),
}));

export const epochRelations = relations(epoch, ({ many, one }) => ({
    application: one(application, {
        fields: [epoch.applicationId],
        references: [application.id],
    }),
    inputs: many(input),
}));

export const input = onchainTable(
    "input",
    (t) => ({
        chainId: t.integer().notNull(),
        applicationId: t.hex().notNull(),
        epochId: t.bigint().notNull(),
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
            columns: [table.chainId, table.applicationId, table.index],
        }),
    }),
);

export const inputRelations = relations(input, ({ one }) => ({
    application: one(application, {
        fields: [input.applicationId],
        references: [application.id],
    }),
    epoch: one(epoch, {
        fields: [input.applicationId, input.epochId],
        references: [epoch.applicationId, epoch.index],
    }),
}));
