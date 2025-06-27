export const DaveConsensusFactoryAbi = [
    {
        inputs: [
            {
                internalType: "contract IInputBox",
                name: "_inputBox",
                type: "address",
            },
            {
                internalType: "contract ITournamentFactory",
                name: "_tournament",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "appContract",
                type: "address",
            },
            {
                internalType: "Machine.Hash",
                name: "initialMachineStateHash",
                type: "bytes32",
            },
            {
                internalType: "bytes32",
                name: "salt",
                type: "bytes32",
            },
        ],
        name: "calculateDaveConsensusAddress",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "appContract",
                type: "address",
            },
            {
                internalType: "Machine.Hash",
                name: "initialMachineStateHash",
                type: "bytes32",
            },
            {
                internalType: "bytes32",
                name: "salt",
                type: "bytes32",
            },
        ],
        name: "newDaveConsensus",
        outputs: [
            {
                internalType: "contract DaveConsensus",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "appContract",
                type: "address",
            },
            {
                internalType: "Machine.Hash",
                name: "initialMachineStateHash",
                type: "bytes32",
            },
        ],
        name: "newDaveConsensus",
        outputs: [
            {
                internalType: "contract DaveConsensus",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "contract DaveConsensus",
                name: "daveConsensus",
                type: "address",
            },
        ],
        name: "DaveConsensusCreated",
        type: "event",
    },
] as const;
