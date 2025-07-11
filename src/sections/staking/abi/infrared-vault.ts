export default [
  {
    inputs: [
      { internalType: "address", name: "_stakingToken", type: "address" },
      { internalType: "uint256", name: "_rewardsDuration", type: "uint256" }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  { inputs: [], name: "EnforcedPause", type: "error" },
  { inputs: [], name: "ExpectedPause", type: "error" },
  { inputs: [], name: "MaxNumberOfRewards", type: "error" },
  { inputs: [], name: "ReentrancyGuardReentrantCall", type: "error" },
  {
    inputs: [{ internalType: "address", name: "sender", type: "address" }],
    name: "Unauthorized",
    type: "error"
  },
  { inputs: [], name: "ZeroAddress", type: "error" },
  { inputs: [], name: "ZeroAmount", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "Paused",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
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
    name: "Recovered",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "rewardsToken",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "reward",
        type: "uint256"
      }
    ],
    name: "RewardAdded",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: true,
        internalType: "address",
        name: "rewardsToken",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "reward",
        type: "uint256"
      }
    ],
    name: "RewardPaid",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "rewardsToken",
        type: "address"
      }
    ],
    name: "RewardRemoved",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "rewardsToken",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "rewardsDuration",
        type: "uint256"
      }
    ],
    name: "RewardStored",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "rewardsToken",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "newDistributor",
        type: "address"
      }
    ],
    name: "RewardsDistributorUpdated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newDuration",
        type: "uint256"
      }
    ],
    name: "RewardsDurationUpdated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "Staked",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "Unpaused",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
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
    name: "MAX_NUM_REWARD_TOKENS",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_rewardsToken", type: "address" },
      { internalType: "uint256", name: "_rewardsDuration", type: "uint256" }
    ],
    name: "addReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "_balance", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "address", name: "_rewardsToken", type: "address" }
    ],
    name: "earned",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "exit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "getAllRewardTokens",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "getAllRewardsForUser",
    outputs: [
      {
        components: [
          { internalType: "address", name: "token", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" }
        ],
        internalType: "struct IInfraredVault.UserReward[]",
        name: "",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_rewardsToken", type: "address" }
    ],
    name: "getRewardForDuration",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "getRewardForUser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "infrared",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_rewardsToken", type: "address" }
    ],
    name: "lastTimeRewardApplicable",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_rewardToken", type: "address" },
      { internalType: "uint256", name: "_reward", type: "uint256" }
    ],
    name: "notifyRewardAmount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "pauseStaking",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "paused",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_to", type: "address" },
      { internalType: "address", name: "_token", type: "address" },
      { internalType: "uint256", name: "_amount", type: "uint256" }
    ],
    name: "recoverERC20",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_rewardsToken", type: "address" }
    ],
    name: "removeReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "rewardData",
    outputs: [
      { internalType: "address", name: "rewardsDistributor", type: "address" },
      { internalType: "uint256", name: "rewardsDuration", type: "uint256" },
      { internalType: "uint256", name: "periodFinish", type: "uint256" },
      { internalType: "uint256", name: "rewardRate", type: "uint256" },
      { internalType: "uint256", name: "lastUpdateTime", type: "uint256" },
      {
        internalType: "uint256",
        name: "rewardPerTokenStored",
        type: "uint256"
      },
      { internalType: "uint256", name: "rewardResidual", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_rewardsToken", type: "address" }
    ],
    name: "rewardPerToken",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "rewardTokens",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" }
    ],
    name: "rewards",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "rewardsVault",
    outputs: [
      { internalType: "contract IRewardVault", name: "", type: "address" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "stake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "stakingToken",
    outputs: [{ internalType: "contract ERC20", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "unpauseStaking",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_rewardsToken", type: "address" },
      { internalType: "uint256", name: "_rewardsDuration", type: "uint256" }
    ],
    name: "updateRewardsDuration",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" }
    ],
    name: "userRewardPerTokenPaid",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];
