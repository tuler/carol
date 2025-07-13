import { ponder } from "ponder:registry";
import { application } from "ponder:schema";

ponder.on("DaveConsensus:ConsensusCreation", async ({ event, context }) => {
    // update application setting reference to DaveConsensus
    console.log(
        `DaveConsensus(${event.log.address}):ConsensusCreation`,
        event.args,
    );
    await context.db
        .update(application, {
            chainId: context.chain.id,
            address: event.args.appContract,
        })
        .set({
            daveConsensusAddress: event.log.address,
        });
});
