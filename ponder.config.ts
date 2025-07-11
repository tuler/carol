import { createConfig, factory } from "ponder";

import { getAbiItem } from "viem";
import { DaveConsensusAbi } from "./src/abis/DaveConsensus";
import { DaveConsensusFactoryAbi } from "./src/abis/DaveConsensusFactory";
import {
    applicationAbi,
    applicationFactoryAbi,
    authorityAbi,
    authorityFactoryAbi,
    inputBoxAbi,
} from "./src/contracts";

const inputBoxAddress = "0xc70074BDD26d8cF983Ca6A5b89b8db52D5850051";
const applicationFactoryAddress = "0xc7006f70875BaDe89032001262A846D3Ee160051";
const authorityFactoryAddress = "0xC7003566dD09Aa0fC0Ce201aC2769aFAe3BF0051";
const daveConsensusFactoryAddressMainnet =
    "0x53DbCBcb9c2d8AF798dFeb8803B1a919AA2e1Eb4";

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
    },
    contracts: {
        Application: {
            abi: applicationAbi,
            chain: {
                mainnet: {
                    address: factory({
                        address: applicationFactoryAddress,
                        event: getAbiItem({
                            abi: applicationFactoryAbi,
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
            abi: applicationFactoryAbi,
            address: applicationFactoryAddress,
            chain: {
                mainnet: {
                    startBlock: 22595774,
                },
            },
        },
        Authority: {
            abi: authorityAbi,
            chain: {
                mainnet: {
                    address: factory({
                        address: authorityFactoryAddress,
                        event: getAbiItem({
                            abi: authorityFactoryAbi,
                            name: "AuthorityCreated",
                        }),
                        parameter: "authority",
                        startBlock: 22595775,
                    }),
                    startBlock: 22595775,
                },
            },
        },
        AuthorityFactory: {
            abi: authorityFactoryAbi,
            address: authorityFactoryAddress,
            chain: {
                mainnet: {
                    startBlock: 22595775,
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
            },
        },
        DaveConsensusFactory: {
            abi: DaveConsensusFactoryAbi,
            chain: {
                mainnet: {
                    address: daveConsensusFactoryAddressMainnet,
                    startBlock: 22670045,
                },
            },
        },
        InputBox: {
            abi: inputBoxAbi,
            address: inputBoxAddress,
            chain: {
                mainnet: {
                    startBlock: 22595776,
                },
            },
        },
    },
});
