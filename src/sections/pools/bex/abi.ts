export default [
  {
    type: 'function',
    name: 'userCmd',
    inputs: [
      {
        name: 'callpath',
        type: 'uint16',
        internalType: 'uint16'
      },
      {
        name: 'cmd',
        type: 'bytes',
        internalType: 'bytes'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'bytes',
        internalType: 'bytes'
      }
    ],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    name: 'queryPrice',
    inputs: [
      {
        name: 'base',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'quote',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'poolIdx',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'uint128',
        internalType: 'uint128'
      }
    ],
    stateMutability: 'view'
  }
];
