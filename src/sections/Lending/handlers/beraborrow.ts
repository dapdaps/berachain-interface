import Big from "big.js";
import { ethers, utils } from "ethers";
import { useEffect } from "react";
import { multicall } from "@/utils/multicall";
import multicallAddresses from "@/configs/contract/multicall";
import { bera } from "@/configs/tokens/bera";

const ABI: any = {
  beraWrapper: [
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "contract IDenManager",
              "name": "denManager",
              "type": "address"
            },
            {
              "internalType": "contract IInfraredCollateralVault",
              "name": "collVault",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "_maxFeePercentage",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_debtAmount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_collAssetToDeposit",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "_upperHint",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_lowerHint",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "_minSharesMinted",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_collIndex",
              "type": "uint256"
            },
            {
              "internalType": "bytes",
              "name": "_preDeposit",
              "type": "bytes"
            }
          ],
          "internalType": "struct ICollVaultRouter.OpenDenVaultParams",
          "name": "params",
          "type": "tuple"
        }
      ],
      "name": "openDenVault",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "contract IDenManager",
              "name": "denManager",
              "type": "address"
            },
            {
              "internalType": "contract IInfraredCollateralVault",
              "name": "collVault",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "_maxFeePercentage",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_collAssetToDeposit",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_collWithdrawal",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_debtChange",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "_isDebtIncrease",
              "type": "bool"
            },
            {
              "internalType": "address",
              "name": "_upperHint",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_lowerHint",
              "type": "address"
            },
            {
              "internalType": "bool",
              "name": "unwrap",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "_minSharesMinted",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_minAssetsWithdrawn",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_collIndex",
              "type": "uint256"
            },
            {
              "internalType": "bytes",
              "name": "_preDeposit",
              "type": "bytes"
            }
          ],
          "internalType": "struct ICollVaultRouter.AdjustDenVaultParams",
          "name": "params",
          "type": "tuple"
        }
      ],
      "name": "adjustDenVault",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "contract IDenManager",
          "name": "denManager",
          "type": "address"
        },
        {
          "internalType": "contract IInfraredCollateralVault",
          "name": "collVault",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "minAssetsWithdrawn",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "collIndex",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "unwrap",
          "type": "bool"
        }
      ],
      "name": "closeDenVault",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },


  ],
  borrowerOperations: [
    {
      "type": "constructor",
      "inputs": [
        { "name": "_beraborrowCore", "type": "address", "internalType": "address" },
        { "name": "_debtTokenAddress", "type": "address", "internalType": "address" },
        { "name": "_factory", "type": "address", "internalType": "address" },
        { "name": "_brimeDen", "type": "address", "internalType": "address" },
        { "name": "_brimeMCR", "type": "uint256", "internalType": "uint256" },
        { "name": "_minNetDebt", "type": "uint256", "internalType": "uint256" },
        { "name": "_gasCompensation", "type": "uint256", "internalType": "uint256" }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "BERABORROW_CORE",
      "inputs": [],
      "outputs": [{ "name": "", "type": "address", "internalType": "contract IBeraborrowCore" }],
      "stateMutability": "view"
    },
    { "type": "function", "name": "CCR", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
    { "type": "function", "name": "DEBT_GAS_COMPENSATION", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
    { "type": "function", "name": "DECIMAL_PRECISION", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
    { "type": "function", "name": "PERCENT_DIVISOR", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
    {
      "type": "function",
      "name": "addColl",
      "inputs": [
        { "name": "denManager", "type": "address", "internalType": "contract IDenManager" },
        { "name": "account", "type": "address", "internalType": "address" },
        { "name": "_collateralAmount", "type": "uint256", "internalType": "uint256" },
        { "name": "_upperHint", "type": "address", "internalType": "address" },
        { "name": "_lowerHint", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "adjustDen",
      "inputs": [
        { "name": "denManager", "type": "address", "internalType": "contract IDenManager" },
        { "name": "account", "type": "address", "internalType": "address" },
        { "name": "_maxFeePercentage", "type": "uint256", "internalType": "uint256" },
        { "name": "_collDeposit", "type": "uint256", "internalType": "uint256" },
        { "name": "_collWithdrawal", "type": "uint256", "internalType": "uint256" },
        { "name": "_debtChange", "type": "uint256", "internalType": "uint256" },
        { "name": "_isDebtIncrease", "type": "bool", "internalType": "bool" },
        { "name": "_upperHint", "type": "address", "internalType": "address" },
        { "name": "_lowerHint", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    { "type": "function", "name": "brimeDen", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "address" }], "stateMutability": "view" },
    { "type": "function", "name": "brimeMCR", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
    {
      "type": "function",
      "name": "checkRecoveryMode",
      "inputs": [{ "name": "TCR", "type": "uint256", "internalType": "uint256" }],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "pure"
    },
    {
      "type": "function",
      "name": "closeDen",
      "inputs": [
        { "name": "denManager", "type": "address", "internalType": "contract IDenManager" },
        { "name": "account", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "configureCollateral",
      "inputs": [
        { "name": "denManager", "type": "address", "internalType": "contract IDenManager" },
        { "name": "collateralToken", "type": "address", "internalType": "contract IERC20" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    { "type": "function", "name": "debtToken", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "contract IDebtToken" }], "stateMutability": "view" },
    {
      "type": "function",
      "name": "denManagersData",
      "inputs": [{ "name": "", "type": "address", "internalType": "contract IDenManager" }],
      "outputs": [
        { "name": "collateralToken", "type": "address", "internalType": "contract IERC20" },
        { "name": "index", "type": "uint16", "internalType": "uint16" }
      ],
      "stateMutability": "view"
    },
    { "type": "function", "name": "factory", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "address" }], "stateMutability": "view" },
    {
      "type": "function",
      "name": "fetchBalances",
      "inputs": [],
      "outputs": [
        {
          "name": "balances",
          "type": "tuple",
          "internalType": "struct BorrowerOperations.SystemBalances",
          "components": [
            { "name": "collaterals", "type": "uint256[]", "internalType": "uint256[]" },
            { "name": "debts", "type": "uint256[]", "internalType": "uint256[]" },
            { "name": "prices", "type": "uint256[]", "internalType": "uint256[]" }
          ]
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getCompositeDebt",
      "inputs": [{ "name": "_debt", "type": "uint256", "internalType": "uint256" }],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getGlobalSystemBalances",
      "inputs": [],
      "outputs": [
        { "name": "totalPricedCollateral", "type": "uint256", "internalType": "uint256" },
        { "name": "totalDebt", "type": "uint256", "internalType": "uint256" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getTCR",
      "inputs": [],
      "outputs": [{ "name": "globalTotalCollateralRatio", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    { "type": "function", "name": "guardian", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "address" }], "stateMutability": "view" },
    {
      "type": "function",
      "name": "isApprovedDelegate",
      "inputs": [
        { "name": "owner", "type": "address", "internalType": "address" },
        { "name": "caller", "type": "address", "internalType": "address" }
      ],
      "outputs": [{ "name": "isApproved", "type": "bool", "internalType": "bool" }],
      "stateMutability": "view"
    },
    { "type": "function", "name": "minNetDebt", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
    {
      "type": "function",
      "name": "openDen",
      "inputs": [
        { "name": "denManager", "type": "address", "internalType": "contract IDenManager" },
        { "name": "account", "type": "address", "internalType": "address" },
        { "name": "_maxFeePercentage", "type": "uint256", "internalType": "uint256" },
        { "name": "_collateralAmount", "type": "uint256", "internalType": "uint256" },
        { "name": "_debtAmount", "type": "uint256", "internalType": "uint256" },
        { "name": "_upperHint", "type": "address", "internalType": "address" },
        { "name": "_lowerHint", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    { "type": "function", "name": "owner", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "address" }], "stateMutability": "view" },
    {
      "type": "function",
      "name": "removeDenManager",
      "inputs": [{ "name": "denManager", "type": "address", "internalType": "contract IDenManager" }],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "repayDebt",
      "inputs": [
        { "name": "denManager", "type": "address", "internalType": "contract IDenManager" },
        { "name": "account", "type": "address", "internalType": "address" },
        { "name": "_debtAmount", "type": "uint256", "internalType": "uint256" },
        { "name": "_upperHint", "type": "address", "internalType": "address" },
        { "name": "_lowerHint", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "setDelegateApproval",
      "inputs": [
        { "name": "_delegate", "type": "address", "internalType": "address" },
        { "name": "_isApproved", "type": "bool", "internalType": "bool" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "setMinNetDebt",
      "inputs": [{ "name": "_minNetDebt", "type": "uint256", "internalType": "uint256" }],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "withdrawColl",
      "inputs": [
        { "name": "denManager", "type": "address", "internalType": "contract IDenManager" },
        { "name": "account", "type": "address", "internalType": "address" },
        { "name": "_collWithdrawal", "type": "uint256", "internalType": "uint256" },
        { "name": "_upperHint", "type": "address", "internalType": "address" },
        { "name": "_lowerHint", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "withdrawDebt",
      "inputs": [
        { "name": "denManager", "type": "address", "internalType": "contract IDenManager" },
        { "name": "account", "type": "address", "internalType": "address" },
        { "name": "_maxFeePercentage", "type": "uint256", "internalType": "uint256" },
        { "name": "_debtAmount", "type": "uint256", "internalType": "uint256" },
        { "name": "_upperHint", "type": "address", "internalType": "address" },
        { "name": "_lowerHint", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "event",
      "name": "BorrowingFeePaid",
      "inputs": [
        { "name": "denManager", "type": "address", "indexed": true, "internalType": "contract IDenManager" },
        { "name": "borrower", "type": "address", "indexed": true, "internalType": "address" },
        { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "CollateralConfigured",
      "inputs": [
        { "name": "denManager", "type": "address", "indexed": false, "internalType": "contract IDenManager" },
        { "name": "collateralToken", "type": "address", "indexed": false, "internalType": "contract IERC20" }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "DenCreated",
      "inputs": [
        { "name": "denManager", "type": "address", "indexed": true, "internalType": "contract IDenManager" },
        { "name": "_borrower", "type": "address", "indexed": true, "internalType": "address" },
        { "name": "arrayIndex", "type": "uint256", "indexed": false, "internalType": "uint256" }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "DenManagerRemoved",
      "inputs": [{ "name": "denManager", "type": "address", "indexed": false, "internalType": "contract IDenManager" }],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "DenUpdated",
      "inputs": [
        { "name": "_denManager", "type": "address", "indexed": true, "internalType": "contract IDenManager" },
        { "name": "_borrower", "type": "address", "indexed": true, "internalType": "address" },
        { "name": "_debt", "type": "uint256", "indexed": false, "internalType": "uint256" },
        { "name": "_coll", "type": "uint256", "indexed": false, "internalType": "uint256" },
        { "name": "stake", "type": "uint256", "indexed": false, "internalType": "uint256" },
        { "name": "operation", "type": "uint8", "indexed": false, "internalType": "enum BorrowerOperations.BorrowerOperation" }
      ],
      "anonymous": false
    }
  ],
  collVaultRouter: [
    {
      "type": "constructor",
      "inputs": [
        { "name": "_borrowerOperations", "type": "address", "internalType": "address" },
        { "name": "_wBera", "type": "address", "internalType": "address" },
        { "name": "_nectar", "type": "address", "internalType": "address" },
        { "name": "_liquidStabilityPool", "type": "address", "internalType": "address" },
        { "name": "_beraborrowCore", "type": "address", "internalType": "address" }
      ],
      "stateMutability": "nonpayable"
    },
    { "type": "receive", "stateMutability": "payable" },
    {
      "type": "function",
      "name": "adjustDenVault",
      "inputs": [
        {
          "name": "p",
          "type": "tuple",
          "internalType": "struct ICollVaultRouter.AdjustDenVaultParams",
          "components": [
            { "name": "denManager", "type": "address", "internalType": "contract IDenManager" },
            { "name": "collVault", "type": "address", "internalType": "contract IBaseCollateralVault" },
            { "name": "_maxFeePercentage", "type": "uint256", "internalType": "uint256" },
            { "name": "_collAssetToDeposit", "type": "uint256", "internalType": "uint256" },
            { "name": "_collWithdrawal", "type": "uint256", "internalType": "uint256" },
            { "name": "_debtChange", "type": "uint256", "internalType": "uint256" },
            { "name": "_isDebtIncrease", "type": "bool", "internalType": "bool" },
            { "name": "_upperHint", "type": "address", "internalType": "address" },
            { "name": "_lowerHint", "type": "address", "internalType": "address" },
            { "name": "unwrap", "type": "bool", "internalType": "bool" },
            { "name": "_minSharesMinted", "type": "uint256", "internalType": "uint256" },
            { "name": "_minAssetsWithdrawn", "type": "uint256", "internalType": "uint256" },
            { "name": "_collIndex", "type": "uint256", "internalType": "uint256" },
            { "name": "_preDeposit", "type": "bytes", "internalType": "bytes" }
          ]
        }
      ],
      "outputs": [],
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "claimCollateralRouter",
      "inputs": [
        { "name": "denManager", "type": "address", "internalType": "contract IDenManager" },
        { "name": "collVault", "type": "address", "internalType": "contract IBaseCollateralVault" },
        { "name": "receiver", "type": "address", "internalType": "address" },
        { "name": "minAssetsWithdrawn", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "claimLockedTokens",
      "inputs": [
        { "name": "tokens", "type": "address[]", "internalType": "contract IERC20[]" },
        { "name": "amounts", "type": "uint256[]", "internalType": "uint256[]" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "closeDenVault",
      "inputs": [
        { "name": "denManager", "type": "address", "internalType": "contract IDenManager" },
        { "name": "collVault", "type": "address", "internalType": "contract IBaseCollateralVault" },
        { "name": "minAssetsWithdrawn", "type": "uint256", "internalType": "uint256" },
        { "name": "collIndex", "type": "uint256", "internalType": "uint256" },
        { "name": "unwrap", "type": "bool", "internalType": "bool" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "openDenVault",
      "inputs": [
        { "name": "denManager", "type": "address", "internalType": "contract IDenManager" },
        { "name": "collVault", "type": "address", "internalType": "contract IBaseCollateralVault" },
        { "name": "_maxFeePercentage", "type": "uint256", "internalType": "uint256" },
        { "name": "_debtAmount", "type": "uint256", "internalType": "uint256" },
        { "name": "_collAssetToDeposit", "type": "uint256", "internalType": "uint256" },
        { "name": "_upperHint", "type": "address", "internalType": "address" },
        { "name": "_lowerHint", "type": "address", "internalType": "address" },
        { "name": "_minSharesMinted", "type": "uint256", "internalType": "uint256" },
        { "name": "_collIndex", "type": "uint256", "internalType": "uint256" },
        { "name": "_preDeposit", "type": "bytes", "internalType": "bytes" }
      ],
      "outputs": [],
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "previewRedeemUnderlying",
      "inputs": [
        { "name": "collVault", "type": "address", "internalType": "contract IBaseCollateralVault" },
        { "name": "owner", "type": "address", "internalType": "address" },
        { "name": "sharesToRedeem", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [
        { "name": "tokens", "type": "address[]", "internalType": "address[]" },
        { "name": "amounts", "type": "uint256[]", "internalType": "uint256[]" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "redeemCollateralVault",
      "inputs": [
        {
          "name": "p",
          "type": "tuple",
          "internalType": "struct ICollVaultRouter.RedeemCollateralVaultParams",
          "components": [
            { "name": "denManager", "type": "address", "internalType": "contract IDenManager" },
            { "name": "collVault", "type": "address", "internalType": "contract IBaseCollateralVault" },
            { "name": "_debtAmount", "type": "uint256", "internalType": "uint256" },
            { "name": "_firstRedemptionHint", "type": "address", "internalType": "address" },
            { "name": "_upperPartialRedemptionHint", "type": "address", "internalType": "address" },
            { "name": "_lowerPartialRedemptionHint", "type": "address", "internalType": "address" },
            { "name": "_partialRedemptionHintNICR", "type": "uint256", "internalType": "uint256" },
            { "name": "_maxIterations", "type": "uint256", "internalType": "uint256" },
            { "name": "_maxFeePercentage", "type": "uint256", "internalType": "uint256" },
            { "name": "minAssetsWithdrawn", "type": "uint256", "internalType": "uint256" },
            { "name": "collIndex", "type": "uint256", "internalType": "uint256" },
            { "name": "unwrap", "type": "bool", "internalType": "bool" }
          ]
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    }
  ],
};

const DEN_MANAGER_ABI = [
  {
    type: "function",
    name: "getDenOwnersCount",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "totalStakes",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "sortedDens",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract ISortedDens"
      }
    ],
    stateMutability: "view"
  }
];

const HINT_ABI = [
  {
    type: "function",
    name: "getRedemptionHints",
    inputs: [
      {
        name: "denManager",
        type: "address",
        internalType: "contract IDenManager"
      },
      {
        name: "_debtAmount",
        type: "uint256",
        internalType: "uint256"
      },
      {
        name: "_price",
        type: "uint256",
        internalType: "uint256"
      },
      {
        name: "_maxIterations",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    outputs: [
      {
        name: "firstRedemptionHint",
        type: "address",
        internalType: "address"
      },
      {
        name: "partialRedemptionHintNICR",
        type: "uint256",
        internalType: "uint256"
      },
      {
        name: "truncatedDebtAmount",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "getApproxHint",
    inputs: [
      {
        name: "denManager",
        type: "address",
        internalType: "contract IDenManager"
      },
      {
        name: "_CR",
        type: "uint256",
        internalType: "uint256"
      },
      {
        name: "_numTrials",
        type: "uint256",
        internalType: "uint256"
      },
      {
        name: "_inputRandomSeed",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    outputs: [
      {
        name: "hintAddress",
        type: "address",
        internalType: "address"
      },
      {
        name: "diff",
        type: "uint256",
        internalType: "uint256"
      },
      {
        name: "latestRandomSeed",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "view"
  }
];

const SORTED_DENS_ABI = [
  {
    type: "function",
    name: "getPrev",
    inputs: [
      {
        name: "_id",
        type: "address",
        internalType: "address"
      }
    ],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "getNext",
    inputs: [
      {
        name: "_id",
        type: "address",
        internalType: "address"
      }
    ],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address"
      }
    ],
    stateMutability: "view"
  }
];

const EARN_ABI = [
  {
    type: "function",
    name: "deposit",
    inputs: [
      { name: "", type: "uint256", internalType: "uint256" },
      { name: "", type: "address", internalType: "address" }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  }
];

const innerAbi: any = [
  { name: "honeyAmountToDeposit", type: "uint" },
  { name: "borrower", type: "address" },
  { name: "collVaultRouter", type: "address" }
];

const outerAbi: any = [
  { name: "", type: "bytes" },
  { name: "bHoneyHook", type: "address" }
];

export const randomBigInt = () =>
  BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
function* generateTrials(totalNumberOfTrials: number) {
  while (totalNumberOfTrials) {
    const numberOfTrials = Math.min(totalNumberOfTrials, 2500);
    yield numberOfTrials;

    totalNumberOfTrials -= numberOfTrials;
  }
}

function encodePreDeposit(
  honeyAmount: any,
  borrower: any,
  collVaultRouter: any,
  bHoneyHook: any
) {
  const innerEncoded = ethers.utils.defaultAbiCoder.encode(innerAbi, [
    honeyAmount,
    borrower,
    collVaultRouter
  ]);

  const outerEncoded = ethers.utils.defaultAbiCoder.encode(outerAbi, [
    innerEncoded,
    bHoneyHook
  ]);

  return outerEncoded;
}

const BeraborrowHandler = (props: any) => {
  const {
    update,
    config,
    market,
    actionText,
    account,
    borrowAmount,
    amount,
    onLoad,
    provider,
    chainId,
    totalAmount,
    totalBorrowAmount,
    totalCollAmount,
    actionType
  } = props;

  useEffect(() => {
    if (!update) return;


    console.log('====market.vault', market.vault)
    const multicallAddress = multicallAddresses[chainId];
    const contractAddress = config[market.vault];
    const abi = ABI[market.vault];
    const parsedAmount = ethers.utils.parseUnits(
      amount || "0",
      market.decimals
    );
    console.log(
      "%camount: %o, market.decimals: %o, parsedAmount: %o",
      "background:#808000;color:#fff;",
      amount,
      market.decimals,
      parsedAmount
    );
    const parsedBorrowAmount = ethers.utils.parseUnits(
      borrowAmount || "0",
      config.borrowToken.decimals
    );
    console.log(
      "%cborrowAmount: %o, config.borrowToken.decimals: %o, parsedBorrowAmount: %o",
      "background:#808000;color:#fff;",
      borrowAmount,
      config.borrowToken.decimals,
      parsedBorrowAmount
    );
    const isOpened = market.status === "open";
    const isClose = actionText === "Close";
    const isRepay = actionText === "Repay";
    const isBorrow = actionText === "Borrow";

    console.log(
      "%cactionText: %o",
      "background:#808000;color:#fff;",
      actionText
    );

    const getHint = () => {
      return new Promise((resolve) => {
        multicall({
          abi: DEN_MANAGER_ABI,
          calls: [
            {
              address: market.denManager,
              name: "getDenOwnersCount",
              params: []
            },
            {
              address: market.denManager,
              name: "sortedDens",
              params: []
            }
          ],
          options: {},
          multicallAddress,
          provider: provider
        })
          .then(async (denManagerRes: any) => {
            const [[numberOfDens], [sortedDensAddress]] = denManagerRes || [];
            const totalNumberOfTrials = Math.ceil(
              15 * Math.sqrt(Number(numberOfDens.toString()))
            );
            const [firstTrials, ...restOfTrials] = generateTrials(
              totalNumberOfTrials
            ) as any;
            const hintContract = new ethers.Contract(
              config.multiCollateralHintHelpers,
              HINT_ABI,
              provider
            );
            let NICR: any = Big(0);
            if (
              totalAmount &&
              Big(totalAmount).gt(0) &&
              totalBorrowAmount &&
              Big(totalBorrowAmount).gt(0)
            ) {
              const debtValue = Big(totalBorrowAmount).toFixed(2);
              console.log(
                "%ccollValue: %o",
                "background:#808000;color:#fff;",
                totalAmount
              );
              console.log(
                "%cdebtValue: %o",
                "background:#808000;color:#fff;",
                debtValue
              );
              NICR = Big(Big(totalAmount).toFixed(2)).mul(1e20).div(debtValue);
            }
            console.log(
              "%cNICR: %o",
              "background:#808000;color:#fff;",
              NICR.toFixed(0)
            );
            const _collectApproxHint = (
              latestRandomSeed: any,
              results: any,
              numberOfTrials: any,
              dmAddr: any,
              nominalCollateralRatio: any
            ) => {
              const approxHintParams = [
                dmAddr,
                ethers.BigNumber.from(nominalCollateralRatio),
                // ethers.BigNumber.from('149220641726481938471'),
                ethers.BigNumber.from(numberOfTrials),
                // ethers.BigNumber.from('2500'),
                ethers.BigNumber.from(latestRandomSeed)
                // ethers.BigNumber.from('7563636496275551'),
              ];
              return new Promise((resolve) => {
                hintContract
                  .getApproxHint(...approxHintParams)
                  .then((hintRes: any) => {
                    resolve({
                      latestRandomSeed: hintRes.latestRandomSeed,
                      results: [
                        ...results,
                        { hintAddress: hintRes.hintAddress, diff: hintRes.diff }
                      ]
                    });
                  })
                  .catch((err: any) => {
                    console.log("hintRes err: %o", err);
                    resolve({});
                  });
              });
            };
            const { results } = await restOfTrials.reduce(
              (p: any, numberOfTrials: any) =>
                p.then((state: any) => {
                  _collectApproxHint(
                    state.latestRandomSeed,
                    state.results,
                    numberOfTrials,
                    market.denManager,
                    NICR.toFixed(0)
                  );
                }),
              _collectApproxHint(
                randomBigInt(),
                [],
                firstTrials,
                market.denManager,
                NICR.toFixed(0)
              )
            );
            const { hintAddress } = results?.reduce((a: any, b: any) =>
              a.diff < b.diff ? a : b
            );

            multicall({
              abi: SORTED_DENS_ABI,
              calls: [
                {
                  address: sortedDensAddress,
                  name: "getPrev",
                  params: [hintAddress]
                },
                {
                  address: sortedDensAddress,
                  name: "getNext",
                  params: [hintAddress]
                }
              ],
              options: {},
              multicallAddress,
              provider: provider
            })
              .then((sortedDensRes: any) => {
                const lowerHint = sortedDensRes?.[0]?.[0] ?? account;
                const upperHint = sortedDensRes?.[1]?.[0] ?? account;
                console.log("sortedDensRes: %o", sortedDensRes);
                console.log("lowerHint: %o", lowerHint);
                console.log("upperHint: %o", upperHint);
                resolve({ lowerHint, upperHint });
              })
              .catch((sortedDensErr: any) => {
                console.log("sortedDensErr: %o", sortedDensErr);
                resolve({ lowerHint: account, upperHint: account });
              });
          })
          .catch((err: any) => {
            console.log("get DenManager failed: %o", err);
            resolve({ lowerHint: account, upperHint: account });
          });
      });
    };

    const getPreDeposit = () => {
      if (![bera["honey"].address].includes(market.address)) {
        return "0x";
      }
      // if (beraB['bhoney'].address === market.address && market.status !== 'open') {
      //   return '0x';
      // }

      const honeyAmountToDeposit = ethers.BigNumber.from(parsedAmount); // 10 HONEY
      const borrowerAddress = account;
      const collVaultRouterAddress =
        "0xd257D6b56b2eE48A4B83e12F06b53195Dc4514D7";
      const bHoneyHookAddress = "0xb35A972df0616924f85b99D7248880925EB82D52";

      return encodePreDeposit(
        honeyAmountToDeposit,
        borrowerAddress,
        collVaultRouterAddress,
        bHoneyHookAddress
      );
    };

    const getParams = () => {
      return new Promise(async (resolve) => {
        let method = "";
        let params: any = [];
        const hint: any = await getHint();

        let _preDeposit: any = getPreDeposit();
        method = "openDenVault";
        params = [
          // denManager
          market.denManager,
          // collVault
          market.collVault,
          // _maxFeePercentage
          "10000000000000000",
          // _debtAmount
          parsedBorrowAmount,
          // _collAssetToDeposit
          parsedAmount,
          // _upperHint
          hint.upperHint,
          // _lowerHint
          hint.lowerHint,
          // _minSharesMinted
          "0",
          // _collIndex
          market.collIndex,
          // _preDeposit
          _preDeposit
        ];
        if (isOpened) {
          method = "adjustDenVault";
          params = [
            market.denManager,
            market.collVault,
            "10000000000000000",
            isBorrow ? parsedAmount : "0",
            isRepay ? parsedAmount : "0",
            parsedBorrowAmount,
            !(
              isRepay ||
              !borrowAmount ||
              Big(borrowAmount).lte(0)
            ),
            hint.upperHint,
            hint.lowerHint,
            true,
            "0",
            "0",
            market.collIndex,
            _preDeposit
          ];
        }
        if (isClose) {
          method = "closeDenVault";
          params = [
            // denManager
            market.denManager,
            // collVault
            market.collVault,
            // minAssetsWithdrawn
            "10000000000000000",
            // collIndex
            market.collIndex,
            // unwrap
            true
          ];
        }
        resolve({
          method,
          params
        });
      });
    };

    const creatTransaction = (contract: any, method: string, params: any) => {
      if (!method) return;

      const option = {
        value:
          ["Borrow"].includes(actionText) && market.isNative
            ? parsedAmount
            : void 0
      };

      console.log('====method', method)
      const createTx = (gas?: any) => {
        const _gas = gas ? Big(gas.toString()).mul(1.2).toFixed(0) : "4000000";
        contract.populateTransaction[method](...params, {
          ...option,
          gasLimit: _gas
        })
          .then((res: any) => {
            onLoad({
              gas: _gas,
              unsignedTx: res,
              isError: false
            });
          })
          .catch((err: any) => {
            console.log("%s populateTransaction failure: %o", method, err);
            onLoad({});
          });
      };

      try {
        contract?.estimateGas?.[method](...params, option)
          .then((gas: any) => {
            createTx(gas);
          })
          .catch((err: any) => {
            console.log('%s estimateGas failure: %o', method, err);
            createTx();
          });
      } catch (error) {
        console.log(error)
      }
    };

    if (actionType === "Earn") {
      let method = "";
      let params: any = [];
      let contract = new ethers.Contract(
        market.earnToken.address,
        EARN_ABI,
        provider.getSigner()
      );
      if (actionText === "Deposit") {
        method = "deposit";
        params = [
          // amount
          parsedAmount,
          // account
          account
        ];
      }
      creatTransaction(contract, method, params);
      return;
    }

    console.log('====contractAddress====', contractAddress)
    const contract = new ethers.Contract(
      contractAddress,
      abi,
      provider.getSigner()
    );
    getParams().then(({ method, params }: any) => {
      creatTransaction(contract, method, method === "closeDenVault" ? params : [params]);
    });
  }, [update]);

  return null;
};

export default BeraborrowHandler;
