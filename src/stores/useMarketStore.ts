import {create} from 'zustand';
import { ethers } from 'ethers';
import Big from 'big.js';
import { multicall } from '@/utils/multicall';
import { TokenInfo } from '@/sections/Lending/Bend/hooks/useBend';
import { formatHealthFactor, isValid } from '@/utils/utils';
import { bigMin } from '@/utils/formatMoney';

export const ACTUAL_BORROW_AMOUNT_RATE = 0.99;

interface IData {
  markets: TokenInfo[];
  account: string;
  chainId: number;
  provider: ethers.providers.Web3Provider;
  multicallAddress: string;
  config?: any;
  prices?: any;
}

interface BendState {
  getBendSupplyBalance: any;
  getBendSupply: any;
  initData: IData;
  setInitData: any;
  getUserAccountData: any;
  userAccountData: any;
  getUserDebts: any;
  netBaseData: any;
  getPoolDataProvider: any;
  calculateNetBaseData: () => void;
  triggerUpdate: any;
  updateCounter: number;
  getLiquidity: any;
}

const useBendStore = create<BendState>((set, get) => ({
  initData: {
    markets: [],
    account: '',
    chainId: 0,
    provider: {} as ethers.providers.Web3Provider,
    multicallAddress: ''
  },
  userAccountData: {},
  netBaseData: {},
  updateCounter: 0,
  setInitData(data: IData) {
    set({ initData: data });
  },
  triggerUpdate: () => {
    set((prev) => ({ updateCounter: prev.updateCounter + 1 }));
  },
  getBendSupplyBalance: async () => {
    const { initData: { markets, account, provider, multicallAddress } } = get();

    const calls = markets.map((item: TokenInfo) => ({
      address: item.underlyingAsset,
      name: 'balanceOf',
      params: [account]
    }));

    try {
      const balances = await multicall({
        abi: [
          {
            inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
            name: 'balanceOf',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function'
          }
        ],
        calls,
        options: {},
        multicallAddress,
        provider
      });

      const updatedMarkets = markets.map((item: TokenInfo, index: number) => {
        const balanceRaw = Big(balances[index]?.toString() || 0).div(Big(10).pow(item.decimals));
        const balance = balanceRaw.toFixed(item.decimals, 0);
        const balanceInUSD = balanceRaw.times(Big(item.tokenPrice || 1)).toFixed();

        return {
          ...item,
          balance,
          balanceInUSD
        };
      });

      set({
        initData: {
          ...get().initData,
          markets: updatedMarkets
        }
      })
      console.log(updatedMarkets, 'getBendSupplyBalance: updatedMarkets');
      
      return updatedMarkets;
    } catch (err) {
      console.error('getBendSupplyBalance error:', err);
    }
  },
  getBendSupply: async () => {
    const { initData: { markets, account, provider, multicallAddress, config } } = get();

    const abi = [
      {
        type: 'function',
        name: 'getUserReserveData',
        inputs: [
          { name: 'asset', type: 'address', internalType: 'address' },
          { name: 'user', type: 'address', internalType: 'address' }
        ],
        outputs: [
          { name: 'currentATokenBalance', type: 'uint256', internalType: 'uint256' },
          { name: 'currentStableDebt', type: 'uint256', internalType: 'uint256' },
          { name: 'currentVariableDebt', type: 'uint256', internalType: 'uint256' },
          { name: 'principalStableDebt', type: 'uint256', internalType: 'uint256' },
          { name: 'scaledVariableDebt', type: 'uint256', internalType: 'uint256' },
          { name: 'stableBorrowRate', type: 'uint256', internalType: 'uint256' },
          { name: 'liquidityRate', type: 'uint256', internalType: 'uint256' },
          { name: 'stableRateLastUpdated', type: 'uint40', internalType: 'uint40' },
          { name: 'usageAsCollateralEnabled', type: 'bool', internalType: 'bool' }
        ],
        stateMutability: 'view'
      }
    ];

    const underlyingTokens = markets.map((market: any) => market.underlyingAsset);

    const calls = underlyingTokens.map((addr: any) => ({
      address: config.PoolDataProvider,
      name: 'getUserReserveData',
      params: [addr, account]
    }));

    try {
      const res = await multicall({
        abi,
        calls,
        options: {},
        multicallAddress,
        provider
      });

      const updatedMarkets = markets.map((market, index) => {
        if (res[index]) {
          const [currentATokenBalance] = res[index];
          const _bal = ethers.utils.formatUnits(currentATokenBalance, market.decimals);

          return {
            ...market,
            underlyingBalance: _bal,
            underlyingBalanceUSD: Big(_bal).mul(market.tokenPrice || 1).toFixed()
          };
        }
        return {
          ...market,
          underlyingBalance: '',
          underlyingBalanceUSD: ''
        };
      });
      set({
        initData: {
          ...get().initData,
          markets: updatedMarkets
        }
      })
      return updatedMarkets;

    } catch (err) {
      console.error('getBendSupply error:', err);
    }
  },
  getUserAccountData: async () => {
    const { initData: { provider, config, account } } = get();
    if (!config?.aavePoolV3Address) return
    try {
      const contract = new ethers.Contract(
        config.aavePoolV3Address,
        [
          {
            inputs: [
              {
                internalType: 'address',
                name: 'user',
                type: 'address'
              }
            ],
            name: 'getUserAccountData',
            outputs: [
              {
                internalType: 'uint256',
                name: 'totalCollateralBase',
                type: 'uint256'
              },
              {
                internalType: 'uint256',
                name: 'totalDebtBase',
                type: 'uint256'
              },
              {
                internalType: 'uint256',
                name: 'availableBorrowsBase',
                type: 'uint256'
              },
              {
                internalType: 'uint256',
                name: 'currentLiquidationThreshold',
                type: 'uint256'
              },
              {
                internalType: 'uint256',
                name: 'ltv',
                type: 'uint256'
              },
              {
                internalType: 'uint256',
                name: 'healthFactor',
                type: 'uint256'
              }
            ],
            stateMutability: 'view',
            type: 'function'
          }
        ],
        provider.getSigner()
      )
      contract.getUserAccountData(account)
      .then((res: any) => {
        const [
          totalCollateralBase,
          totalDebtBase,
          availableBorrowsBase,
          currentLiquidationThreshold,
          ltv,
          healthFactor
        ] = res;
        console.log(res, 'getUserAccountData: res');
        
        const totalDebtBaseUSD = ethers.utils.formatUnits(totalDebtBase.toString(), 8);

        const totalCollateralBaseUSD = ethers.utils.formatUnits(totalCollateralBase.toString(), 8);

        const threshold = ethers.utils.formatUnits(currentLiquidationThreshold.toString(), 4);

        const _totalCollateralBaseUSD = Big(totalCollateralBaseUSD).times(Big(threshold));

        const availableBorrowsBaseUSD = ethers.utils.formatUnits(availableBorrowsBase, 8);

        const BorrowPowerUsed = Big(totalDebtBaseUSD || 0)
          .div(_totalCollateralBaseUSD.eq(0) ? 1 : _totalCollateralBaseUSD)
          .times(100)
          .toFixed();

        const hf = Big(totalDebtBaseUSD).lt(0.001)
          ? formatHealthFactor('∞')
          : formatHealthFactor(ethers.utils.formatUnits(healthFactor));

        set({
          userAccountData: {
            totalCollateralBaseUSD,
            totalDebtBaseUSD,
            availableBorrowsBaseUSD,
            BorrowPowerUsed,
            healthFactor: hf
          }
        })
        
        return availableBorrowsBaseUSD
      })
      .then((res: any) => {
        get().getLiquidity(res)
      })
    } catch (error) {
      console.log('getUserAccountData error:', error);
    }
  },
  getUserDebts: async () => {
    const { initData: { markets, account, provider, multicallAddress } } = get();
    const variableDebtTokenAddresss = markets?.map((item: any) => item.variableDebtTokenAddress).filter(Boolean);
    const calls = variableDebtTokenAddresss?.map((addr: any) => ({
      address: addr,
      name: 'balanceOf',
      params: [account]
    }));

    multicall({
      abi: [
        {
          inputs: [
            {
              internalType: 'address',
              name: 'user',
              type: 'address'
            }
          ],
          name: 'balanceOf',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256'
            }
          ],
          stateMutability: 'view',
          type: 'function'
        }
      ],
      calls,
      options: {},
      multicallAddress,
      provider
    })
      .then((res: any) => {
        const updatedMarkets = markets.map((market, index) => {
          if (res[index]) {
            const currentDebtBalance = res[index][0];
            const _debt = ethers.utils.formatUnits(currentDebtBalance, market.decimals);
      
            return {
              ...market,
              debt: _debt,
              debtInUSD: Big(_debt).mul(market.tokenPrice || 1).toFixed()
            };
          }
          return {
            ...market,
            debt: '',
            debtInUSD: ''
          };
        });
        
        set({
          initData: {
            ...get().initData,
            markets: updatedMarkets
          }
        });
        return updatedMarkets;
      })
      .then(() => get().calculateNetBaseData())
      .catch((err: any) => {
        console.log('getUserDebts_err', err);
      });

  },
  calculateNetBaseData: async () => {
    const { initData: { markets } } = get();

    if (!markets.length) return;

    // const totalWalletInUSD =  markets.reduce((total: any, market: any) => {
    //   if (market.balanceInUSD && market.balanceInUSD !== '') {
    //     try {
    //       return total.plus(Big(market.balanceInUSD));
    //     } catch (error) {
    //       console.error(`Error processing balanceInUSD for market ${market.symbol}`, error);
    //     }
    //   }
    //   return total;
    // }, '0');

    const totalWalletInUSD = markets.reduce(
      (total, cur) => Big(total).plus(cur.balanceInUSD || 0).toFixed(),
      '0'
    );

    const supplyBal = markets?.filter(item => item.symbol === 'HONEY').reduce(
      (total, cur) => Big(total).plus(cur.underlyingBalanceUSD || 0).toFixed(),
      '0'
    );

    const debtsBal = markets?.filter(item => item.symbol === 'HONEY').reduce(
      (total, cur) => Big(total).plus(cur.debtInUSD || 0).toFixed(),
      '0'
    );
    const netWorth = Big(supplyBal).minus(debtsBal).toFixed(2);

    if (Big(netWorth).eq(0)) return;

    const weightedAverageSupplyAPY = markets?.filter(item => item.symbol === 'HONEY').reduce(
      (total, cur) => Big(total).plus(
        Big(cur.underlyingBalanceUSD || 0)
          .times(cur.supplyAPY)
          .div(supplyBal)
      ).toFixed(),
      '0'
    );

    const yourSupplyRewardAPY = markets?.filter(item => item.symbol === 'HONEY').reduce(
      (total, cur) => Big(total).plus(cur.supplyRewardApy || 0).toFixed(),
      '0'
    );

    const weightedAverageBorrowsAPY = markets?.filter(item => item.symbol === 'HONEY').reduce(
      (total, cur) => Big(total).plus(
        Big(cur.debtInUSD || 0)
          .times(cur.borrowAPY)
          .div(debtsBal)
      ).toFixed(),
      '0'
    );

    const netAPY = Big(weightedAverageSupplyAPY)
      .times(supplyBal)
      .div(netWorth)
      .minus(
        Big(weightedAverageBorrowsAPY)
          .times(debtsBal)
          .div(netWorth)
      )
      .toFixed();

    const yourTotalSupply = markets?.filter(item => item.symbol === 'HONEY').reduce(
      (prev, curr) => Big(prev).plus(curr.underlyingBalanceUSD || 0).toFixed(),
      '0'
    );

    const yourTotalBorrow = markets?.filter(item => item.symbol === 'HONEY').reduce(
      (prev, curr) => Big(prev).plus(curr.debtInUSD || 0).toFixed(),
      '0'
    );

    set({
      netBaseData: {
        netAPY,
        netWorthUSD: netWorth,
        yourTotalSupply,
        yourTotalBorrow,
        yourSupplyApy: Big(weightedAverageSupplyAPY).plus(yourSupplyRewardAPY).toFixed(),
        yourBorrowApy: weightedAverageBorrowsAPY,
        totalWalletInUSD
      }
    });
  },
  getPoolDataProvider: () => {
    const { initData: { config, multicallAddress, provider, markets } } = get();
    const underlyingTokens = markets?.filter((item => item.variableDebtTokenAddress)).map((market: any) => market.underlyingAsset);
    const calls = underlyingTokens?.map((addr: any) => ({
      address: config.PoolDataProvider,
      name: 'getReserveData',
      params: [addr]
    }));

    multicall({
      abi: [
        {
          inputs: [{ internalType: 'address', name: 'asset', type: 'address' }],
          name: 'getReserveData',
          outputs: [
            { internalType: 'uint256', name: 'unbacked', type: 'uint256' },
            {
              internalType: 'uint256',
              name: 'accruedToTreasuryScaled',
              type: 'uint256'
            },
            { internalType: 'uint256', name: 'totalAToken', type: 'uint256' },
            {
              internalType: 'uint256',
              name: 'totalStableDebt',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: 'totalVariableDebt',
              type: 'uint256'
            },
            { internalType: 'uint256', name: 'liquidityRate', type: 'uint256' },
            {
              internalType: 'uint256',
              name: 'variableBorrowRate',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: 'stableBorrowRate',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: 'averageStableBorrowRate',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: 'liquidityIndex',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: 'variableBorrowIndex',
              type: 'uint256'
            },
            {
              internalType: 'uint40',
              name: 'lastUpdateTimestamp',
              type: 'uint40'
            }
          ],
          stateMutability: 'view',
          type: 'function'
        }
      ],
      calls,
      options: {},
      multicallAddress,
      provider
    })
    .then((poolData: any) => {
      if (!Array.isArray(poolData) || !poolData.length) return;
      console.log(poolData, 'poolData');
      
      const _assetsToSupply = [...markets];

      for (let i = 0; i < poolData.length; i++) {
        if (poolData[i]) {
          const [
            unbacked,
            accruedToTreasuryScaled,
            totalAToken,
            totalStableDebt,
            totalVariableDebt,
            liquidityRate,
            variableBorrowRate,
            stableBorrowRate,
            averageStableBorrowRate,
            liquidityIndex,
            variableBorrowIndex,
            lastUpdateTimestamp
          ] = poolData[i];
          const RAY = Big(10).pow(27);
          const SECONDS_PER_YEAR = 31_536_000;
          const depositAPR = Big(liquidityRate).div(RAY || 1);
          const depositAPY0 = Big(1)
            .plus(depositAPR.div(Big(SECONDS_PER_YEAR)))
            .toNumber();

          const _supplyAPY = Big(Math.pow(depositAPY0, SECONDS_PER_YEAR) - 1).toFixed();
          console.log('_supplyAPY--', _supplyAPY);

          if (!_assetsToSupply[i]) return;
          const variableBorrowAPR = Big(variableBorrowRate).div(RAY || 1);

          const variableBorrowAPY0 = Big(1)
            .plus(Big(variableBorrowAPR || 0).div(Big(SECONDS_PER_YEAR)))
            .toNumber();

          const _borrowAPY = Big(Math.pow(variableBorrowAPY0, SECONDS_PER_YEAR) - 1).toFixed();

          const _utilized = Big(totalVariableDebt || 0)
            .div(Big(totalAToken || 1))
            .toFixed();

          _assetsToSupply[i].supplyAPY = _supplyAPY;
          _assetsToSupply[i].borrowAPY = _borrowAPY;
          _assetsToSupply[i].utilized = _utilized;
        }
      }
      
      set({
        initData: {
          ...get().initData,
          markets: _assetsToSupply
        }
      });

      return _assetsToSupply
    })
    .catch((err: any) => {
      console.log('getPoolDataProvider_err', err);
    });
  },
  getLiquidity: async (availableBorrowsUSD: any) => {
    const { initData: { markets, provider, multicallAddress, prices } } = get()
    const aTokenAddresss = markets?.map((item: any) => item.aTokenAddress);
    const variableDebtTokenAddresss = markets?.map((item: any) => item.variableDebtTokenAddress).filter(Boolean);

    const calls = aTokenAddresss
      ?.map((addr: any) => ({
        address: addr,
        name: 'totalSupply'
      }))
      .concat(
        variableDebtTokenAddresss?.map((addr: any) => ({
          address: addr,
          name: 'totalSupply'
        }))
      );
      multicall({
        abi: [
          {
            inputs: [],
            name: 'totalSupply',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function'
          }
        ],
        calls,
        options: {},
        multicallAddress,
        provider
      })
        .then((res: any) => {
          try {
            const l = res.length;
            const aTokenTotal = res.slice(0, l / 2);
            const debtTotal = res.slice(l / 2);
    
            const _assetsToSupply = [...markets];
            for (let i = 0; i < _assetsToSupply.length; i++) {
              const liquidityAmount = Big(aTokenTotal[i] || 0)
                .minus(Big(debtTotal[i] || 0))
                .toFixed();
              _assetsToSupply[i].availableLiquidity = liquidityAmount;
              const _availableLiquidityUSD = Big(ethers.utils.formatUnits(liquidityAmount, _assetsToSupply[i].decimals))
                .mul(Big(prices[_assetsToSupply[i].symbol] || 1))
                .toFixed();
              _assetsToSupply[i].availableLiquidityUSD = _availableLiquidityUSD;
    
              const _availableBorrowsUSD = bigMin(
                availableBorrowsUSD,
                ethers.utils.formatUnits(liquidityAmount, _assetsToSupply[i].decimals)
              )
                .times(ACTUAL_BORROW_AMOUNT_RATE)
                .toFixed();
    
              const _availableBorrows = calcAvailableBorrows(_availableBorrowsUSD, _assetsToSupply[i].tokenPrice || 1);
    
              _assetsToSupply[i].availableBorrowsUSD = Big(_availableBorrowsUSD).lt(0) ? 0 : _availableBorrowsUSD;
              _assetsToSupply[i].availableBorrows = Big(_availableBorrows).lt(0) ? 0 : _availableBorrows;
            }
            
            set({
              initData: {
                ...get().initData,
                markets: _assetsToSupply
              }
            });

          } catch (error) {
            console.log('catch getLiquidity', error);
          }
        })
        .catch((err: any) => {
          console.log('getLiquidity_err', err);
        });
  }
}));

export default useBendStore;

function calcAvailableBorrows(availableBorrowsUSD: any, tokenPrice: any) {
  const r =
    isValid(availableBorrowsUSD) && isValid(tokenPrice)
      ? Big(availableBorrowsUSD || 0)
          .div(tokenPrice)
          .toFixed()
      : Number(0).toFixed();

  return r;
}