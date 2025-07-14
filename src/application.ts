import { ponder } from "ponder:registry";
import { application, epoch, output } from "ponder:schema";
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

ponder.on("Application:OutputExecuted", async ({ event, context }) => {
    console.log(`Application(${event.log.address}):OutputExecuted`, event.args);
    try {
        await context.db
            .update(output, {
                chainId: context.chain.id,
                applicationAddress: event.log.address,
                index: event.args.outputIndex,
            })
            .set({ executionTransactionHash: event.transaction.hash });
    } catch {
        // ignore if output doesn't exist
        // it may be an output of an application that we don't have the machine for
    }
});
