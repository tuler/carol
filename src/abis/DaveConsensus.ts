export const DaveConsensusAbi = [
    {
        inputs: [
            {
                internalType: "contract IInputBox",
                name: "inputBox",
                type: "address",
            },
            {
                internalType: "address",
                name: "appContract",
                type: "address",
            },
            {
                internalType: "contract ITournamentFactory",
                name: "tournamentFactory",
                type: "address",
            },
            {
                internalType: "Machine.Hash",
                name: "initialMachineStateHash",
                type: "bytes32",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [],
        name: "canSettle",
        outputs: [
            {
                internalType: "bool",
                name: "isFinished",
                type: "bool",
            },
            {
                internalType: "uint256",
                name: "epochNumber",
                type: "uint256",
            },
            {
                internalType: "Tree.Node",
                name: "winnerCommitment",
                type: "bytes32",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getApplicationContract",
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
        inputs: [],
        name: "getCurrentSealedEpoch",
        outputs: [
            {
                internalType: "uint256",
                name: "epochNumber",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "inputIndexLowerBound",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "inputIndexUpperBound",
                type: "uint256",
            },
            {
                internalType: "contract ITournament",
                name: "tournament",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getInputBox",
        outputs: [
            {
                internalType: "contract IInputBox",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getTournamentFactory",
        outputs: [
            {
                internalType: "contract ITournamentFactory",
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
                internalType: "bytes32",
                name: "outputsMerkleRoot",
                type: "bytes32",
            },
        ],
        name: "isOutputsMerkleRootValid",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "inputIndexWithinEpoch",
                type: "uint256",
            },
            {
                internalType: "bytes",
                name: "input",
                type: "bytes",
            },
        ],
        name: "provideMerkleRootOfInput",
        outputs: [
            {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "epochNumber",
                type: "uint256",
            },
            {
                internalType: "bytes32",
                name: "outputsMerkleRoot",
                type: "bytes32",
            },
            {
                internalType: "bytes32[]",
                name: "proof",
                type: "bytes32[]",
            },
        ],
        name: "settle",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes4",
                name: "interfaceId",
                type: "bytes4",
            },
        ],
        name: "supportsInterface",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "contract IInputBox",
                name: "inputBox",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "appContract",
                type: "address",
            },
            {
                indexed: false,
                internalType: "contract ITournamentFactory",
                name: "tournamentFactory",
                type: "address",
            },
        ],
        name: "ConsensusCreation",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "epochNumber",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "inputIndexLowerBound",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "inputIndexUpperBound",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "Machine.Hash",
                name: "initialMachineStateHash",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "bytes32",
                name: "outputsMerkleRoot",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "contract ITournament",
                name: "tournament",
                type: "address",
            },
        ],
        name: "EpochSealed",
        type: "event",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "expected",
                type: "address",
            },
            {
                internalType: "address",
                name: "received",
                type: "address",
            },
        ],
        name: "ApplicationMismatch",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "received",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "actual",
                type: "uint256",
            },
        ],
        name: "IncorrectEpochNumber",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "fromReceivedInput",
                type: "bytes32",
            },
            {
                internalType: "bytes32",
                name: "fromInputBox",
                type: "bytes32",
            },
        ],
        name: "InputHashMismatch",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "Machine.Hash",
                name: "settledState",
                type: "bytes32",
            },
        ],
        name: "InvalidOutputsMerkleRootProof",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "suppliedProofSize",
                type: "uint256",
            },
        ],
        name: "InvalidOutputsMerkleRootProofSize",
        type: "error",
    },
    {
        inputs: [],
        name: "TournamentNotFinishedYet",
        type: "error",
    },
] as const;
