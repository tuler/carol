export const IOutputsMerkleRootValidatorAbi = [
    {
        type: "function",
        name: "isOutputsMerkleRootValid",
        inputs: [
            { name: "appContract", type: "address", internalType: "address" },
            {
                name: "outputsMerkleRoot",
                type: "bytes32",
                internalType: "bytes32",
            },
        ],
        outputs: [{ name: "", type: "bool", internalType: "bool" }],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "supportsInterface",
        inputs: [
            { name: "interfaceId", type: "bytes4", internalType: "bytes4" },
        ],
        outputs: [{ name: "", type: "bool", internalType: "bool" }],
        stateMutability: "view",
    },
] as const;
