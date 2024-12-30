export default [
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'poolIdx',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'base',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'quote',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'isBuy',
            type: 'bool',
          },
        ],
        internalType: 'struct SwapHelpers.SwapStep[]',
        name: '_steps',
        type: 'tuple[]',
      },
      {
        internalType: 'uint128',
        name: '_amount',
        type: 'uint128',
      },
      {
        internalType: 'uint128',
        name: '_minOut',
        type: 'uint128',
      },
    ],
    name: 'multiSwap',
    outputs: [
      {
        internalType: 'uint128',
        name: 'out',
        type: 'uint128',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'poolIdx',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'base',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'quote',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'isBuy',
            type: 'bool',
          },
        ],
        internalType: 'struct SwapHelpers.SwapStep[]',
        name: '_steps',
        type: 'tuple[]',
      },
      {
        internalType: 'uint128',
        name: '_amount',
        type: 'uint128',
      },
    ],
    name: 'previewMultiSwap',
    outputs: [
      {
        internalType: 'uint128',
        name: 'out',
        type: 'uint128',
      },
      {
        internalType: 'uint256',
        name: 'predictedQty',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
