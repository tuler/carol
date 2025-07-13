import { and, eq } from "ponder";
import { ponder } from "ponder:registry";
import { application, epoch } from "ponder:schema";
import { type Hash, isHash } from "viem";

import { tournamentAbi } from "./abis/ITournament";
import { createProofs } from "./proof";

ponder.on("DaveConsensus:EpochSealed", async ({ event, context }) => {
    console.log(`DaveConsensus(${event.log.address}):EpochSealed`, event.args);

    // search application linked to DaveConsensus
    const app = await context.db.sql.query.application.findFirst({
        where: and(
            eq(application.chainId, context.chain.id),
            eq(application.daveConsensusAddress, event.log.address),
        ),
    });

    if (app) {
        const applicationAddress = app.address;

        // close the previous epoch (if it exists)
        const previousEpoch = await context.db.find(epoch, {
            chainId: context.chain.id,
            applicationAddress,
            index: event.args.epochNumber - 1n,
        });
        if (previousEpoch) {
            let claimHash: Hash | undefined;
            if (!previousEpoch.tournamentAddress) {
                console.error(
                    `DaveConsensus:EpochSealed, but no tournament address found for epoch ${previousEpoch.index}`,
                );
            } else {
                // get claim from epoch tournament
                const [finished, winnerCommitment, _finalState] =
                    await context.client.readContract({
                        abi: tournamentAbi,
                        address: previousEpoch.tournamentAddress,
                        functionName: "arbitrationResult",
                        args: [],
                    });
                if (finished) {
                    claimHash = isHash(winnerCommitment)
                        ? winnerCommitment
                        : undefined;
                } else {
                    console.error(
                        `DaveConsensus:EpochSealed, but previous epoch tournament ${previousEpoch.tournamentAddress} is not finished`,
                    );
                }
            }

            await context.db
                .update(epoch, {
                    chainId: context.chain.id,
                    applicationAddress,
                    index: previousEpoch.index,
                })
                .set({
                    status: "CLOSED",
                    claimHash,
                    updatedAt: event.block.timestamp,
                });

            // generate proof for outputs belonging to closed epoch
            await createProofs(context, previousEpoch);
        }

        // seal the open epoch (by index), or create if doesn't exist
        await context.db
            .insert(epoch)
            .values({
                chainId: context.chain.id,
                applicationAddress,
                index: event.args.epochNumber,
                status: "SEALED",
                createdAt: event.block.timestamp,
                updatedAt: event.block.timestamp,
            })
            .onConflictDoUpdate({
                status: "SEALED",
                tournamentAddress: event.args.tournament,
                updatedAt: event.block.timestamp,
            });

        // create a new open epoch
        await context.db.insert(epoch).values({
            chainId: context.chain.id,
            applicationAddress,
            index: event.args.epochNumber + 1n,
            firstBlock: event.args.inputIndexUpperBound,
            status: "OPEN",
            createdAt: event.block.timestamp,
            updatedAt: event.block.timestamp,
        });
    } else {
        console.warn(
            "DaveConsensus:EpochSealed, but application not associated",
        );
    }
});
