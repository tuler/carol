import { and, eq } from "ponder";
import { ponder } from "ponder:registry";
import { application, epoch, input } from "ponder:schema";
import { decodeFunctionData } from "viem";
import { InputsAbi } from "./abis/Inputs";

ponder.on("InputBox:InputAdded", async ({ event, context }) => {
    const { appContract, index, input: payload } = event.args;

    const app = await context.db.find(application, {
        chainId: context.chain.id,
        address: event.args.appContract,
    });
    if (!app) {
        return;
    }

    // find the open epoch of the application
    const [openEpoch] = await context.db.sql
        .select()
        .from(epoch)
        .where(
            and(
                eq(epoch.chainId, context.chain.id),
                eq(epoch.applicationAddress, appContract),
                eq(epoch.status, "OPEN"),
            ),
        );
    if (!openEpoch) {
        console.error(
            `InputBox:InputAdded: no OPEN epoch found for application ${appContract}`,
        );
        return;
    }

    // decode the input as a EvmAdvance
    const data = decodeFunctionData({ abi: InputsAbi, data: event.args.input });
    const [
        _chainId,
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
        chainId: context.chain.id,
        applicationAddress: appContract,
        blockNumber: event.block.number,
        blockTimestamp,
        epochIndex: openEpoch.index,
        index: index,
        msgSender: msgSender,
        payload: payload2,
        prevRandao,
        rawPayload: payload,
    });
});
