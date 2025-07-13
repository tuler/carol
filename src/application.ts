import { and, eq } from "ponder";
import { ponder } from "ponder:registry";
import {
    application,
    authorityConsensus,
    daveConsensus,
    epoch,
    input,
} from "ponder:schema";
import { create } from "./machine";

ponder.on(
    "ApplicationFactory:ApplicationCreated",
    async ({ event, context }) => {
        console.log(
            `ApplicationFactory(${event.log.address}):ApplicationCreated`,
            event.args,
        );

        // try to instantiate the CM
        try {
            create(event.args.templateHash);
        } catch {
            console.log(
                `fail loading machine for templateHash ${event.args.templateHash}`,
            );
        }

        // create application
        await context.db.insert(application).values({
            chainId: context.chain.id,
            address: event.args.appContract,
            owner: event.args.appOwner,
            templateHash: event.args.templateHash,
            dataAvailability: event.args.dataAvailability,
            createdAt: event.block.timestamp,
            updatedAt: event.block.timestamp,
        });

        // create a new open epoch
        await context.db.insert(epoch).values({
            chainId: context.chain.id,
            applicationAddress: event.args.appContract,
            index: 0n,
            firstBlock: event.block.number,
            status: "OPEN",
            createdAt: event.block.timestamp,
            updatedAt: event.block.timestamp,
        });
    },
);

ponder.on("Application:OwnershipTransferred", async ({ event, context }) => {
    console.log(
        `Application(${event.log.address}):OwnershipTransferred`,
        event.args,
    );
    const app = await context.db.find(application, {
        chainId: context.chain.id,
        address: event.log.address,
    });
    if (app) {
        await context.db
            .update(application, {
                chainId: context.chain.id,
                address: event.log.address,
            })
            .set({ owner: event.args.newOwner });
    }
});

ponder.on(
    "Application:OutputsMerkleRootValidatorChanged",
    async ({ event, context }) => {
        console.log(
            `Application(${event.log.address}):OutputsMerkleRootValidatorChanged`,
            event.args,
        );
        // check if app already have inputs, and reject if so
        const inputCount = await context.db.sql.$count(
            input,
            and(
                eq(input.chainId, context.chain.id),
                eq(input.applicationAddress, event.log.address),
            ),
        );
        if (inputCount > 0) {
            console.error(
                `Application:OutputsMerkleRootValidatorChanged not supported by Application with inputs`,
            );

            // TODO: disable application, because it's in a state that is not supported
            // XXX: this will probably fail, because there are references to this application in other tables
            return;
        }

        // we don't know if new validator is a DaveConsensus, try it
        const dave = await context.db.find(daveConsensus, {
            chainId: context.chain.id,
            address: event.args.newOutputsMerkleRootValidator,
        });
        if (dave) {
            // new consensus is a (previously instantiated) DaveConsensus
            // set applicationId to the emmiter of the event
            await context.db
                .update(daveConsensus, {
                    chainId: context.chain.id,
                    address: dave.address,
                })
                .set({ applicationAddress: event.log.address });
            return;
        }

        const auth = await context.db.find(authorityConsensus, {
            chainId: context.chain.id,
            address: event.args.newOutputsMerkleRootValidator,
        });
        if (auth) {
            console.error(
                `Application:OutputsMerkleRootValidatorChanged not supported by Application with authority consensus`,
            );
            // TODO: handle epoch?
        }
    },
);
