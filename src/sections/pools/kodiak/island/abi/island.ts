export default [
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "balanceOf",
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
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getUnderlyingBalances",
    outputs: [
      {
        internalType: "uint256",
        name: "amount0Current",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "amount1Current",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalSupply",
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
        internalType: "uint256",
        name: "amount0Max",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "amount1Max",
        type: "uint256"
      }
    ],
    name: "getMintAmounts",
    outputs: [
      {
        internalType: "uint256",
        name: "amount0",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "amount1",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "mintAmount",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];
