export const RPS_CONTRACT_ADDRESS = "0x6f4042401823a97E3b02F1A533e62C40409a75fa";

export const RPS_CONTRACT_ADDRESS_ABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "betAmount",
        "type": "uint256"
      },
      {
        "internalType": "enum RockPaperScissors.Moves",
        "name": "numberA",
        "type": "uint8"
      }
    ],
    "name": "initRoom",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "betAmount",
        "type": "uint256"
      },
      {
        "internalType": "enum RockPaperScissors.Moves",
        "name": "number1",
        "type": "uint8"
      },
      {
        "internalType": "enum RockPaperScissors.Moves",
        "name": "number2",
        "type": "uint8"
      }
    ],
    "name": "initAndJoinRoom",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "roomId",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "roomId",
        "type": "uint256"
      },
      {
        "internalType": "enum RockPaperScissors.Moves",
        "name": "number",
        "type": "uint8"
      },
      {
        "internalType": "bytes32",
        "name": "userRandomNumber",
        "type": "bytes32"
      }
    ],
    "name": "joinRoom",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "roomId",
        "type": "uint256"
      },
      {
        "internalType": "enum RockPaperScissors.Moves",
        "name": "numberB",
        "type": "uint8"
      },
      {
        "internalType": "enum RockPaperScissors.Moves",
        "name": "numberC",
        "type": "uint8"
      },
      {
        "internalType": "bytes32",
        "name": "userRandomNumber",
        "type": "bytes32"
      }
    ],
    "name": "joinRoomDouble",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "indexFrom",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "indexTo",
        "type": "uint256"
      }
    ],
    "name": "getRoomsInfo",
    "outputs": [
      {
        "components": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "roomId",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "playerA",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "playerB",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "playerC",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "bet",
                "type": "uint256"
              }
            ],
            "internalType": "struct RockPaperScissors.UniqRoomData",
            "name": "data",
            "type": "tuple"
          },
          {
            "internalType": "uint256",
            "name": "pot",
            "type": "uint256"
          },
          {
            "internalType": "enum RockPaperScissors.RoomStatus",
            "name": "status",
            "type": "uint8"
          },
          {
            "internalType": "enum RockPaperScissors.WinnerStatus",
            "name": "winnerStatus",
            "type": "uint8"
          },
          {
            "internalType": "enum RockPaperScissors.Moves",
            "name": "numberA",
            "type": "uint8"
          },
          {
            "internalType": "enum RockPaperScissors.Moves",
            "name": "numberB",
            "type": "uint8"
          },
          {
            "internalType": "enum RockPaperScissors.Moves",
            "name": "numberC",
            "type": "uint8"
          },
          {
            "internalType": "uint64",
            "name": "createTime",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "sequence",
            "type": "uint64"
          },
          {
            "internalType": "bytes32",
            "name": "randomNumber",
            "type": "bytes32"
          }
        ],
        "internalType": "struct RockPaperScissors.RoomInfo[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
];
