import Big from 'big.js';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { multicall } from '@/utils/multicall';
import { addHours } from 'date-fns';
import { get } from '@/utils/http';
import { usePriceStore } from '@/stores/usePriceStore';

export default function useBerpsData(props: any) {
  const {
    name,
    pairs,
    sender,
    provider,
    addresses,
    onLoad,
    multicallAddress,
  } = props;

  const prices = usePriceStore(store => store.price);

  const [reloadCount, setReloadCount] = useState(0);

  const dataList: any = [];

  const ERC20_ABI = [
    'function balanceOf(address) view returns (uint256)',
    {
      constant: true,
      inputs: [
        {
          internalType: 'address',
          name: 'account',
          type: 'address'
        },
        {
          internalType: 'address',
          name: '_rewardsToken',
          type: 'address'
        }
      ],
      name: 'earned',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      "inputs": [],
      "name": "shareToAssetsPrice",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "currentEpoch",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "currentEpochStart",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "marketCap",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "completeBalanceOfAssets",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "completeBalanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "totalSharesBeingWithdrawn",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "shares",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
  ];

  const formatedData = () => {
    onLoad({ dataList });
  };
  const getBerpsData = (pair: any, _data: any) => {
    return new Promise(async (resolve) => {
      try {
        const res = await multicall({
          abi: ERC20_ABI,
          options: {},
          calls: [
            {
              address: pair.withdrawToken.address,
              name: 'shareToAssetsPrice',
              params: []
            },
            {
              address: pair.withdrawToken.address,
              name: 'currentEpoch',
              params: []
            },
            {
              address: pair.withdrawToken.address,
              name: 'currentEpochStart',
              params: []
            },
            {
              address: pair.withdrawToken.address,
              name: 'marketCap',
              params: []
            },
            {
              address: pair.withdrawToken.address,
              name: 'totalSupply',
              params: []
            },
            {
              address: pair.depositToken.address,
              name: 'balanceOf',
              params: [pair.withdrawToken.address]
            },
          ],
          multicallAddress,
          provider
        });

        let [
          [price],
          [currentEpoch],
          [currentEpochStart],
          [marketCap],
          [totalSupply],
          [tvl],
        ] = res;

        price = ethers.utils.formatUnits(price, 36 - pair.withdrawToken.decimals);
        const tvlValue = ethers.utils.formatUnits(tvl, pair.withdrawToken.decimals);
        currentEpoch = ethers.utils.formatUnits(currentEpoch, 0);
        currentEpochStart = ethers.utils.formatUnits(currentEpochStart, 0);
        currentEpochStart = Big(currentEpochStart).times(1000).toNumber();
        marketCap = ethers.utils.formatUnits(marketCap, pair.withdrawToken.decimals);
        const totalSupplyValue = ethers.utils.formatUnits(totalSupply, pair.withdrawToken.decimals);

        _data.tvl = Big(tvlValue).times(price ?? 0).toFixed();
        _data.withdrawTokenPrice = price;
        _data.currentEpoch = currentEpoch;
        _data.currentEpochStart = new Date(currentEpochStart);
        _data.currentEpochEnd = addHours(new Date(currentEpochStart), 12);
        _data.marketCap = marketCap;
        _data.collateralizationRatio = Big(marketCap).div(tvlValue).times(100).toFixed(2, Big.roundDown) + '%';
        _data.totalSupply = totalSupplyValue;
        _data.initialData.current_staked_amount = tvl;
        _data.apy = '2260';
      } catch (err: any) {
        console.log('BERPS protocol failed: %o',err);
      }
      resolve(_data);
    });
  };
  const getBerpsUserData = (pair: any, _data: any) => {
    return new Promise(async (resolve) => {
      try {
        const res = await multicall({
          abi: ERC20_ABI,
          options: {},
          calls: [
            {
              address: pair.withdrawToken.address,
              name: 'completeBalanceOfAssets',
              params: [sender]
            },
            {
              address: pair.withdrawToken.address,
              name: 'completeBalanceOf',
              params: [sender]
            },
            {
              address: pair.withdrawToken.address,
              name: 'totalSharesBeingWithdrawn',
              params: [sender]
            },
            {
              address: pair.withdrawToken.address,
              name: 'balanceOf',
              params: [sender]
            },
          ],
          multicallAddress,
          provider
        });

        let [
          completeBalanceOfAssets,
          completeBalanceOf,
          totalSharesBeingWithdrawn,
          balanceOf,
        ] = res;

        completeBalanceOfAssets = completeBalanceOfAssets ? completeBalanceOfAssets[0] : '0';
        completeBalanceOf = completeBalanceOf ? completeBalanceOf[0] : '0';
        totalSharesBeingWithdrawn = totalSharesBeingWithdrawn ? totalSharesBeingWithdrawn[0] : '0';
        balanceOf = balanceOf ? balanceOf[0] : '0';

        completeBalanceOfAssets = ethers.utils.formatUnits(completeBalanceOfAssets, pair.withdrawToken.decimals);
        completeBalanceOf = ethers.utils.formatUnits(completeBalanceOf, pair.withdrawToken.decimals);
        totalSharesBeingWithdrawn = ethers.utils.formatUnits(totalSharesBeingWithdrawn, pair.withdrawToken.decimals);
        balanceOf = ethers.utils.formatUnits(balanceOf, pair.withdrawToken.decimals);

        const vaultEarnings = await get(`https://bartio-berps.berachain.com/vaultearnings/${sender}`);
        let { earnings } = vaultEarnings || {};
        earnings = ethers.utils.formatUnits(earnings, pair.withdrawToken.decimals);

        _data.completeBalanceOfAssets = completeBalanceOfAssets;
        _data.completeBalanceOf = completeBalanceOf;
        _data.totalSharesBeingWithdrawn = totalSharesBeingWithdrawn;
        _data.earnings = earnings;
        _data.estimatedEarnings = Big(earnings).plus(completeBalanceOfAssets).abs().toString();
        _data.depositAmount = balanceOf;
        _data.usdDepositAmount = Big(balanceOf).times(_data.withdrawTokenPrice).toString();
      } catch (err: any) {
        console.log('BERPS protocol failed: %o',err);
      }
      resolve(_data);
    });
  };
  const getDataList = async () => {
    for (const pair of pairs) {
      const vaultAddress = pair.withdrawToken.address;
      const _data = {
        ...pair,
        name,
        type: 'Staking',
        vaultAddress,
        initialData: {
          address: vaultAddress,
          current_staked_amount: 0,
          pool: {
            name: pair.withdrawToken.symbol,
            protocol: 'Berps',
          },
          reward_tokens: [],
          stake_token: {
            ...pair.depositToken,
            price: prices[pair.depositToken.symbol] || 1,
          },
        },
      };
      await getBerpsData(pair, _data);
      await getBerpsUserData(pair, _data);
      dataList.push(_data);
    }
    formatedData();
  };

  useEffect(() => {
    if (name !== 'Berps') return;
    getDataList();
  }, [name, sender, provider, reloadCount]);

  return {
    reload: () => {
      setReloadCount(reloadCount + 1);
    },
  };
}
