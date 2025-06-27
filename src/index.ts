import { and, eq } from "ponder";
import { ponder } from "ponder:registry";
import { application, daveConsensus, epoch, input } from "ponder:schema";
import { decodeFunctionData } from "viem";
import { InputsAbi } from "./abis/Inputs";

ponder.on(
    "ApplicationFactory:ApplicationCreated",
    async ({ event, context }) => {
        await context.db.insert(application).values({
            id: event.args.appContract,
            owner: event.args.appOwner,
            templateHash: event.args.templateHash,
        });
    },
);

ponder.on("Application:OwnershipTransferred", async ({ event, context }) => {
    const app = await context.db.find(application, { id: event.log.address });
    if (app) {
        await context.db
            .update(application, { id: event.log.address })
            .set({ owner: event.args.newOwner });
    }
});

ponder.on(
    "DaveConsensusFactory:DaveConsensusCreated",
    async ({ event, context }) => {
        await context.db.insert(daveConsensus).values({
            id: event.args.daveConsensus,
        });
    },
);

ponder.on("DaveConsensus:ConsensusCreation", async ({ event, context }) => {
    // create DaveConsensus if doesn't exist, attached to application
    // note that application is not guaranteed to be using this consensus,
    // as it needs a migrateToOutputsMerkleRootValidator (Application:OutputsMerkleRootValidatorChanged event)
    await context.db
        .insert(daveConsensus)
        .values({
            applicationId: event.args.appContract,
            id: event.log.address,
        })
        .onConflictDoUpdate({ applicationId: event.args.appContract });
});

ponder.on(
    "Application:OutputsMerkleRootValidatorChanged",
    async ({ event, context }) => {
        // we don't know if new validator is a DaveConsensus, try it
        const consensus = await context.db.find(daveConsensus, {
            id: event.args.newOutputsMerkleRootValidator,
        });
        if (consensus) {
            // new consensus is a (previously instantiated) DaveConsensus
            // set applicationId to the emmiter of the event
            await context.db
                .update(daveConsensus, { id: consensus.id })
                .set({ applicationId: event.log.address });
        }
    },
);

ponder.on("DaveConsensus:EpochSealed", async ({ event, context }) => {
    const consensus = await context.db.find(daveConsensus, {
        id: event.log.address,
    });
    if (consensus?.applicationId) {
        const { applicationId } = consensus;

        // close the previous epoch
        const previousEpoch = await context.db.find(epoch, {
            applicationId,
            index: event.args.epochNumber - 1n,
        });
        if (previousEpoch) {
            await context.db
                .update(epoch, { applicationId, index: previousEpoch.index })
                .set({
                    status: "CLOSED",
                });
        }

        // seal the open epoch
        await context.db
            .insert(epoch)
            .values({
                applicationId,
                firstBlock: event.args.inputIndexLowerBound,
                index: event.args.epochNumber,
                lastBlock: event.args.inputIndexUpperBound,
                status: "SEALED",
            })
            .onConflictDoUpdate({
                firstBlock: event.args.inputIndexLowerBound,
                lastBlock: event.args.inputIndexUpperBound,
                status: "SEALED",
            });

        // create a new open epoch
        await context.db.insert(epoch).values({
            applicationId,
            firstBlock: event.args.inputIndexUpperBound,
            index: event.args.epochNumber + 1n,
            status: "OPEN",
        });
    }
});

ponder.on("InputBox:InputAdded", async ({ event, context }) => {
    const { appContract, index, input: payload } = event.args;

    // find the open epoch of the application
    const [openEpoch] = await context.db.sql
        .select()
        .from(epoch)
        .where(
            and(eq(epoch.applicationId, appContract), eq(epoch.status, "OPEN")),
        );
    if (!openEpoch) {
        console.error(
            `InputBox:InputAdded: no epoch found for application ${appContract} for input index ${index}`,
        );
        return;
    }

    // check if bounds are correct
    if (index < openEpoch.firstBlock) {
        console.warn(
            `InputBox:InputAdded: input index ${index} is before the first block of the open epoch ${openEpoch.index}`,
        );
    }
    if (openEpoch.lastBlock && index >= openEpoch.lastBlock) {
        console.warn(
            `InputBox:InputAdded: input index ${index} is beyond the last block of the open epoch ${openEpoch.index}`,
        );
    }

    // decode the input as a EvmAdvance
    const data = decodeFunctionData({ abi: InputsAbi, data: event.args.input });
    const [
        chainId,
        _appContract2,
        msgSender,
        _blockNumber,
        blockTimestamp,
        prevRandao,
        _index2,
        payload2,
    ] = data.args;

    // create the input, associated to the open epoch
    await context.db.insert(input).values({
        applicationId: appContract,
        blockNumber: event.block.number,
        blockTimestamp,
        chainId,
        epochId: openEpoch.index,
        index: index,
        msgSender: msgSender,
        payload: payload2,
        prevRandao,
        rawPayload: payload,
    });
});
