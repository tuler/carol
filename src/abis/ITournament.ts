export const tournamentAbi = [
    {
        type: "function",
        name: "arbitrationResult",
        inputs: [],
        outputs: [
            {
                name: "finished",
                type: "bool",
                internalType: "bool",
            },
            {
                name: "winnerCommitment",
                type: "bytes32",
                internalType: "Tree.Node",
            },
            {
                name: "finalState",
                type: "bytes32",
                internalType: "Machine.Hash",
            },
        ],
        stateMutability: "view",
    },
] as const;
