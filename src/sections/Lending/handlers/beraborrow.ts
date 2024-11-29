import Big from 'big.js';
import { ethers, utils } from 'ethers';
import { useEffect } from 'react';

const ABI: any = {
  beraWrapper: [
    {
      "type": "constructor",
      "inputs": [
        {
          "name": "_borrowerOperations",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "_wBeraDenManager",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "_wBera",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "_nectar",
          "type": "address",
          "internalType": "address"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "receive",
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "addCollNative",
      "inputs": [
        {
          "name": "account",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "_upperHint",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "_lowerHint",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [],
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "adjustDenNative",
      "inputs": [
        {
          "name": "account",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "_maxFeePercentage",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "_collWithdrawal",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "_debtChange",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "_isDebtIncrease",
          "type": "bool",
          "internalType": "bool"
        },
        {
          "name": "_upperHint",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "_lowerHint",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "unwrap",
          "type": "bool",
          "internalType": "bool"
        }
      ],
      "outputs": [],
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "openDenNative",
      "inputs": [
        {
          "name": "account",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "_maxFeePercentage",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "_debtAmount",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "_upperHint",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "_lowerHint",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [],
      "stateMutability": "payable"
    }
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

const BeraborrowHandler = (props: any) => {
  const { update, config, market, actionText, account, borrowAmount, amount, onLoad, provider, chainId } = props;

  useEffect(() => {

    if (!update) return;

    const contractAddress = config[market.vault];
    const abi = ABI[market.vault];
    const parsedAmount = ethers.utils.parseUnits(amount || '0', market.decimals);
    const parsedBorrowAmount = ethers.utils.parseUnits(borrowAmount || '0', config.borrowToken.decimals);
    const isOpened = market.status === 'open';
    const isClose = actionText === 'Close';
    const isRepay = actionText === 'Repay';
    const isBorrow = actionText === 'Borrow';

    let contract = new ethers.Contract(contractAddress, abi, provider.getSigner());
    if (isClose) {
      contract = new ethers.Contract(config.borrowerOperations, ABI.borrowerOperations, provider.getSigner());
      if (market.vault === 'collVaultRouter') {
        contract = new ethers.Contract(config.collVaultRouter, ABI.collVaultRouter, provider.getSigner());
      }
    }

    let method = '';
    let params: any = [];
    switch (market.vault) {
      case 'beraWrapper':
        method = 'openDenNative';
        params = [
          // account
          account,
          // _maxFeePercentage
          '10000000000000000',
          // _debtAmount
          parsedBorrowAmount,
          // _upperHint
          config.upperHint,
          // _lowerHint
          config.lowerHint
        ];
        if (isOpened) {
          method = 'adjustDenNative';
          params = [
            // account
            account,
            // _maxFeePercentage
            '10000000000000000',
            // _collWithdrawal
            isRepay ? parsedAmount : '0',
            // _debtChange
            parsedBorrowAmount,
            // _isDebtIncrease: repay=false, borrow=true, add Collateral without borrow=false
            !(isRepay || !borrowAmount || Big(borrowAmount).lte(0)),
            // _upperHint
            config.upperHint,
            // _lowerHint
            config.lowerHint,
            // unwrap
            true
          ];
        }
        if (isClose) {
          method = 'closeDen';
          params = [
            // denManager
            market.denManager,
            // account
            account
          ];
        }
        break;
      case 'borrowerOperations':
        method = 'openDen';
        params = [
          // denManager
          market.denManager,
          // account
          account,
          // _maxFeePercentage
          '10000000000000000',
          // _collateralAmount
          parsedAmount,
          // _debtAmount
          parsedBorrowAmount,
          // _upperHint
          config.upperHint,
          // _lowerHint
          config.lowerHint
        ];
        if (isOpened) {
          method = 'adjustDen';
          params = [
            // denManager
            market.denManager,
            // account
            account,
            // _maxFeePercentage
            '10000000000000000',
            // _collDeposit
            isBorrow ? parsedAmount : '0',
            // _collWithdrawal
            isRepay ? parsedAmount : '0',
            // _debtChange
            parsedBorrowAmount,
            // _isDebtIncrease: repay=false, borrow=true, add Collateral without borrow=false
            !(isRepay || !borrowAmount || Big(borrowAmount).lte(0)),
            // _upperHint
            config.upperHint,
            // _lowerHint
            config.lowerHint
          ];
        }
        if (isClose) {
          method = 'closeDen';
          params = [
            // denManager
            market.denManager,
            // account
            account
          ];
        }
        break;
      case 'collVaultRouter':
        method = 'openDenVault';
        params = [
          // denManager
          market.denManager,
          // collVault
          market.collVault,
          // _maxFeePercentage
          '10000000000000000',
          // _debtAmount
          parsedBorrowAmount,
          // _collAssetToDeposit
          parsedAmount,
          // _upperHint
          config.upperHint,
          // _lowerHint
          config.lowerHint,
          // _minSharesMinted
          '0',
          // _collIndex
          market.collIndex,
          // _preDeposit
          '0x'
        ];
        if (isOpened) {
          method = 'adjustDenVault';
          params = [
            {
              denManager: market.denManager,
              collVault: market.collVault,
              _maxFeePercentage: '10000000000000000',
              _collAssetToDeposit: isBorrow ? parsedAmount : '0',
              _collWithdrawal: isRepay ? parsedAmount : '0',
              _debtChange: parsedBorrowAmount,
              _isDebtIncrease: !(isRepay || !borrowAmount || Big(borrowAmount).lte(0)),
              _upperHint: config.upperHint,
              _lowerHint: config.lowerHint,
              unwrap: true,
              _minSharesMinted: '0',
              _minAssetsWithdrawn: '0',
              _collIndex: market.collIndex,
              _preDeposit: '0x',
            }
          ];
        }
        if (isClose) {
          method = 'closeDenVault';
          params = [
            // denManager
            market.denManager,
            // collVault
            market.collVault,
            // minAssetsWithdrawn
            '10000000000000000',
            // collIndex
            market.collIndex,
            // unwrap
            true
          ];
        }
        break;
      default:
        break;
    }

    console.log(method);

    if (!method) return;

    const option = {
      value: (['Borrow'].includes(actionText) && market.isNative) ? parsedAmount : void 0,
    };

    const createTx = (gas?: any) => {
      const _gas = gas ? Big(gas.toString()).mul(1.2).toFixed(0) : '4000000';
      contract.populateTransaction[method](...params, {
        ...option,
        gasLimit: _gas,
      })
        .then((res: any) => {
          onLoad({
            gas: _gas,
            unsignedTx: res,
            isError: false
          });
        })
        .catch((err: any) => {
          console.log('%s populateTransaction failure: %o', method, err);
          onLoad({});
        });
    };

    contract.estimateGas[method](...params, option)
      .then((gas: any) => {
        createTx(gas);
      })
      .catch((err: any) => {
        console.log('%s estimateGas failure: %o', method, err);
        createTx();
      });
  }, [update]);

  return null;
};

export default BeraborrowHandler;
