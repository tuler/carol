export const ApplicationFactoryAbi = [
    {
        inputs: [
            {
                internalType: "contract IOutputsMerkleRootValidator",
                name: "outputsMerkleRootValidator",
                type: "address",
            },
            {
                internalType: "address",
                name: "appOwner",
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
            {
                internalType: "bytes32",
                name: "salt",
                type: "bytes32",
            },
        ],
        name: "calculateApplicationAddress",
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
                internalType: "contract IOutputsMerkleRootValidator",
                name: "outputsMerkleRootValidator",
                type: "address",
            },
            {
                internalType: "address",
                name: "appOwner",
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
            {
                internalType: "bytes32",
                name: "salt",
                type: "bytes32",
            },
        ],
        name: "newApplication",
        outputs: [
            {
                internalType: "contract IApplication",
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
                internalType: "contract IOutputsMerkleRootValidator",
                name: "outputsMerkleRootValidator",
                type: "address",
            },
            {
                internalType: "address",
                name: "appOwner",
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
        name: "newApplication",
        outputs: [
            {
                internalType: "contract IApplication",
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
                indexed: true,
                internalType: "contract IOutputsMerkleRootValidator",
                name: "outputsMerkleRootValidator",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "appOwner",
                type: "address",
            },
            {
                indexed: false,
                internalType: "bytes32",
                name: "templateHash",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "bytes",
                name: "dataAvailability",
                type: "bytes",
            },
            {
                indexed: false,
                internalType: "contract IApplication",
                name: "appContract",
                type: "address",
            },
        ],
        name: "ApplicationCreated",
        type: "event",
    },
] as const;
