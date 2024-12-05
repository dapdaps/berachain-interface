import { useEffect, useMemo, useState } from 'react';

import multicallAddresses from '@/configs/contract/multicall';
import useClickTracking from '@/hooks/use-click-tracking';
import useIsMobile from '@/hooks/use-isMobile';
import useToast from '@/hooks/use-toast';
import useInfraredList from '@/sections/staking/hooks/use-infrared-list';
import { asyncFetch } from '@/utils/http';
import { multicall } from '@/utils/multicall';
import Big from 'big.js';
import { ethers } from 'ethers';
import _ from 'lodash';
import { useRouter } from 'next/navigation';
import useCustomAccount from './use-account';
import { numberFormatter } from '@/utils/number-formatter';


export const BGT_ADDRESS = "0xbDa130737BDd9618301681329bF2e46A016ff9Ad"
export const ERC20_ABI = [{
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
}]
export const ABI = [{
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
}, {
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
}, {
  "inputs": [],
  "name": "token0",
  "outputs": [
    {
      "internalType": "contract IERC20",
      "name": "",
      "type": "address"
    }
  ],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "token1",
  "outputs": [
    {
      "internalType": "contract IERC20",
      "name": "",
      "type": "address"
    }
  ],
  "stateMutability": "view",
  "type": "function"
}]
export const VAULT_ADDRESS_ABI = [
  {
    "constant": false,
    "inputs": [
      {
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "stake",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "type": "function",
    "name": "withdraw",
    "inputs": [
      {
        "name": "_shareAmt",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "inputs": [
      {
        "name": "game",
        "type": "address"
      }
    ],
    "name": "getReward",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "type": "function",
    "name": "earned",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  }
]
export type DataType = {
  count: number | string;
  totalSupply?: any;
}
export function useBGT(tab?: string) {
  const isMobile = useIsMobile();
  const toast = useToast();
  const router = useRouter()
  const { handleReport } = useClickTracking();
  const { provider, account, chainId } = useCustomAccount()
  const [data, setData] = useState<DataType>({
    count: 0,
  })
  const [yourVaults, setYourVaults] = useState([])

  const [updater, setUpdater] = useState(0)
  const { loading, dataList } = useInfraredList(updater)

  const [isLoading, setIsLoading] = useState(false)
  const [sortDataIndex, setSortDataIndex] = useState("")
  const [myVaults, setMyVaults] = useState<any>(null)

  const [pageData, setPageData] = useState<any>(null)

  const multicallAddress = multicallAddresses[chainId];

  const filterList = useMemo(() => {
    return sortDataIndex
      ? _.cloneDeep(yourVaults).sort((prev, next) =>
        Big(next[sortDataIndex]).minus(prev[sortDataIndex]).toFixed()
      )
      : yourVaults
  })
  const queryPageData = async function () {
    const result = await asyncFetch("https://bartio-pol-indexer.berachain.com/berachain/v1alpha1/beacon/homepage")
    if (result?.top3EmittingValidators?.validators) {
      result.top3EmittingValidators.validators.forEach((v: any) => {
        if (!v.validator?.metadata) return;
        switch (v.validator.metadata.name) {
          case 'Infrared':
            v.validator.metadata.bp = '1010-004-001';
            v.validator.metadata.bpMobile = '1016-003';
            break;
          case 'Kodiak Finance':
            v.validator.metadata.bp = '1010-004-002';
            v.validator.metadata.bpMobile = '1016-004';
            break;
          case 'The-Honey-Jar':
            v.validator.metadata.bp = '1010-004-003';
            v.validator.metadata.bpMobile = '1016-005';
            break;
          default:
            break;
        }
      });
    }
    setPageData(result)
  }

  const refresh = function () {
    setUpdater(Date.now())
  }

  const queryData = async function () {
    const contract = new ethers.Contract(BGT_ADDRESS, ABI, provider?.getSigner())
    try {
      const balanceOfResult = await contract.balanceOf(account)
      const totalSupplyResult = await contract.totalSupply()

      console.log('===totalSupplyResult', totalSupplyResult)
      setData((prev: DataType) => {
        return {
          ...prev,
          count: ethers.utils.formatUnits(balanceOfResult),
          totalSupply: ethers.utils.formatUnits(totalSupplyResult)
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  const setClaiming = function (index, claiming) {
    setYourVaults(prev => {
      const curr = _.cloneDeep(prev)
      curr[index].claiming = claiming
      return curr
    })
  }
  const handleClaim = function (data: any, index: number) {

    console.log('---data', data)
    const toastId = toast?.loading({
      title: `Claim...`
    });

    setClaiming(index, true)

    const contract = new ethers.Contract(data?.vaultAddress, VAULT_ADDRESS_ABI, provider.getSigner())
    contract
      .getReward(account)
      .then((tx: any) => tx.wait())
      .then((receipt: any) => {
        toast?.dismiss(toastId);
        toast?.success({
          title: 'Claim Successfully!'
        });
        setClaiming(index, false)
        refresh()
      })
      .catch((error: Error) => {
        console.log('error: ', error);
        toast?.dismiss(toastId);
        setClaiming(index, false)
        toast?.fail({
          title: 'Claim Failed!',
          text: error?.message?.includes('user rejected transaction')
            ? 'User rejected transaction'
            : (error?.message ?? '')
        });
      });
  }

  const handleExplore = function () {
    router.push("/marketplace/invest?type=vaults")
    handleReport('1010-004-004');
  }

  const handleValidator = (data: any) => {
    if (isMobile) {
      handleReport(data?.validator?.metadata?.bpMobile);
      return false;
    }
    handleReport(data?.validator?.metadata?.bp);
    router.push("/bgt/validator?address=" + data?.validator?.id);
  };

  const queryYourVaults = async () => {
    try {
      setIsLoading(true)
      const response = await asyncFetch("https://bartio-pol-indexer.berachain.com/berachain/v1alpha1/beacon/user/" + account + "/vaults")
      const vaults = response?.userVaults
      const depositedAmountCalls = []
      const bgtRewardsCalls = []
      vaults.forEach(valut => {
        depositedAmountCalls.push({
          address: valut?.vaultAddress,
          name: 'balanceOf',
          params: [account]
        })
        bgtRewardsCalls.push({
          address: valut?.vaultAddress,
          name: 'earned',
          params: [account]
        })
      })
      const depositedAmountResult = await multicall({
        abi: ABI,
        options: {},
        calls: depositedAmountCalls,
        multicallAddress,
        provider
      })
      const bgtRewardsResult = await multicall({
        abi: VAULT_ADDRESS_ABI,
        options: {},
        calls: bgtRewardsCalls,
        multicallAddress,
        provider
      })

      const _yourVaults = []
      for (let i = 0; i < vaults.length; i++) {
        if (depositedAmountResult[i]) {
          _yourVaults.push({
            ...vaults[i],
            depositedAmount: ethers.utils.formatUnits(depositedAmountResult?.[i][0] ?? 0),
            earned: bgtRewardsResult[i] ? ethers.utils.formatUnits(bgtRewardsResult?.[i][0] ?? 0) : 0,
            earnedShown: numberFormatter(bgtRewardsResult[i] ? ethers.utils.formatUnits(bgtRewardsResult?.[i][0] ?? 0) : 0, 6, true),
            claim: handleClaim
          })
        }
      }
      setIsLoading(false)
      setYourVaults(_yourVaults)
    } catch (error) {
      console.error(error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    queryPageData()
  }, [])

  useEffect(() => {
    if (tab === "your" && account) {
      queryYourVaults()
    }
  }, [tab, account, updater])

  useEffect(() => {
    provider && account && queryData()
  }, [provider, account])

  return {
    data,
    queryData,
    loading,
    isLoading,
    dataList,
    filterList,
    sortDataIndex,
    setSortDataIndex,
    pageData,
    queryPageData,
    handleClaim,
    handleExplore,
    handleValidator,

  }
}

interface Props {
  query(): any;
}
