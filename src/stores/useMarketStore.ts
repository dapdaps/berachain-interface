import {create} from 'zustand';
import { ethers } from 'ethers';
import Big from 'big.js';
import { multicall } from '@/utils/multicall';
import { TokenInfo } from '@/sections/Lending/Bend/useBend';
import { formatHealthFactor } from '@/utils/utils';

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
  calculateNetBaseData: () => void;
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
  setInitData(data: IData) {
    set({ initData: data });
  },
  getBendSupplyBalance: async () => {
    const { initData: {markets, account, chainId, provider, multicallAddress } } = get();

    if (!chainId || !markets.length) return;

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
          const [currentATokenBalance, currentStableDebt] = res[index];
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
      console.log(updatedMarkets, '<=qqq===updatedMarkets');
      
      set({
        initData: {
          ...get().initData,
          markets: updatedMarkets
        }
      })
    } catch (err) {
      console.error('getBendSupply error:', err);
    }
  },
  getUserAccountData: async () => {
    const { initData: { provider, config, account } } = get();
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

        const totalDebtBaseUSD = ethers.utils.formatUnits(totalDebtBase.toString(), 8);

        const totalCollateralBaseUSD = ethers.utils.formatUnits(totalCollateralBase.toString(), 8);

        const threshold = ethers.utils.formatUnits(currentLiquidationThreshold.toString(), 4);

        const _totalCollateralBaseUSD = Big(totalCollateralBaseUSD).times(Big(threshold));

        const availableBorrowsBaseUSD = ethers.utils.formatUnits(availableBorrowsBase, 8);

        const BorrowPowerUsed = Big(totalDebtBaseUSD || 0)
          .div(_totalCollateralBaseUSD.eq(0) ? 1 : _totalCollateralBaseUSD)
          .times(100)
          .toFixed();

        const hf = Big(totalDebtBase).eq(0)
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
      })
    } catch (error) {
      console.log('getUserAccountData error:', error);
    }
  },
  getUserDebts: async () => {
    const { initData: { markets, account, provider, multicallAddress, prices } } = get();
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
        console.log('getUserDebts_res', res);
        const userDebs = [];
        const _assetsToSupply = [...markets];
        for (let index = 0; index < res.length; index++) {
          if (res[index]) {
            const market = _assetsToSupply.find(
              (item) => item.variableDebtTokenAddress === variableDebtTokenAddresss[index]
            );
            if (market) {
              const _debt = ethers.utils.formatUnits(res[index][0], market.decimals);
  
              market.debt = _debt;
              market.debtInUSD = Big(_debt || 0)
                .mul(prices[market.symbol] || 1)
                .toFixed();
              userDebs.push(market);
            }
          }
        }
        const hash: any = {};
        const _yourBorrows = userDebs.reduce((accum: any, item: any) => {
          hash[item['aTokenAddress']] ? '' : (hash[item['aTokenAddress']] = true && accum.push(item));
          return accum;
        }, []);

        set({
          initData: {
            ...get().initData,
            markets: _yourBorrows
          }
        })
      })
      .catch((err: any) => {
        console.log('getUserDebts_err', err);
      });

  },
  calculateNetBaseData: () => {
    const { initData: { markets } } = get();
    const yourSupplies = markets.filter(market => Big(market.underlyingBalance || 0).gt(0));
    const yourBorrows = markets.filter(market => Big(market.debt || 0).gt(0));

    const supplyBal = yourSupplies.reduce(
      (total, cur) => Big(total).plus(cur.underlyingBalanceUSD || 0).toFixed(),
      '0'
    );
    const debtsBal = yourBorrows.reduce(
      (total, cur) => Big(total).plus(cur.debtInUSD || 0).toFixed(),
      '0'
    );

    const netWorth = Big(supplyBal).minus(debtsBal).toFixed(2);

    if (Big(netWorth).eq(0)) return;

    const weightedAverageSupplyAPY = yourSupplies.reduce(
      (total, cur) => Big(total).plus(
        Big(cur.underlyingBalanceUSD || 0)
          .times(cur.supplyAPY || 0)
          .div(supplyBal || 1)
      ).toFixed(),
      '0'
    );

    const yourSupplyRewardAPY = yourSupplies.reduce(
      (total, cur) => Big(total).plus(cur.supplyRewardApy || 0).toFixed(),
      '0'
    );

    const weightedAverageBorrowsAPY = yourBorrows.reduce(
      (total, cur) => Big(total).plus(
        Big(cur.debtInUSD || 0)
          .times(cur.borrowAPY || 1)
          .div(debtsBal || 1)
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

    const yourTotalSupply = yourSupplies.reduce(
      (prev, curr) => Big(prev).plus(curr.underlyingBalanceUSD || 0).toFixed(),
      '0'
    );

    const yourTotalBorrow = yourBorrows.reduce(
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
        yourBorrowApy: weightedAverageBorrowsAPY
      }
    });
  }

}));

export default useBendStore;

