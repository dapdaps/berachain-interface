export default [
  {
    inputs: [
      { internalType: "uint256", name: "assets", type: "uint256" },
      { internalType: "address", name: "receiver", type: "address" }
    ],
    name: "deposit",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "shares", type: "uint256" },
      { internalType: "address", name: "receiver", type: "address" },
      { internalType: "address", name: "_owner", type: "address" }
    ],
    name: "redeem",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "custodied",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getCurrentEpochInfo",
    outputs: [
      {
        components: [
          {
            internalType: "uint80",
            name: "fundingStart",
            type: "uint80"
          },
          { internalType: "uint80", name: "epochStart", type: "uint80" },
          { internalType: "uint80", name: "epochEnd", type: "uint80" }
        ],
        internalType: "struct VaultV3.Epoch",
        name: "",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];
