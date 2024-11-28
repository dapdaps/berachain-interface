


import { usePriceStore } from '@/stores/usePriceStore';
import { asyncFetch } from '@/utils/http';
import { multicall } from '@/utils/multicall';
import Big from 'big.js';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

export const ERC20_ABI = [
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
  }
]
export const ICHI_ABI = [
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "shares",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "withdraw",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amount0",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount1",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
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
    "name": "getTotalAmounts",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "total0",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "total1",
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
    "inputs": [],
    "name": "getTotalAmounts",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "total0",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "total1",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]
export default function useAquaBeraData(props: any) {
  const {
    name,
    pairs,
    sender,
    provider,
    onLoad,
    multicallAddress,
  } = props;
  const prices = usePriceStore(store => store.price);
  const [reloadCount, setReloadCount] = useState(0);
  const dataList: any = [];
  const formatedData = () => {
    onLoad({ dataList });
  };

  const get7DayApr = async (_dataList) => {
    const response = await asyncFetch("https://rwf3uyiewzdnhavtega3imkynm.appsync-api.us-east-1.amazonaws.com/graphql", {
      method: "POST",
      headers: {
        "x-api-key": "da2-lcrfa5vgu5dkdct5ddrckpilj4"
      },
      body: JSON.stringify({
        "operationName": "ListMonitorVaults",
        "variables": {},
        "query": "query ListMonitorVaults {\n  listMonitorVaults {\n    items {\n      name\n      positions {\n        currentTick\n        limitLower\n        limitUpper\n        barsInsideLimit\n        barsInsideBase\n        baseLower\n        baseUpper\n        __typename\n      }\n      needRebalance\n      address\n      displayName\n      memberTokenRatio\n      baseTokenValue\n      pendingDeposits\n      pendingDepositsRatio\n      vaultStrength\n      tvl\n      sevenDaysChange\n      scarceTokenValue\n      scarceTokenMarketCap\n      vaultIRR\n      vaultIrrAllTx\n      isHodlVault\n      needRebalanceFrom\n      lastRebalance\n      isInverted\n      wallPrice\n      poolAddress\n      scarceTokenPriceFromVault\n      targetVaultStrength\n      vaultMetrics {\n        timeInterval\n        feeApr\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}"
      })
    })
    const vaults = response?.data?.listMonitorVaults?.items ?? []
    for (let i = 0; i < _dataList?.length; i++) {
      const _data = _dataList[i]
      for (let j = 0; j < _data?.pairedTokens?.length; j++) {
        const pairedToken = _data?.pairedTokens[j];
        const vault = vaults?.find(vault => vault?.address === pairedToken?.ichiAddress)
        if (vault) {
          vault?.vaultMetrics?.forEach((metric: any) => {
            if (metric?.timeInterval === 7) {
              _data.pairedTokens[j].apr = metric?.feeApr
            }
          })
        } else {
          _data.pairedTokens[j].apr = 0
        }
      }
      const sortAprPairedTokens = _data.pairedTokens.sort((prev: any, next: any) => next?.apr - prev?.apr)
      _data.maxApr = sortAprPairedTokens?.[0]?.apr
      _data.minApr = sortAprPairedTokens?.[sortAprPairedTokens?.length - 1]?.apr
    }
  }
  const getBalance = async (_dataList: any) => {
    const calls = [

    ]

    _dataList.forEach(_data => {
      calls.push({
        address: _data?.address,
        name: "balanceOf",
        params: [sender]
      })
    })
    const result = await multicall({
      abi: ERC20_ABI,
      options: {},
      calls: calls,
      multicallAddress,
      provider
    })
    for (let i = 0; i < result.length; i++) {
      _dataList[i].balance = result?.[i] ? ethers.utils.formatUnits(result?.[i]?.[0], _dataList[i]?.decimals) : 0
    }
  }
  const getYourValue = async (_data) => {
    const balanceOfCalls = [
    ]
    const getTotalAmountsCalls = [
    ]
    const totalSupplyCalls = [
    ]
    _data?.pairedTokens?.forEach(pairedToken => {
      balanceOfCalls.push({
        address: pairedToken?.ichiAddress,
        name: 'balanceOf',
        params: [sender]
      })
      getTotalAmountsCalls.push({
        address: pairedToken?.ichiAddress,
        name: 'getTotalAmounts',
      })
      totalSupplyCalls.push({
        address: pairedToken?.ichiAddress,
        name: 'totalSupply',
      })
    })

    try {
      const balanceOfResult = await multicall({
        abi: ICHI_ABI,
        options: {},
        calls: balanceOfCalls,
        multicallAddress,
        provider
      })
      const getTotalAmountsResult = await multicall({
        abi: ICHI_ABI,
        options: {},
        calls: getTotalAmountsCalls,
        multicallAddress,
        provider
      })
      const totalSupplyResult = await multicall({
        abi: ICHI_ABI,
        options: {},
        calls: totalSupplyCalls,
        multicallAddress,
        provider
      })

      for (let i = 0; i < _data?.pairedTokens?.length; i++) {
        const pairedToken = _data?.pairedTokens[i];
        const totalSupply = ethers.utils.formatUnits(totalSupplyResult?.[i]?.[0])
        const shares = ethers.utils.formatUnits(balanceOfResult?.[i]?.[0] ?? 0)
        const amt0 = ethers.utils.formatUnits(getTotalAmountsResult?.[i]?.[0])
        const amt1 = ethers.utils.formatUnits(getTotalAmountsResult?.[i]?.[1])
        _data.pairedTokens[i] = {
          ..._data.pairedTokens[i],
          values: [Big(amt0).times(shares).div(totalSupply).toFixed(), Big(amt1).times(shares).div(totalSupply).toFixed()],
          yourValue: Big(Big(amt0).plus(amt1)).times(shares).div(totalSupply).toFixed(),
        }
      }

    } catch (error) {
      console.error(error)
    }
  }
  const getTvl = async (_data: any) => {
    const calls = [

    ]
    _data?.pairedTokens?.forEach(pairedToken => {
      calls.push({
        address: pairedToken?.ichiAddress,
        name: 'getTotalAmounts',
      })
    })
    try {
      const result = await multicall({
        abi: ICHI_ABI,
        options: {},
        calls: calls,
        multicallAddress,
        provider
      })

      for (let i = 0; i < _data?.pairedTokens?.length; i++) {
        const pairedToken = _data?.pairedTokens[i];
        const [amount0, amount1] = result?.[i]
        _data.pairedTokens[i] = {
          ..._data.pairedTokens[i],
          tvl: Big(amount0).times(prices?.[_data?.symbol] ?? 0).plus(Big(amount1).times(prices?.[pairedToken?.symbol] ?? 0)).toFixed()
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
  const handleGetYourValue = async (_dataList: any) => {
    for (let i = 0; i < _dataList.length; i++) {
      await getYourValue(_dataList[i])
    }
  }
  const handleGetTvl = async (_dataList: any) => {
    for (let i = 0; i < _dataList.length; i++) {
      await getTvl(_dataList[i])
    }
  }
  const getDataList = async () => {
    for (const pair of pairs) {
      const _data = {
        ...pair
      }
      dataList.push(_data);
    }
    await get7DayApr(dataList)
    await getBalance(dataList)
    await handleGetYourValue(dataList)
    await handleGetTvl(dataList)
    formatedData();
  };
  useEffect(() => {
    if (name !== 'AquaBera' || !sender || !provider) return;
    getDataList();
  }, [name, sender, provider, reloadCount]);

  return {
    reload: () => {
      setReloadCount(reloadCount + 1);
    },
    getDataList
  };
}
