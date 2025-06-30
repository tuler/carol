import { createConfig, factory } from "ponder";

import { getAbiItem } from "viem";
import { ApplicationAbi } from "./src/abis/Application";
import { ApplicationFactoryAbi } from "./src/abis/ApplicationFactory";
import { AuthorityAbi } from "./src/abis/Authority";
import { AuthorityFactoryAbi } from "./src/abis/AuthorityFactory";
import { DaveConsensusAbi } from "./src/abis/DaveConsensus";
import { DaveConsensusFactoryAbi } from "./src/abis/DaveConsensusFactory";
import { InputBoxAbi } from "./src/abis/InputBox";

const inputBoxAddress = "0xc70074BDD26d8cF983Ca6A5b89b8db52D5850051";
const applicationFactoryAddress = "0xc7006f70875BaDe89032001262A846D3Ee160051";
const authorityFactoryAddress = "0xC7003566dD09Aa0fC0Ce201aC2769aFAe3BF0051";
const daveConsensusFactoryAddressMainnet =
    "0x53DbCBcb9c2d8AF798dFeb8803B1a919AA2e1Eb4";
const daveConsensusFactoryAddressSepolia =
    "0x1c266ea4977fead5c830c472333b4537fc010a6d";

const http = (chainId: number, chainName: string) => {
    return process.env.ALCHEMY_ID
        ? `https://${chainName}.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`
        : process.env[`PONDER_RPC_URL_${chainId}`];
};

const ws = (chainId: number, chainName: string) => {
    return process.env.ALCHEMY_ID
        ? `wss://${chainName}.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`
        : process.env[`PONDER_WS_URL_${chainId}`];
};

export default createConfig({
    chains: {
        mainnet: {
            id: 1,
            rpc: http(1, "eth-mainnet"),
            ws: ws(1, "eth-mainnet"),
        },
        sepolia: {
            id: 11155111,
            rpc: http(11155111, "eth-sepolia"),
            ws: ws(11155111, "eth-sepolia"),
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
        Authority: {
            abi: AuthorityAbi,
            chain: {
                mainnet: {
                    address: factory({
                        address: authorityFactoryAddress,
                        event: getAbiItem({
                            abi: AuthorityFactoryAbi,
                            name: "AuthorityCreated",
                        }),
                        parameter: "authority",
                        startBlock: 22595775,
                    }),
                    startBlock: 22595775,
                },
                sepolia: {
                    address: factory({
                        address: authorityFactoryAddress,
                        event: getAbiItem({
                            abi: AuthorityFactoryAbi,
                            name: "AuthorityCreated",
                        }),
                        parameter: "authority",
                        startBlock: 8297796,
                    }),
                    startBlock: 8297796,
                },
            },
        },
        AuthorityFactory: {
            abi: AuthorityFactoryAbi,
            address: authorityFactoryAddress,
            chain: {
                mainnet: {
                    startBlock: 22595775,
                },
                sepolia: {
                    startBlock: 8297796,
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
