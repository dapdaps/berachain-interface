


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
  },
  {
    "inputs": [],
    "name": "token0",
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
    "inputs": [],
    "name": "token1",
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
    "inputs": [],
    "name": "deposit0Max",
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
    "name": "deposit1Max",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]
export const ETHVaultWithSlippage_ABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "minimumProceeds",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "depositETH",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "shares",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  }
]
export const ICHIVaultDepositGuard_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "vault",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "vaultDeployer",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "minimumProceeds",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "forwardDepositToICHIVault",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "vaultTokens",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
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
  const formatedData = (type) => {
    console.log('====type', type)
    onLoad({ dataList });
  };

  const get7DayApr = async (_dataList) => {
    const response = await asyncFetch("https://app.aquabera.com/api/80094")

    console.log('====response', response)
    const vaults = response?.vaults ?? [] //response?.data?.listMonitorVaults?.items ?? []
    for (let i = 0; i < _dataList?.length; i++) {
      const _data = _dataList[i]
      console.log('====_data', _data)
      const vault = vaults?.find(vault => vault?.address === _data?.ichiAddress)

      if (vault) {
        _data.apr = vault?.apr?.["7d"]
      } else {
        _data.apr = 0
      }
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
    balanceOfCalls.push({
      address: _data?.ichiAddress,
      name: 'balanceOf',
      params: [sender]
    })
    getTotalAmountsCalls.push({
      address: _data?.ichiAddress,
      name: 'getTotalAmounts',
    })
    totalSupplyCalls.push({
      address: _data?.ichiAddress,
      name: 'totalSupply',
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

      // for (let i = 0; i < _data?.length; i++) {
      //   const pairedToken = _data?.pairedTokens[i];
      //   const totalSupply = ethers.utils.formatUnits(totalSupplyResult?.[i]?.[0])
      //   const shares = ethers.utils.formatUnits(balanceOfResult?.[i]?.[0] ?? 0)
      //   const amt0 = ethers.utils.formatUnits(getTotalAmountsResult?.[i]?.[0])
      //   const amt1 = ethers.utils.formatUnits(getTotalAmountsResult?.[i]?.[1])
      //   _data.pairedTokens[i] = {
      //     ..._data.pairedTokens[i],
      //     values: [Big(amt1).times(shares).div(totalSupply).toFixed(), Big(amt0).times(shares).div(totalSupply).toFixed()],
      //     yourValue: Big(Big(amt0).plus(amt1)).times(shares).div(totalSupply).toFixed(),
      //   }
      // }

      const totalSupply = ethers.utils.formatUnits(totalSupplyResult?.[i]?.[0])
      const shares = ethers.utils.formatUnits(balanceOfResult?.[i]?.[0] ?? 0)
      const amt0 = ethers.utils.formatUnits(getTotalAmountsResult?.[i]?.[0])
      const amt1 = ethers.utils.formatUnits(getTotalAmountsResult?.[i]?.[1])

      _data.values = [Big(amt1).times(shares).div(totalSupply).toFixed(), Big(amt0).times(shares).div(totalSupply).toFixed()]
      _data.yourValue = Big(Big(amt0).plus(amt1)).times(shares).div(totalSupply).toFixed()
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

    const balanceOfCalls = [
    ]
    const getTotalAmountsCalls = [
    ]
    const totalSupplyCalls = [
    ]
    balanceOfCalls.push({
      address: _data?.ichiAddress,
      name: 'balanceOf',
      params: [sender]
    })
    getTotalAmountsCalls.push({
      address: _data?.ichiAddress,
      name: 'getTotalAmounts',
    })
    totalSupplyCalls.push({
      address: _data?.ichiAddress,
      name: 'totalSupply',
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

      // for (let i = 0; i < _data?.length; i++) {
      //   const pairedToken = _data?.pairedTokens[i];
      //   const totalSupply = ethers.utils.formatUnits(totalSupplyResult?.[i]?.[0])
      //   const shares = ethers.utils.formatUnits(balanceOfResult?.[i]?.[0] ?? 0)
      //   const amt0 = ethers.utils.formatUnits(getTotalAmountsResult?.[i]?.[0])
      //   const amt1 = ethers.utils.formatUnits(getTotalAmountsResult?.[i]?.[1])
      //   _data.pairedTokens[i] = {
      //     ..._data.pairedTokens[i],
      //     values: [Big(amt1).times(shares).div(totalSupply).toFixed(), Big(amt0).times(shares).div(totalSupply).toFixed()],
      //     yourValue: Big(Big(amt0).plus(amt1)).times(shares).div(totalSupply).toFixed(),
      //   }
      // }

      const totalSupply = ethers.utils.formatUnits(totalSupplyResult?.[i]?.[0])
      const shares = ethers.utils.formatUnits(balanceOfResult?.[i]?.[0] ?? 0)
      const amt0 = ethers.utils.formatUnits(getTotalAmountsResult?.[i]?.[0])
      const amt1 = ethers.utils.formatUnits(getTotalAmountsResult?.[i]?.[1])

      _data.values = [Big(amt1).times(shares).div(totalSupply).toFixed(), Big(amt0).times(shares).div(totalSupply).toFixed()]
      _data.yourValue = Big(Big(amt0).plus(amt1)).times(shares).div(totalSupply).toFixed()
    } catch (error) {
      console.error(error)
    }
    for (let i = 0; i < _dataList.length; i++) {
      // await getYourValue(_dataList[i])
    }
    formatedData("handleGetYourValue")
  }
  const handleGetTvl = async (_dataList: any) => {
    for (let i = 0; i < _dataList.length; i++) {
      getTvl(_dataList[i])
    }
    formatedData()
  }
  const getDataList = async () => {
    for (const pair of pairs) {
      const _data = {
        ...pair
      }
      dataList.push(_data);
    }
    try {
      await get7DayApr(dataList)
      await getBalance(dataList)
    } catch (error) {
      console.error(error);
    }

    handleGetYourValue(dataList)
    handleGetTvl(dataList)
    formatedData();
  };
  useEffect(() => {
    if (name !== 'AquaBera' || !sender || !provider) return;
    getDataList();
  }, [name, sender, provider, reloadCount]);

  return {
    reload: () => {
      setReloadCount(reloadCount + 1);
    }
  };
}
