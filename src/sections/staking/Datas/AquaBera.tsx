


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
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
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
    onLoad({ dataList });
  };

  const get7DayApr = async (_dataList) => {
    const response = await asyncFetch("https://app.aquabera.com/api/80094")
    const vaults = response?.vaults ?? [] //response?.data?.listMonitorVaults?.items ?? []
    for (let i = 0; i < _dataList?.length; i++) {
      const _data = _dataList[i]
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
        address: _data?.tokens?.[0]?.address,
        name: "balanceOf",
        params: [sender]
      })
    })
    try {
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
    } catch (error) {
      throw Error(error)
    }

  }
  const getDecimals = async (address: any) => {
    const contract = new ethers.Contract(address, ERC20_ABI, provider)
    return await contract.decimals()
  }
  const getSymbol = async (address: any) => {
    const contract = new ethers.Contract(address, ERC20_ABI, provider)
    return await contract.symbol()
  }
  const handleGetYourValue = async (_dataList: any) => {
    const balanceOfCalls = [
    ]
    const getTotalAmountsCalls = [
    ]
    const totalSupplyCalls = [
    ]
    for (let i = 0; i < _dataList.length; i++) {
      const _data = _dataList[i]
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
    }
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
      for (let i = 0; i < _dataList.length; i++) {
        const totalSupply = ethers.utils.formatUnits(totalSupplyResult?.[i]?.[0])
        const shares = ethers.utils.formatUnits(balanceOfResult?.[i]?.[0] ?? 0)
        // const [token0, token1] = _dataList[i].tokens
        const [token0, token1] = _dataList[i].chainTopTokens
        const amt0 = ethers.utils.formatUnits(getTotalAmountsResult?.[i]?.[0], token0?.decimals)
        const amt1 = ethers.utils.formatUnits(getTotalAmountsResult?.[i]?.[1], token1?.decimals)
        const value0 = Big(amt0).times(shares).div(totalSupply).toFixed()
        const value1 = Big(amt1).times(shares).div(totalSupply).toFixed()

        _dataList[i].values = token0?.symbol === _dataList?.[i]?.symbol ? [value0, value1] : [value1, value0]
        _dataList[i].yourValue = Big(amt0).plus(amt1).times(shares).div(totalSupply).toFixed()
        _dataList[i].usdDepositAmount = Big(value0).times(prices?.[token0?.symbol] ?? 0).plus(Big(value1).times(prices?.[token1?.symbol] ?? 0)).toFixed()
      }

    } catch (error) {
      console.error(error)
    }
    formatedData("handleGetYourValue")
  }
  const handleGetTvl = async (_dataList: any) => {
    const calls = [

    ]
    _dataList?.forEach(_data => {
      calls.push({
        address: _data?.ichiAddress,
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
      for (let i = 0; i < _dataList?.length; i++) {
        const _data = _dataList[i];
        const [amount0, amount1] = result?.[i]
        const [token0, token1] = _dataList[i].chainTopTokens
        _dataList[i].tvl = Big(ethers.utils.formatUnits(amount0, token0?.decimals)).times(prices?.[token0?.symbol] ?? 0).plus(Big(ethers.utils.formatUnits(amount1, token1?.decimals)).times(prices?.[token1?.symbol] ?? 0)).toFixed()
      }
    } catch (error) {
      console.error(error)
    }
    formatedData("handleGetTvl")
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
    if (name !== 'AquaBera' || !sender || !provider || !prices) return;
    getDataList();
  }, [name, sender, provider, reloadCount, prices]);

  return {
    reload: () => {
      setReloadCount(reloadCount + 1);
    }
  };
}
