export default [
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "lockedStakesOf",
    outputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "kek_id",
            type: "bytes32"
          },
          {
            internalType: "uint256",
            name: "start_timestamp",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "liquidity",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "ending_timestamp",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "lock_multiplier",
            type: "uint256"
          }
        ],
        internalType: "struct CommunalFarm.LockedStake[]",
        name: "",
        type: "tuple[]"
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
        internalType: "uint256[]",
        name: "new_earned",
        type: "uint256[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getReward",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "liquidity",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "secs",
        type: "uint256"
      }
    ],
    name: "stakeLocked",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32[]",
        name: "kek_ids",
        type: "bytes32[]"
      }
    ],
    name: "withdrawLockedMultiple",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "secs",
        type: "uint256"
      }
    ],
    name: "lockMultiplier",
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
