export default [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "poolId",
        type: "bytes32"
      },
      {
        internalType: "address",
        name: "sender",
        type: "address"
      },
      {
        internalType: "address payable",
        name: "recipient",
        type: "address"
      },
      {
        components: [
          {
            internalType: "contract IAsset[]",
            name: "assets",
            type: "address[]"
          },
          {
            internalType: "uint256[]",
            name: "minAmountsOut",
            type: "uint256[]"
          },
          {
            internalType: "bytes",
            name: "userData",
            type: "bytes"
          },
          {
            internalType: "bool",
            name: "toInternalBalance",
            type: "bool"
          }
        ],
        internalType: "struct IVault.ExitPoolRequest",
        name: "request",
        type: "tuple"
      }
    ],
    name: "exitPool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "poolId",
        type: "bytes32"
      }
    ],
    name: "getPool",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      },
      {
        internalType: "enum IVault.PoolSpecialization",
        name: "",
        type: "uint8"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "poolId",
        type: "bytes32"
      },
      {
        internalType: "contract IERC20",
        name: "token",
        type: "address"
      }
    ],
    name: "getPoolTokenInfo",
    outputs: [
      {
        internalType: "uint256",
        name: "cash",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "managed",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "lastChangeBlock",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "assetManager",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "poolId",
        type: "bytes32"
      }
    ],
    name: "getPoolTokens",
    outputs: [
      {
        internalType: "contract IERC20[]",
        name: "tokens",
        type: "address[]"
      },
      {
        internalType: "uint256[]",
        name: "balances",
        type: "uint256[]"
      },
      {
        internalType: "uint256",
        name: "lastChangeBlock",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "poolId",
        type: "bytes32"
      },
      {
        internalType: "address",
        name: "sender",
        type: "address"
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address"
      },
      {
        components: [
          {
            internalType: "contract IAsset[]",
            name: "assets",
            type: "address[]"
          },
          {
            internalType: "uint256[]",
            name: "maxAmountsIn",
            type: "uint256[]"
          },
          {
            internalType: "bytes",
            name: "userData",
            type: "bytes"
          },
          {
            internalType: "bool",
            name: "fromInternalBalance",
            type: "bool"
          }
        ],
        internalType: "struct IVault.JoinPoolRequest",
        name: "request",
        type: "tuple"
      }
    ],
    name: "joinPool",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  }
];
