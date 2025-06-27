export const BAULT_ABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "assets",
        type: "uint256"
      }
    ],
    name: "convertToShares",
    outputs: [
      {
        internalType: "uint256",
        name: "shares",
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
        name: "owner",
        type: "address"
      }
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "result",
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
        name: "shares",
        type: "uint256"
      }
    ],
    name: "convertToAssets",
    outputs: [
      {
        internalType: "uint256",
        name: "assets",
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
        name: "shares",
        type: "uint256"
      }
    ],
    name: "previewRedeem",
    outputs: [
      {
        internalType: "uint256",
        name: "assets",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
];

export const REWARD_ABI = [
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
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "earned",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];

export const ISLAND_ABI = [
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
];

export const BAULT_ROUTER_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "bault",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "assets",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "minSharesOut",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address"
      }
    ],
    name: "depositIntoBault",
    outputs: [
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "bault",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "minAssetsOut",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address"
      }
    ],
    name: "redeemFromBault",
    outputs: [
      {
        internalType: "uint256",
        name: "assets",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
];