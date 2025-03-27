import { Token } from "@/types";

export interface LstHookResult {
  sourceToken: Token;           // 源代币
  targetToken: Token;           // 目标代币
  tvl: string;                  // 总锁仓量
  tvlUsd: string;               // 总锁仓量USD价值
  stakedAmount: string;         // 用户已质押数量
  stakedAmountUsd: string;      // 用户已质押USD价值
  
  availableAmount?: string;     // 用户可用数量
  availableAmountUsd?: string;  // 用户可用USD价值
  inAmount?: string;            // 输入金额
  
  handleDeposit: (updateState: any) => void;  
  
  handleMax?: () => void;                     
  handleAmountChange?: (amount: any) => void;
  handleCopy?: (address: string) => void;     
  
  getBalanceLoading?: boolean;                
  balances?: Record<string, string>;          
  apy?: string;                               
  [key: string]: any;                         
}

export const STAKE_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256"
      }
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "depositAsset",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "depositAmount",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "minimumMint",
        type: "uint256"
      }
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: 'address', name: 'account', type: 'address' }
    ],
    name: 'balanceOf',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  }
];