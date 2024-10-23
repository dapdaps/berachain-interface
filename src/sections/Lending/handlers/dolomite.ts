import Big from 'big.js';
import { ethers } from 'ethers';
import { useEffect } from 'react';

const DEPOSIT_ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_dolomiteMargin',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    payable: true,
    stateMutability: 'payable',
    type: 'fallback'
  },
  {
    constant: true,
    inputs: [],
    name: 'DOLOMITE_MARGIN',
    outputs: [
      {
        internalType: 'contract IDolomiteMargin',
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_toAccountNumber',
        type: 'uint256'
      }
    ],
    name: 'depositETH',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'depositETHIntoDefaultAccount',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_toAccountNumber',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_marketId',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_amountPar',
        type: 'uint256'
      }
    ],
    name: 'depositPar',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_marketId',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_amountPar',
        type: 'uint256'
      }
    ],
    name: 'depositParIntoDefaultAccount',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_toAccountNumber',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_marketId',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_amountWei',
        type: 'uint256'
      }
    ],
    name: 'depositWei',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_marketId',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_amountWei',
        type: 'uint256'
      }
    ],
    name: 'depositWeiIntoDefaultAccount',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address payable',
        name: '_weth',
        type: 'address'
      }
    ],
    name: 'initializeETHMarket',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_fromAccountNumber',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_amountWei',
        type: 'uint256'
      },
      {
        internalType: 'enum AccountBalanceLib.BalanceCheckFlag',
        name: '_balanceCheckFlag',
        type: 'uint8'
      }
    ],
    name: 'withdrawETH',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_amountWei',
        type: 'uint256'
      },
      {
        internalType: 'enum AccountBalanceLib.BalanceCheckFlag',
        name: '_balanceCheckFlag',
        type: 'uint8'
      }
    ],
    name: 'withdrawETHFromDefaultAccount',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_fromAccountNumber',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_marketId',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_amountPar',
        type: 'uint256'
      },
      {
        internalType: 'enum AccountBalanceLib.BalanceCheckFlag',
        name: '_balanceCheckFlag',
        type: 'uint8'
      }
    ],
    name: 'withdrawPar',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_marketId',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_amountPar',
        type: 'uint256'
      },
      {
        internalType: 'enum AccountBalanceLib.BalanceCheckFlag',
        name: '_balanceCheckFlag',
        type: 'uint8'
      }
    ],
    name: 'withdrawParFromDefaultAccount',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_fromAccountNumber',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_marketId',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_amountWei',
        type: 'uint256'
      },
      {
        internalType: 'enum AccountBalanceLib.BalanceCheckFlag',
        name: '_balanceCheckFlag',
        type: 'uint8'
      }
    ],
    name: 'withdrawWei',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_marketId',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_amountWei',
        type: 'uint256'
      },
      {
        internalType: 'enum AccountBalanceLib.BalanceCheckFlag',
        name: '_balanceCheckFlag',
        type: 'uint8'
      }
    ],
    name: 'withdrawWeiFromDefaultAccount',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  }
];

const BERA_DEPOSIT_ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_dolomiteMargin',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    payable: true,
    stateMutability: 'payable',
    type: 'fallback'
  },
  {
    constant: true,
    inputs: [],
    name: 'DOLOMITE_MARGIN',
    outputs: [
      {
        internalType: 'contract IDolomiteMargin',
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'PAYABLE_MARKET_ID',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'WRAPPED_PAYABLE_TOKEN',
    outputs: [
      {
        internalType: 'contract IWETH',
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_toAccountNumber',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_marketId',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_amountPar',
        type: 'uint256'
      }
    ],
    name: 'depositPar',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_marketId',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_amountPar',
        type: 'uint256'
      }
    ],
    name: 'depositParIntoDefaultAccount',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_toAccountNumber',
        type: 'uint256'
      }
    ],
    name: 'depositPayable',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'depositPayableIntoDefaultAccount',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_toAccountNumber',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_marketId',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_amountWei',
        type: 'uint256'
      }
    ],
    name: 'depositWei',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_marketId',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_amountWei',
        type: 'uint256'
      }
    ],
    name: 'depositWeiIntoDefaultAccount',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'g_initialized',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address payable',
        name: '_payableToken',
        type: 'address'
      }
    ],
    name: 'initializePayableMarket',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_fromAccountNumber',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_marketId',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_amountPar',
        type: 'uint256'
      },
      {
        internalType: 'enum AccountBalanceLib.BalanceCheckFlag',
        name: '_balanceCheckFlag',
        type: 'uint8'
      }
    ],
    name: 'withdrawPar',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_marketId',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_amountPar',
        type: 'uint256'
      },
      {
        internalType: 'enum AccountBalanceLib.BalanceCheckFlag',
        name: '_balanceCheckFlag',
        type: 'uint8'
      }
    ],
    name: 'withdrawParFromDefaultAccount',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_fromAccountNumber',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_amountWei',
        type: 'uint256'
      },
      {
        internalType: 'enum AccountBalanceLib.BalanceCheckFlag',
        name: '_balanceCheckFlag',
        type: 'uint8'
      }
    ],
    name: 'withdrawPayable',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_amountWei',
        type: 'uint256'
      },
      {
        internalType: 'enum AccountBalanceLib.BalanceCheckFlag',
        name: '_balanceCheckFlag',
        type: 'uint8'
      }
    ],
    name: 'withdrawPayableFromDefaultAccount',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_fromAccountNumber',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_marketId',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_amountWei',
        type: 'uint256'
      },
      {
        internalType: 'enum AccountBalanceLib.BalanceCheckFlag',
        name: '_balanceCheckFlag',
        type: 'uint8'
      }
    ],
    name: 'withdrawWei',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_marketId',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_amountWei',
        type: 'uint256'
      },
      {
        internalType: 'enum AccountBalanceLib.BalanceCheckFlag',
        name: '_balanceCheckFlag',
        type: 'uint8'
      }
    ],
    name: 'withdrawWeiFromDefaultAccount',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  }
];

const BORROW_ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'dolomiteMargin',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_borrower',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: '_borrowAccountNumber',
        type: 'uint256'
      }
    ],
    name: 'BorrowPositionOpen',
    type: 'event'
  },
  {
    constant: true,
    inputs: [],
    name: 'DOLOMITE_MARGIN',
    outputs: [
      {
        internalType: 'contract IDolomiteMargin',
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_borrowAccountNumber',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_toAccountNumber',
        type: 'uint256'
      },
      {
        internalType: 'uint256[]',
        name: '_collateralMarketIds',
        type: 'uint256[]'
      }
    ],
    name: 'closeBorrowPosition',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_fromAccountNumber',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_toAccountNumber',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_marketId',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_amountWei',
        type: 'uint256'
      },
      {
        internalType: 'enum AccountBalanceLib.BalanceCheckFlag',
        name: '_balanceCheckFlag',
        type: 'uint8'
      }
    ],
    name: 'openBorrowPosition',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_fromAccountNumber',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_borrowAccountNumber',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_marketId',
        type: 'uint256'
      },
      {
        internalType: 'enum AccountBalanceLib.BalanceCheckFlag',
        name: '_balanceCheckFlag',
        type: 'uint8'
      }
    ],
    name: 'repayAllForBorrowPosition',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_fromAccountNumber',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_toAccountNumber',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_marketId',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_amountWei',
        type: 'uint256'
      },
      {
        internalType: 'enum AccountBalanceLib.BalanceCheckFlag',
        name: '_balanceCheckFlag',
        type: 'uint8'
      }
    ],
    name: 'transferBetweenAccounts',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  }
];

const generateAccountNumber = () => {
  const timestamp = Date.now().toString();
  const remainingLength = 77 - timestamp.length;
  let randomDigits = '';
  for (let i = 0; i < remainingLength; i++) {
    randomDigits += Math.floor(Math.random() * 10);
  }

  return timestamp + randomDigits;
};

const BERA_CHAIN = 80084;

const DolomiteHandler = (props: any) => {
  const { update, data, amount, account, onLoad, provider, chainId } = props;

  const { marginAccount } = data.position || {};

  useEffect(() => {
    const isCollateral = data.actionText.includes('Collateral');
    if (!data.actionText || !data.underlyingToken) return;

    if (!isCollateral && !update) return;
    console.log('HANDLER--', isCollateral, update, data);
    const isNative = data.underlyingToken.isNative;

    let options: any = {};
    let params: any = [];
    let method: any = '';
    let contract: any = null;

    if (!data.address || !amount) {
      return;
    }

    const parsedAmount = ethers.utils.parseUnits(amount, data.underlyingToken.decimals);
    const accountNumber = marginAccount?.accountNumber || '0';

    options = {
      value: isNative && (data.actionText === 'Deposit' || data.actionText === 'Repay') ? parsedAmount : 0,
      gasLimit: 4000000
    };

    if (['Deposit', 'Withdraw'].includes(data.actionText)) {
      contract = new ethers.Contract(data.config.depositWithdrawalProxy, DEPOSIT_ABI, provider.getSigner());
      if (chainId === BERA_CHAIN) {
        contract = new ethers.Contract(data.config.depositWithdrawalProxy, BERA_DEPOSIT_ABI, provider.getSigner());
      }

      if (data.actionText === 'Deposit') {
        method = isNative ? 'depositETHIntoDefaultAccount' : 'depositWeiIntoDefaultAccount';
        params = isNative ? [] : [data.marketId, parsedAmount];

        if (chainId === BERA_CHAIN) {
          method = isNative ? 'depositPayableIntoDefaultAccount' : 'depositWeiIntoDefaultAccount';
          params = isNative ? [] : [data.marketId, parsedAmount];
        }
      }

      if (data.actionText === 'Withdraw') {
        method = isNative ? 'withdrawETHFromDefaultAccount' : 'withdrawWeiFromDefaultAccount';
        params = isNative ? [parsedAmount, 1] : [data.marketId, parsedAmount, 1];

        if (chainId === BERA_CHAIN) {
          method = isNative ? 'withdrawPayableFromDefaultAccount' : 'withdrawWeiFromDefaultAccount';
          params = isNative ? [parsedAmount, 1] : [data.marketId, parsedAmount, 1];
        }
      }
    }

    if (['Add Collateral', 'Remove Collateral', 'Borrow', 'Repay', 'Add Position'].includes(data.actionText)) {
      contract = new ethers.Contract(data.config.borrowPositionProxyV1, BORROW_ABI, provider.getSigner());

      if (data.actionText === 'Add Position') {
        method = 'openBorrowPosition';
        params = [
          // _fromAccountNumber
          0,
          // _toAccountNumber
          generateAccountNumber(),
          // _marketId
          data.marketId,
          // _amountWei
          parsedAmount,
          // _balanceCheckFlag
          1
        ];
      }

      if (data.actionText === 'Add Collateral') {
        method = 'transferBetweenAccounts';
        params = [
          // _fromAccountNumber
          0,
          // _toAccountNumber
          accountNumber,
          // _marketId
          data.marketId,
          // _amountWei
          parsedAmount,
          // _balanceCheckFlag
          1
        ];
      }

      if (data.actionText === 'Remove Collateral') {
        method = 'transferBetweenAccounts';
        params = [
          // _fromAccountNumber
          accountNumber,
          // _toAccountNumber
          0,
          // _marketId
          data.marketId,
          // _amountWei
          parsedAmount,
          // _balanceCheckFlag
          1
        ];
        if (data.isClosePosition) {
          method = 'closeBorrowPosition';
          params = [
            // _fromAccountNumber
            accountNumber,
            // _toAccountNumber
            0,
            // _marketId
            [data.marketId]
          ];
        }
      }

      if (data.actionText === 'Borrow') {
        method = 'transferBetweenAccounts';
        params = [
          // _fromAccountNumber
          accountNumber,
          // _toAccountNumber
          0,
          // _marketId
          data.marketId,
          // _amountWei
          parsedAmount,
          // _balanceCheckFlag
          2
        ];
      }

      if (data.actionText === 'Repay') {
        method = 'transferBetweenAccounts';
        params = [
          // _fromAccountNumber
          0,
          // _toAccountNumber
          accountNumber,
          // _marketId
          data.marketId,
          // _amountWei
          parsedAmount,
          // _balanceCheckFlag
          1
        ];
        // if (data.isRepayAll) {
        //   method = 'repayAllForBorrowPosition';
        //   params = [
        //     // _fromAccountNumber
        //     0,
        //     // _borrowAccountNumber
        //     accountNumber,
        //     // _marketId
        //     data.marketId,
        //     // _balanceCheckFlag
        //     1
        //   ];
        // }
      }
    }

    if (!contract) return;

    console.log('HANDLER--', contract, method, params);

    const createTx = (gas?: any) => {
      const _gas = gas ? Big(gas.toString()).mul(1.2).toFixed(0) : 4000000;
      contract.populateTransaction[method](...params, {
        ...options,
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
          onLoad({});
        });
    };

    contract.estimateGas[method](...params, options)
      .then((gas: any) => {
        createTx(gas);
      })
      .catch((err: any) => {
        console.log('estimateGas', err);
        createTx();
      });
  }, [update]);

  return null;
};

export default DolomiteHandler;
