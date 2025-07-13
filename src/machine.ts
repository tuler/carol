import { rollups, type RollupsMachine } from "@tuler/node-cartesi-machine";
import path from "node:path";
import type { Context } from "ponder:registry";
import { output, report } from "ponder:schema";

import {
    bytesToHex,
    decodeFunctionData,
    hexToBytes,
    type Address,
    type Hex,
} from "viem";
import { outputsAbi } from "./contracts";

const machines: Record<string, RollupsMachine> = {};

export const create = (templateHash: string) => {
    const templatePath = path.join("snapshots", templateHash);
    const machine = rollups(templatePath);
    machines[templateHash] = machine;
};

const saveOutput = async (
    args: ExecuteArgs & { index: bigint; output: Buffer },
) => {
    const { context, appContract, epochIndex, inputIndex, index } = args;

    // decode output type, and extract voucher address if (Voucher | DelegateCallVoucher)
    const rawPayload = bytesToHex(args.output);
    const data = decodeFunctionData({
        abi: outputsAbi,
        data: rawPayload,
    });
    let voucherAddress: Address | undefined;
    switch (data.functionName) {
        case "DelegateCallVoucher": {
            voucherAddress = data.args[0];
            break;
        }
        case "Notice": {
            break;
        }
        case "Voucher": {
            voucherAddress = data.args[0];
            break;
        }
    }

    return context.db.insert(output).values({
        chainId: context.chain.id,
        applicationAddress: appContract,
        epochIndex: epochIndex,
        inputIndex: inputIndex,
        index: index,
        rawPayload,
        voucherAddress,
        createdAt: args.timestamp,
        updatedAt: args.timestamp,
    });
};

const saveReport = async (
    args: ExecuteArgs & { index: bigint; report: Buffer },
) => {
    const { context, appContract, epochIndex, inputIndex, index } = args;
    return context.db.insert(report).values({
        chainId: context.chain.id,
        applicationAddress: appContract,
        epochIndex,
        inputIndex,
        index,
        rawPayload: bytesToHex(args.report),
        createdAt: args.timestamp,
        updatedAt: args.timestamp,
    });
};

type ExecuteArgs = {
    context: Context;
    appContract: Address;
    epochIndex: bigint;
    inputIndex: bigint;
    templateHash: string;
    payload: Hex;
    timestamp: bigint;
};

export const execute = async (args: ExecuteArgs) => {
    const { templateHash, payload } = args;

    const machine = machines[templateHash];
    if (machine) {
        let oi = 0n;
        let ri = 0n;
        const input = Buffer.from(hexToBytes(payload));
        for (const { type, data } of machine.advance(input)) {
            switch (type) {
                case "output": {
                    await saveOutput({ ...args, index: oi++, output: data });
                    break;
                }
                case "report": {
                    await saveReport({ ...args, index: ri++, report: data });
                    break;
                }
                // ignore progress
            }
        }
    }
};
