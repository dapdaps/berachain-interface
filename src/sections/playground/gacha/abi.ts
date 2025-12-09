export default [
  {
    inputs: [
      {
        internalType: "enum BeraGachapon.Tier",
        name: "tier",
        type: "uint8"
      },
      {
        internalType: "bytes32",
        name: "userRandomNumber",
        type: "bytes32"
      }
    ],
    name: "playGame",
    outputs: [
      {
        internalType: "uint64",
        name: "sequence",
        type: "uint64"
      }
    ],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "sequence",
        type: "uint64"
      }
    ],
    name: "getGameRequest",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address"
          },
          {
            internalType: "enum BeraGachapon.Tier",
            name: "tier",
            type: "uint8"
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256"
          },
          {
            internalType: "bool",
            name: "fulfilled",
            type: "bool"
          },
          {
            internalType: "bytes32",
            name: "randomNumber",
            type: "bytes32"
          },
          {
            internalType: "bool",
            name: "hasReward",
            type: "bool"
          },
          {
            internalType: "enum BeraGachapon.RewardType",
            name: "rewardType",
            type: "uint8"
          },
          {
            internalType: "address",
            name: "rewardToken",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "rewardAmount",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "rewardNftId",
            type: "uint256"
          }
        ],
        internalType: "struct BeraGachapon.GameRequest",
        name: "request",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "enum BeraGachapon.Tier",
        name: "tier",
        type: "uint8"
      }
    ],
    name: "getTierRewards",
    outputs: [
      {
        components: [
          {
            internalType: "enum BeraGachapon.RewardType",
            name: "rewardType",
            type: "uint8"
          },
          {
            internalType: "address",
            name: "tokenAddress",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256"
          },
          {
            internalType: "uint64",
            name: "probability",
            type: "uint64"
          },
          {
            internalType: "bool",
            name: "isActive",
            type: "bool"
          },
          {
            internalType: "uint256",
            name: "remainingStock",
            type: "uint256"
          },
          {
            internalType: "uint256[]",
            name: "nftTokenIds",
            type: "uint256[]"
          }
        ],
        internalType: "struct BeraGachapon.Reward[]",
        name: "rewards",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "enum BeraGachapon.Tier",
        name: "tier",
        type: "uint8"
      }
    ],
    name: "getTierConfig",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "entryFee",
            type: "uint256"
          },
          {
            components: [
              {
                internalType: "enum BeraGachapon.RewardType",
                name: "rewardType",
                type: "uint8"
              },
              {
                internalType: "address",
                name: "tokenAddress",
                type: "address"
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256"
              },
              {
                internalType: "uint64",
                name: "probability",
                type: "uint64"
              },
              {
                internalType: "bool",
                name: "isActive",
                type: "bool"
              },
              {
                internalType: "uint256",
                name: "remainingStock",
                type: "uint256"
              },
              {
                internalType: "uint256[]",
                name: "nftTokenIds",
                type: "uint256[]"
              }
            ],
            internalType: "struct BeraGachapon.Reward[]",
            name: "rewards",
            type: "tuple[]"
          },
          {
            internalType: "bool",
            name: "isActive",
            type: "bool"
          },
          {
            internalType: "uint256",
            name: "totalPlayed",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "totalPaidOut",
            type: "uint256"
          }
        ],
        internalType: "struct BeraGachapon.TierConfig",
        name: "config",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address"
      }
    ],
    name: "getUserSequences",
    outputs: [
      {
        internalType: "uint64[]",
        name: "sequences",
        type: "uint64[]"
      },
      {
        internalType: "uint256[]",
        name: "timestamps",
        type: "uint256[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];
