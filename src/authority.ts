import { ponder } from "ponder:registry";
import { authorityConsensus } from "ponder:schema";
import { authorityAbi } from "./contracts";

// handle authority creation through factory
ponder.on("AuthorityFactory:AuthorityCreated", async ({ event, context }) => {
    console.log(
        `AuthorityFactory(${event.log.address}):AuthorityCreated`,
        event.args,
    );
    // query epoch length from chain, because it's not in the event
    const epochLength = await context.client.readContract({
        abi: authorityAbi,
        functionName: "getEpochLength",
        address: event.args.authority,
    });

    // query owner from chain, because it's not in the event
    const owner = await context.client.readContract({
        abi: authorityAbi,
        functionName: "owner",
        address: event.args.authority,
    });

    // start block of first epoch
    const startBlock = event.block.number - (event.block.number % epochLength);

    await context.db
        .insert(authorityConsensus)
        .values({
            chainId: context.chain.id,
            address: event.args.authority,
            owner,
            epochLength,
        })
        .onConflictDoNothing();
});

// handle ownership transfer
ponder.on("Authority:OwnershipTransferred", async ({ event, context }) => {
    console.log(
        `Authority(${event.log.address}):OwnershipTransferred`,
        event.args,
    );

    // query epoch length from chain, because it's not in the event
    const epochLength = await context.client.readContract({
        abi: authorityAbi,
        functionName: "getEpochLength",
        address: event.log.address,
    });

    // upsert authority
    await context.db
        .insert(authorityConsensus)
        .values({
            chainId: context.chain.id,
            address: event.log.address,
            owner: event.args.newOwner,
            epochLength,
        })
        .onConflictDoUpdate({
            owner: event.args.newOwner,
            epochLength,
        });
});
