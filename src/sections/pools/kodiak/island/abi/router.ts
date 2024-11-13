export default [
  {
    inputs: [
      {
        internalType: "contract IKodiakVaultV1",
        name: "pool",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "amount0Max",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "amount1Max",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "amount0Min",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "amount1Min",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "amountSharesMin",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address"
      }
    ],
    name: "addLiquidity",
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
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "contract IKodiakVaultV1",
        name: "pool",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "burnAmount",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "amount0Min",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "amount1Min",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address"
      }
    ],
    name: "removeLiquidity",
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
        internalType: "uint128",
        name: "liquidityBurned",
        type: "uint128"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "contract IKodiakVaultV1",
        name: "pool",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "amount0Max",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "amount1Max",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "amount0Min",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "amount1Min",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "amountSharesMin",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address"
      }
    ],
    name: "addLiquidityETH",
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
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "contract IKodiakVaultV1",
        name: "pool",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "burnAmount",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "amount0Min",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "amount1Min",
        type: "uint256"
      },
      {
        internalType: "address payable",
        name: "receiver",
        type: "address"
      }
    ],
    name: "removeLiquidityETH",
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
        internalType: "uint128",
        name: "liquidityBurned",
        type: "uint128"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  }
];
