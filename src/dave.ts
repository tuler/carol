import { ponder } from "ponder:registry";
import { daveConsensus } from "ponder:schema";

ponder.on(
    "DaveConsensusFactory:DaveConsensusCreated",
    async ({ event, context }) => {
        console.log(
            `DaveConsensusFactory(${event.log.address}):DaveConsensusCreated`,
            event.args,
        );
        await context.db.insert(daveConsensus).values({
            chainId: context.chain.id,
            address: event.args.daveConsensus,
        });
    },
);

ponder.on("DaveConsensus:ConsensusCreation", async ({ event, context }) => {
    // create DaveConsensus if doesn't exist, attached to application
    // note that application is not guaranteed to be using this consensus,
    // as it needs a migrateToOutputsMerkleRootValidator (Application:OutputsMerkleRootValidatorChanged event)
    console.log(
        `DaveConsensus(${event.log.address}):ConsensusCreation`,
        event.args,
    );
    await context.db
        .insert(daveConsensus)
        .values({
            chainId: context.chain.id,
            applicationAddress: event.args.appContract,
            address: event.log.address,
        })
        .onConflictDoUpdate({ applicationAddress: event.args.appContract });
});
