export const AuthorityFactoryAbi = [
    {
        type: "function",
        name: "calculateAuthorityAddress",
        inputs: [
            {
                name: "authorityOwner",
                type: "address",
                internalType: "address",
            },
            {
                name: "epochLength",
                type: "uint256",
                internalType: "uint256",
            },
            {
                name: "salt",
                type: "bytes32",
                internalType: "bytes32",
            },
        ],
        outputs: [
            {
                name: "",
                type: "address",
                internalType: "address",
            },
        ],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "newAuthority",
        inputs: [
            {
                name: "authorityOwner",
                type: "address",
                internalType: "address",
            },
            {
                name: "epochLength",
                type: "uint256",
                internalType: "uint256",
            },
        ],
        outputs: [
            {
                name: "",
                type: "address",
                internalType: "contract IAuthority",
            },
        ],
        stateMutability: "nonpayable",
    },
    {
        type: "function",
        name: "newAuthority",
        inputs: [
            {
                name: "authorityOwner",
                type: "address",
                internalType: "address",
            },
            {
                name: "epochLength",
                type: "uint256",
                internalType: "uint256",
            },
            {
                name: "salt",
                type: "bytes32",
                internalType: "bytes32",
            },
        ],
        outputs: [
            {
                name: "",
                type: "address",
                internalType: "contract IAuthority",
            },
        ],
        stateMutability: "nonpayable",
    },
    {
        type: "event",
        name: "AuthorityCreated",
        inputs: [
            {
                name: "authority",
                type: "address",
                indexed: false,
                internalType: "contract IAuthority",
            },
        ],
        anonymous: false,
    },
] as const;
