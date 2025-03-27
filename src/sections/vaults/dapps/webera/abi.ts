export default [
  {
    constant: false,
    inputs: [
      {
        name: "assets",
        type: "uint256"
      },
      {
        name: "vault",
        type: "address"
      },
      {
        name: "fromAsset",
        type: "address"
      }
    ],
    name: "deposit",
    outputs: [
      {
        name: "shares",
        type: "uint256"
      },
    ],
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        name: "_shareAmt",
        type: "uint256"
      }
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
];
