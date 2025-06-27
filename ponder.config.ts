import { createConfig, factory } from "ponder";

import { getAbiItem } from "viem";
import { ApplicationAbi } from "./src/abis/Application";
import { ApplicationFactoryAbi } from "./src/abis/ApplicationFactory";
import { DaveConsensusAbi } from "./src/abis/DaveConsensus";
import { DaveConsensusFactoryAbi } from "./src/abis/DaveConsensusFactory";
import { InputBoxAbi } from "./src/abis/InputBox";

const inputBoxAddress = "0xc70074BDD26d8cF983Ca6A5b89b8db52D5850051";
const applicationFactoryAddress = "0xc7006f70875BaDe89032001262A846D3Ee160051";
const daveConsensusFactoryAddressMainnet =
    "0x53DbCBcb9c2d8AF798dFeb8803B1a919AA2e1Eb4";
const daveConsensusFactoryAddressSepolia =
    "0x1c266ea4977fead5c830c472333b4537fc010a6d";

export default createConfig({
    chains: {
        mainnet: {
            id: 1,
            rpc: process.env.PONDER_RPC_URL_1,
        },
        sepolia: {
            id: 11155111,
            rpc: process.env.PONDER_RPC_URL_11155111,
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
                sepolia: {
                    address: factory({
                        address: applicationFactoryAddress,
                        event: getAbiItem({
                            abi: ApplicationFactoryAbi,
                            name: "ApplicationCreated",
                        }),
                        parameter: "appContract",
                        startBlock: 8439338,
                    }),
                    startBlock: 8439338,
                },
            },
        },
        ApplicationFactory: {
            abi: ApplicationFactoryAbi,
            address: applicationFactoryAddress,
            chain: {
                mainnet: {
                    startBlock: 22595774,
                },
                sepolia: {
                    startBlock: 8439338,
                },
            },
        },
        DaveConsensus: {
            abi: DaveConsensusAbi,
            chain: {
                mainnet: {
                    address: factory({
                        address: daveConsensusFactoryAddressMainnet,
                        event: getAbiItem({
                            abi: DaveConsensusFactoryAbi,
                            name: "DaveConsensusCreated",
                        }),
                        parameter: "daveConsensus",
                        startBlock: 22670045,
                    }),
                    startBlock: 22670045,
                },
                sepolia: {
                    address: factory({
                        address: daveConsensusFactoryAddressSepolia,
                        event: getAbiItem({
                            abi: DaveConsensusFactoryAbi,
                            name: "DaveConsensusCreated",
                        }),
                        parameter: "daveConsensus",
                        startBlock: 8511228,
                    }),
                    startBlock: 8511228,
                },
            },
        },
        DaveConsensusFactory: {
            abi: DaveConsensusFactoryAbi,
            chain: {
                mainnet: {
                    address: daveConsensusFactoryAddressMainnet,
                    startBlock: 22670045,
                },
                sepolia: {
                    address: daveConsensusFactoryAddressSepolia,
                    startBlock: 8511228,
                },
            },
        },
        InputBox: {
            abi: InputBoxAbi,
            address: inputBoxAddress,
            chain: {
                mainnet: {
                    startBlock: 22595776,
                },
                sepolia: {
                    startBlock: 8439339,
                },
            },
        },
    },
});
