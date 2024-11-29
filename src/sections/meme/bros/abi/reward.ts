export default [
  {
    inputs: [
      {
        internalType: "address",
        name: "_signer",
        type: "address"
      }
    ],
    stateMutability: "payable",
    type: "constructor"
  },
  {
    inputs: [],
    name: "ECDSAInvalidSignature",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "length",
        type: "uint256"
      }
    ],
    name: "ECDSAInvalidSignatureLength",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32"
      }
    ],
    name: "ECDSAInvalidSignatureS",
    type: "error"
  },
  {
    inputs: [],
    name: "FailedCall",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256"
      }
    ],
    name: "InsufficientBalance",
    type: "error"
  },
  {
    inputs: [],
    name: "InvalidShortString",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      }
    ],
    name: "OwnableInvalidOwner",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "str",
        type: "string"
      }
    ],
    name: "StringTooLong",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [],
    name: "EIP712DomainChanged",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "OwnershipTransferred",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address[]",
        name: "tokens",
        type: "address[]"
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]"
      }
    ],
    name: "RewardClaimed",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "depositor",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "memePool",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "TokenDeposited",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "TokensWithdrawn",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "Withdrawn",
    type: "event"
  },
  {
    inputs: [],
    name: "REWARD_TYPEHASH",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        internalType: "address[]",
        name: "tokens",
        type: "address[]"
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]"
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes"
      }
    ],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "memePool",
        type: "address"
      },
      {
        internalType: "address",
        name: "token",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [],
    name: "depositEndDate",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "depositStartDate",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "eip712Domain",
    outputs: [
      {
        internalType: "bytes1",
        name: "fields",
        type: "bytes1"
      },
      {
        internalType: "string",
        name: "name",
        type: "string"
      },
      {
        internalType: "string",
        name: "version",
        type: "string"
      },
      {
        internalType: "uint256",
        name: "chainId",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "verifyingContract",
        type: "address"
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32"
      },
      {
        internalType: "uint256[]",
        name: "extensions",
        type: "uint256[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_account",
        type: "address"
      },
      {
        internalType: "address[]",
        name: "_tokens",
        type: "address[]"
      },
      {
        internalType: "uint256[]",
        name: "_amounts",
        type: "uint256[]"
      },
      {
        internalType: "uint256",
        name: "_nonce",
        type: "uint256"
      }
    ],
    name: "getDigest",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getDomainSeparator",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "memePool",
        type: "address"
      }
    ],
    name: "getMemePoolTokens",
    outputs: [
      {
        internalType: "address[]",
        name: "tokens",
        type: "address[]"
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_account",
        type: "address"
      },
      {
        internalType: "address[]",
        name: "_tokens",
        type: "address[]"
      },
      {
        internalType: "uint256[]",
        name: "_amounts",
        type: "uint256[]"
      },
      {
        internalType: "uint256",
        name: "_nonce",
        type: "uint256"
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes"
      }
    ],
    name: "getSigner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    name: "memePoolTokens",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_start",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "_end",
        type: "uint256"
      }
    ],
    name: "setDepositPeriod",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_signer",
        type: "address"
      }
    ],
    name: "setSigner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "signer",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      },
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    name: "totalClaims",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      },
      {
        internalType: "address",
        name: "",
        type: "address"
      },
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    name: "totalDeposits",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    name: "userNonces",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_account",
        type: "address"
      },
      {
        internalType: "address[]",
        name: "_tokens",
        type: "address[]"
      },
      {
        internalType: "uint256[]",
        name: "_amounts",
        type: "uint256[]"
      },
      {
        internalType: "uint256",
        name: "_nonce",
        type: "uint256"
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes"
      }
    ],
    name: "verify",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "to",
        type: "address"
      }
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "tokens",
        type: "address[]"
      },
      {
        internalType: "address",
        name: "to",
        type: "address"
      }
    ],
    name: "withdrawTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];
