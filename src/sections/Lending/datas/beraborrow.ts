import axios from 'axios';
import Big from 'big.js';
import { ethers, utils } from 'ethers';
import { useEffect } from 'react';
import multicallAddresses from '@/configs/contract/multicall';
import { multicall } from '@/utils/multicall';

import { numberFormatter } from '@/utils/number-formatter';

const ERC20_ABI = [
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address'
      }
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: 'balance',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    type: "function",
    name: "fetchPrice",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
];

const DEN_ABI = [
  {
    type: "function",
    name: "getTotalActiveCollateral",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTotalActiveDebt",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
];

const calcTCR = (collateral: any, debt: any, price: any) => {
  if (!collateral || Big(collateral).lte(0)) return 0;
  if (!debt || Big(debt).lte(0)) return 0;
  return Big(collateral).times(price).div(debt).times(100).toFixed(0);
};

const BeraborrowData = (props: any) => {
  const {
    onLoad,
    markets,
    graphApi,
    denManagersParams,
    priceParams,
    borrowParams,
    prices,
    riskyRatio,
    account,
    update,
    provider,
    chainId,
    borrowToken,
  } = props;

  const multicallAddress = multicallAddresses[chainId];

  useEffect(() => {
    if (!update || !account || !provider) return;

    const getDenManagers = () => {
      return new Promise((resolve) => {
        axios
          .post(graphApi, denManagersParams(markets))
          .then((denManagersRes) => {
            const { denManagers = [] } = denManagersRes?.data?.data || {};
            const result = markets.map((m: any) => {
              const obj: any = {
                id: m.id,
                collVault: m.collVault,
                symbol: m.symbol,
                price: prices[m.symbol] || '0',
                interestRate: '0',
              };
              const curr = denManagers.find((d: any) => {
                return d.collateral.id.toLowerCase() === obj.collVault.toLowerCase();
              });
              if (!curr) return obj;
              obj.price = utils.formatUnits(curr.collateral.price.price, 36 - curr.collateral.decimals);
              obj.interestRate = Big(curr.interestRate || 0).div(100).toString();
              return obj;
            });
            resolve(result);
          })
          .catch((err: any) => {
            resolve({});
            console.log('getDenManagers failure: %o', err);
          });
      });
    };

    const getNectPrice = () => {
      return new Promise((resolve) => {
        axios
          .post(graphApi, priceParams([borrowToken]))
          .then((priceRes) => {
            const { tokens } = priceRes?.data?.data || {};
            const nextPrice = tokens?.[0]?.price?.price;
            // resolve(utils.formatUnits(nextPrice, 36 - borrowToken.decimals));
            console.log('NectPrice is %o', utils.formatUnits(nextPrice, 36 - borrowToken.decimals));
            resolve('1');
          })
          .catch((err: any) => {
            resolve('1');
            console.log('getNectPrice failure: %o', err);
          });
      });
    };

    const getPrices = () => {
      return new Promise((resolve) => {
        const result: any = [];
        const calls: any = [];
        markets.forEach((token: any) => {
          calls.push({
            address: token.denManager,
            name: 'fetchPrice',
            params: []
          });
        });
        multicall({
          abi: ERC20_ABI,
          calls,
          options: {},
          multicallAddress,
          provider: provider
        })
          .then((res: any) => {
            markets.forEach((token: any, index: number) => {
              let denManagerPrice = res?.[index]?.[0] ?? '0';
              denManagerPrice = utils.formatUnits(denManagerPrice, 36 - token.decimals);
              result.push({
                id: token.id,
                price: denManagerPrice,
              });
            });
            resolve(result);
          })
          .catch((err: any) => {
            console.log('getPrices error', err);
            resolve(result);
          });
      });
    };

    const getBorrows = () => {
      return new Promise((resolve) => {
        axios
          .post(graphApi, borrowParams(account))
          .then((borrowsRes) => {
            const { user = {} } = borrowsRes?.data?.data || {};
            const result = markets.map((m: any) => {
              const obj: any = {
                id: m.id,
                address: m.address,
                collVault: m.collVault,
                symbol: m.symbol,
                decimals: m.decimals,
                collToken: m.collToken,
                collateral: '0',
                debt: '0',
                status: '',
              };
              const curr = user?.dens?.find((d: any) => {
                return d.denManager?.collateral?.id.toLowerCase() === obj.collVault.toLowerCase();
              });
              if (!curr) return obj;
              obj.collateral = curr.collateral;
              obj.debt = curr.debt;
              obj.status = curr.status;
              return obj;
            });
            resolve(result);
          })
          .catch((err: any) => {
            resolve({});
            console.log('getBorrows failure: %o', err);
          });
      });
    };

    const getWalletBalance = () => {
      const result: any = {};
      return new Promise((resolve) => {
        let nativeOToken = '';
        const tokenList: any = markets.filter((market: any) => {
          if (market.isNative) nativeOToken = market.address;
          return market.address && !market.isNative;
        });
        const calls = tokenList.map((token: any) => ({
          address: token.address,
          name: 'balanceOf',
          params: [account]
        }));
        multicall({
          abi: ERC20_ABI,
          calls,
          options: {},
          multicallAddress,
          provider: provider
        })
          .then((res: any) => {
            for (let i = 0; i < res.length; i++) {
              result[tokenList[i].address.toLowerCase()] = res[i] && res[i][0] ? ethers.utils.formatUnits(res[i][0]._hex, tokenList[i].decimals) : '0';
            }
            if (nativeOToken) {
              provider.getBalance(account).then((rawBalance: any) => {
                result[nativeOToken.toLowerCase()] = ethers.utils.formatUnits(rawBalance._hex, 18);
                resolve(result);
              });
              return;
            }
            resolve(result);
          })
          .catch((err: any) => {
            console.log('getWalletBalance error', err);
            resolve(result);
          });
      });
    };

    const getBorrowWalletBalance = () => {
      const contract = new ethers.Contract(borrowToken.address, ERC20_ABI, provider);
      return new Promise((resolve) => {
        contract.balanceOf(account)
          .then((balance: any) => {
            resolve(utils.formatUnits(balance || '0', borrowToken.decimals));
          })
          .catch((err: any) => {
            console.log('getBorrowWalletBalance failure: %o', err);
            resolve('0');
          });
      });
    };

    const getTCR = () => {
      return new Promise((resolve) => {
        const result: any = [];
        const calls: any = [];
        markets.forEach((token: any) => {
          calls.push({
            address: token.denManager,
            name: 'getTotalActiveCollateral',
            params: []
          });
          calls.push({
            address: token.denManager,
            name: 'getTotalActiveDebt',
            params: []
          });
        });
        multicall({
          abi: DEN_ABI,
          calls,
          options: {},
          multicallAddress,
          provider: provider
        })
          .then((res: any) => {
            markets.forEach((token: any, index: number) => {
              let totalCollateral = res?.[index * 2]?.[0] ?? '0';
              let totalDebt = res?.[index * 2 + 1]?.[0] ?? '0';
              totalCollateral = utils.formatUnits(totalCollateral, 18);
              totalDebt = utils.formatUnits(totalDebt, 18);
              result.push({
                id: token.id,
                totalCollateral: totalCollateral,
                totalDebt: totalDebt,
              });
            });
            resolve(result);
          })
          .catch((err: any) => {
            console.log('getPrices error', err);
            resolve(result);
          });
      });
    };

    const getCTokensData = async () => {
      const [
        DenManagers,
        Prices,
        Borrows,
        WalletBalance,
        BorrowWalletBalance,
        TCRs,
        NECTPrice,
      ]: any = await Promise.all([
        getDenManagers(),
        getPrices(),
        getBorrows(),
        getWalletBalance(),
        getBorrowWalletBalance(),
        getTCR(),
        getNectPrice(),
      ]);
      let borrowTokenRes: any = borrowToken;
      const result = markets.map((market: any) => {
        let _address = market.address.toLowerCase();
        // if (market.isNative && wrappedToken) {
        //   _address = wrappedToken.address.toLowerCase();
        // }
        const currBorrow = Borrows.find((b: any) => b.id === market.id);
        const currPrice = Prices.find((b: any) => b.id === market.id);
        const currDenManager = DenManagers.find((b: any) => b.id === market.id);
        const currTCR = TCRs.find((b: any) => b.id === market.id);
        const currWalletBalance = WalletBalance[_address];
        let liquidationPrice = Big(0);
        if (Big(currBorrow?.collateral || 0).gt(0)) {
          liquidationPrice = Big(currBorrow?.debt || 0).times(Big(parseFloat(market.MCR)).div(100)).div(currBorrow?.collateral);
        }
        const balanceUsd = Big(currBorrow?.collateral || 0).times(currPrice?.price || 0);
        let collateralRatio = Big(0);
        if (Big(currBorrow?.debt || 0).gt(0)) {
          collateralRatio = Big(balanceUsd).div(currBorrow?.debt).times(100);
        }
        const TCR = calcTCR(currTCR?.totalCollateral, currTCR?.totalDebt, currPrice?.price);

        borrowTokenRes = {
          ...borrowToken,
          price: NECTPrice,
          priceShow: numberFormatter(NECTPrice, 2, true),
          walletBalance: BorrowWalletBalance,
          walletBalanceShown: numberFormatter(BorrowWalletBalance, 2, true),
        };

        return {
          ...market,
          riskyRatio,
          TCR,
          borrowToken: borrowTokenRes,
          status: currBorrow?.status,
          balance: currBorrow?.collateral,
          balanceUsd: balanceUsd.toFixed(2),
          balanceShown: numberFormatter(currBorrow?.collateral, 2, true),
          balanceUsdShown: numberFormatter(balanceUsd, 2, true, { prefix: '$' }),
          borrowed: currBorrow?.debt,
          borrowedShown: numberFormatter(currBorrow?.debt, 2, true),
          walletBalance: currWalletBalance,
          walletBalanceShown: numberFormatter(currWalletBalance, 2, true),
          price: currPrice?.price,
          priceShown: numberFormatter(currPrice?.price, 2, true, { prefix: '$' }),
          interestRate: currDenManager?.interestRate,
          interestRateShown: currDenManager?.interestRate + '%',
          apy: '100',
          apyShown: '100%',
          liquidationPrice: liquidationPrice.toFixed(2),
          liquidationPriceShown: numberFormatter(liquidationPrice, 2, true, { prefix: '$' }),
          collateralRatio: collateralRatio,
          collateralRatioShown: numberFormatter(collateralRatio, 2, true) + '%',
          collateralRatioRisk: Big(collateralRatio).lt(riskyRatio) ? 'HighRisk' : 'LowRisk',
        };
      });
      onLoad({
        borrowToken: borrowTokenRes,
        markets: result,
      });
    };

    getCTokensData();
  }, [update, account, provider]);

  return null;
};

export default BeraborrowData;