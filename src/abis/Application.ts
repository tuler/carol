export const ApplicationAbi = [
    {
        inputs: [
            {
                internalType: "contract IOutputsMerkleRootValidator",
                name: "outputsMerkleRootValidator",
                type: "address",
            },
            {
                internalType: "address",
                name: "initialOwner",
                type: "address",
            },
            {
                internalType: "bytes32",
                name: "templateHash",
                type: "bytes32",
            },
            {
                internalType: "bytes",
                name: "dataAvailability",
                type: "bytes",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        stateMutability: "payable",
        type: "receive",
    },
    {
        inputs: [
            {
                internalType: "bytes",
                name: "output",
                type: "bytes",
            },
            {
                components: [
                    {
                        internalType: "uint64",
                        name: "outputIndex",
                        type: "uint64",
                    },
                    {
                        internalType: "bytes32[]",
                        name: "outputHashesSiblings",
                        type: "bytes32[]",
                    },
                ],
                internalType: "struct OutputValidityProof",
                name: "proof",
                type: "tuple",
            },
        ],
        name: "executeOutput",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "getDataAvailability",
        outputs: [
            {
                internalType: "bytes",
                name: "",
                type: "bytes",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getDeploymentBlockNumber",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getOutputsMerkleRootValidator",
        outputs: [
            {
                internalType: "contract IOutputsMerkleRootValidator",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getTemplateHash",
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
                internalType: "contract IOutputsMerkleRootValidator",
                name: "newOutputsMerkleRootValidator",
                type: "address",
            },
        ],
        name: "migrateToOutputsMerkleRootValidator",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
            {
                internalType: "address",
                name: "",
                type: "address",
            },
            {
                internalType: "uint256[]",
                name: "",
                type: "uint256[]",
            },
            {
                internalType: "uint256[]",
                name: "",
                type: "uint256[]",
            },
            {
                internalType: "bytes",
                name: "",
                type: "bytes",
            },
        ],
        name: "onERC1155BatchReceived",
        outputs: [
            {
                internalType: "bytes4",
                name: "",
                type: "bytes4",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
            {
                internalType: "address",
                name: "",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
            {
                internalType: "bytes",
                name: "",
                type: "bytes",
            },
        ],
        name: "onERC1155Received",
        outputs: [
            {
                internalType: "bytes4",
                name: "",
                type: "bytes4",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
            {
                internalType: "address",
                name: "",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
            {
                internalType: "bytes",
                name: "",
                type: "bytes",
            },
        ],
        name: "onERC721Received",
        outputs: [
            {
                internalType: "bytes4",
                name: "",
                type: "bytes4",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
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
        name: "renounceOwnership",
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
        inputs: [
            {
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes",
                name: "output",
                type: "bytes",
            },
            {
                components: [
                    {
                        internalType: "uint64",
                        name: "outputIndex",
                        type: "uint64",
                    },
                    {
                        internalType: "bytes32[]",
                        name: "outputHashesSiblings",
                        type: "bytes32[]",
                    },
                ],
                internalType: "struct OutputValidityProof",
                name: "proof",
                type: "tuple",
            },
        ],
        name: "validateOutput",
        outputs: [],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "outputHash",
                type: "bytes32",
            },
            {
                components: [
                    {
                        internalType: "uint64",
                        name: "outputIndex",
                        type: "uint64",
                    },
                    {
                        internalType: "bytes32[]",
                        name: "outputHashesSiblings",
                        type: "bytes32[]",
                    },
                ],
                internalType: "struct OutputValidityProof",
                name: "proof",
                type: "tuple",
            },
        ],
        name: "validateOutputHash",
        outputs: [],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "outputIndex",
                type: "uint256",
            },
        ],
        name: "wasOutputExecuted",
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
                internalType: "uint64",
                name: "outputIndex",
                type: "uint64",
            },
            {
                indexed: false,
                internalType: "bytes",
                name: "output",
                type: "bytes",
            },
        ],
        name: "OutputExecuted",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "contract IOutputsMerkleRootValidator",
                name: "newOutputsMerkleRootValidator",
                type: "address",
            },
        ],
        name: "OutputsMerkleRootValidatorChanged",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "previousOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "value",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "balance",
                type: "uint256",
            },
        ],
        name: "InsufficientFunds",
        type: "error",
    },
    {
        inputs: [],
        name: "InvalidOutputHashesSiblingsArrayLength",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "outputsMerkleRoot",
                type: "bytes32",
            },
        ],
        name: "InvalidOutputsMerkleRoot",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "bytes",
                name: "output",
                type: "bytes",
            },
        ],
        name: "OutputNotExecutable",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "bytes",
                name: "output",
                type: "bytes",
            },
        ],
        name: "OutputNotReexecutable",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "owner",
                type: "address",
            },
        ],
        name: "OwnableInvalidOwner",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "account",
                type: "address",
            },
        ],
        name: "OwnableUnauthorizedAccount",
        type: "error",
    },
    {
        inputs: [],
        name: "ReentrancyGuardReentrantCall",
        type: "error",
    },
] as const;
