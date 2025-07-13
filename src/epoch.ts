import { and, eq } from "ponder";
import { ponder } from "ponder:registry";
import { application, daveConsensus, epoch } from "ponder:schema";
import { type Hash, isHash } from "viem";

import { tournamentAbi } from "./abis/ITournament";
import { createProofs } from "./proof";

ponder.on("DaveConsensus:EpochSealed", async ({ event, context }) => {
    console.log(`DaveConsensus(${event.log.address}):EpochSealed`, event.args);
    const dave = await context.db.find(daveConsensus, {
        chainId: context.chain.id,
        address: event.log.address,
    });

    if (dave?.applicationAddress) {
        const { applicationAddress } = dave;

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

ponder.on("Authority:ClaimAccepted", async ({ event, context }) => {
    const app = await context.db.find(application, {
        chainId: context.chain.id,
        address: event.args.appContract,
    });
    if (!app) {
        return;
    }
    console.log(`Authority(${event.log.address}):ClaimAccepted`, event.args);

    // get open epoch
    const [openEpoch] = await context.db.sql
        .select()
        .from(epoch)
        .where(
            and(
                eq(epoch.chainId, context.chain.id),
                eq(epoch.applicationAddress, event.args.appContract),
                eq(epoch.status, "OPEN"),
            ),
        );
    if (!openEpoch) {
        console.error(
            `Authority(${event.log.address}):ClaimAccepted, but no open epoch found for application ${event.args.appContract}`,
        );
        return;
    }

    // close open epoch
    // XXX: event has the block index, which is not guaranteed it is the same as the event block
    await context.db
        .update(epoch, {
            chainId: context.chain.id,
            applicationAddress: event.args.appContract,
            index: openEpoch.index,
        })
        .set({
            status: "CLOSED",
        });

    let index = openEpoch.index - 1n; // close all epochs until the open epoch
    let ep = await context.db.find(epoch, {
        chainId: context.chain.id,
        applicationAddress: event.args.appContract,
        index,
    });
    do {
        ep = await context.db.find(epoch, {
            chainId: context.chain.id,
            applicationAddress: event.args.appContract,
            index,
        });
        if (ep) {
            // if epoch is CLOSED, we are done
            if (ep.status === "CLOSED") {
                break;
            }

            await context.db
                .update(epoch, {
                    chainId: context.chain.id,
                    applicationAddress: event.args.appContract,
                    index,
                })
                .set({
                    status: "CLOSED",
                });
        } else {
            // create an empty epoch
            await context.db.insert(epoch).values({
                chainId: context.chain.id,
                applicationAddress: event.args.appContract,
                index,
                status: "CLOSED",
                createdAt: event.block.timestamp,
                updatedAt: event.block.timestamp,
            });
        }

        index--;
    } while (index >= 0);

    // create a new open epoch
    await context.db.insert(epoch).values({
        chainId: context.chain.id,
        applicationAddress: event.args.appContract,
        firstBlock: event.args.lastProcessedBlockNumber + 1n,
        index: openEpoch.index + 1n,
        status: "OPEN",
        createdAt: event.block.timestamp,
        updatedAt: event.block.timestamp,
    });
});
