export const InputsAbi = [
    {
        inputs: [
            {
                internalType: "uint256",
                name: "chainId",
                type: "uint256",
            },
            {
                internalType: "address",
                name: "appContract",
                type: "address",
            },
            {
                internalType: "address",
                name: "msgSender",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "blockNumber",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "blockTimestamp",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "prevRandao",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "index",
                type: "uint256",
            },
            {
                internalType: "bytes",
                name: "payload",
                type: "bytes",
            },
        ],
        name: "EvmAdvance",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
] as const;
