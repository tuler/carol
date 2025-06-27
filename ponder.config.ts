import { createConfig, factory } from "ponder";

import { getAbiItem } from "viem";
import { ApplicationAbi } from "./src/abis/Application";
import { ApplicationFactoryAbi } from "./src/abis/ApplicationFactory";
import { DaveConsensusAbi } from "./src/abis/DaveConsensus";
import { DaveConsensusFactoryAbi } from "./src/abis/DaveConsensusFactory";
import { InputBoxAbi } from "./src/abis/InputBox";

const inputBoxAddress = "0xc70074BDD26d8cF983Ca6A5b89b8db52D5850051";
const applicationFactoryAddress = "0xc7006f70875BaDe89032001262A846D3Ee160051";
const daveConsensusFactoryAddress =
    "0x53DbCBcb9c2d8AF798dFeb8803B1a919AA2e1Eb4";

export default createConfig({
    chains: {
        mainnet: {
            id: 1,
            rpc: process.env.PONDER_RPC_URL_1,
        },
    },
    contracts: {
        Application: {
            abi: ApplicationAbi,
            chain: {
                mainnet: {
                    address: factory({
                        address: applicationFactoryAddress,
                        event: getAbiItem({
                            abi: ApplicationFactoryAbi,
                            name: "ApplicationCreated",
                        }),
                        parameter: "appContract",
                        startBlock: 22595774,
                    }),
                    startBlock: 22595774,
                },
            },
        },
        ApplicationFactory: {
            abi: ApplicationFactoryAbi,
            chain: {
                mainnet: {
                    address: applicationFactoryAddress,
                    startBlock: 22595774,
                },
            },
        },
        DaveConsensus: {
            abi: DaveConsensusAbi,
            chain: {
                mainnet: {
                    address: factory({
                        address: daveConsensusFactoryAddress,
                        event: getAbiItem({
                            abi: DaveConsensusFactoryAbi,
                            name: "DaveConsensusCreated",
                        }),
                        parameter: "daveConsensus",
                        startBlock: 22670045,
                    }),
                    startBlock: 22670045,
                },
            },
        },
        DaveConsensusFactory: {
            abi: DaveConsensusFactoryAbi,
            chain: {
                mainnet: {
                    address: daveConsensusFactoryAddress,
                    startBlock: 22670045,
                },
            },
        },
        InputBox: {
            abi: InputBoxAbi,
            chain: {
                mainnet: {
                    address: inputBoxAddress,
                    startBlock: 22595776,
                },
            },
        },
    },
});
