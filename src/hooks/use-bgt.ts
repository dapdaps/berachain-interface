import { useEffect, useState } from 'react';

import { ethers } from 'ethers';
import useCustomAccount from './use-account';
import useInfraredList from '@/sections/staking/hooks/use-infrared-list';
import { asyncFetch } from '@/utils/http';
import useBendReward from '@/sections/Lending/Bend/hooks/useBendReward';
import useToast from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import useClickTracking from '@/hooks/use-click-tracking';


const BGT_ADDRESS = "0xbDa130737BDd9618301681329bF2e46A016ff9Ad"
const ABI = [{
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
}]
export type DataType = {
  count: number | string
}
export function useBGT() {
  const toast = useToast();
  const router = useRouter()
  const { handleReport } = useClickTracking();
  const { provider, account } = useCustomAccount()
  const [data, setData] = useState<DataType>({
    count: 0,

  })
  const [updater, setUpdater] = useState(0)
  const { loading, dataList } = useInfraredList(updater)
  const [sortDataIndex, setSortDataIndex] = useState("")

  const [pageData, setPageData] = useState<any>(null)
  // const filterList = useMemo(() => dataList?.filter((data: any) => Big(data?.earned ?? 0).gt(0)) ?? [], [dataList])
  const queryPageData = async function () {
    const result = await asyncFetch("https://bartio-pol-indexer.berachain.com/berachain/v1alpha1/beacon/homepage")
    if (result?.top3EmittingValidators?.validators) {
      result.top3EmittingValidators.validators.forEach((v: any) => {
        if (!v.validator?.metadata) return;
        switch (v.validator.metadata.name) {
          case 'Infrared':
            v.validator.metadata.bp = '1010-004-001';
            break;
          case 'Kodiak Finance':
            v.validator.metadata.bp = '1010-004-002';
            break;
          case 'The-Honey-Jar':
            v.validator.metadata.bp = '1010-004-003';
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

  const { rewardValue, depositAmount, icon, platform, vaultToken, claim, claiming } = useBendReward({
    provider, account
  })

  const filterList = [
    {
      id: vaultToken,
      images: [
        icon
      ],
      initialData: {
        pool: {
          protocol: platform
        }
      },
      depositAmount: depositAmount,
      earned: rewardValue,
      claim: claim,
      claiming: claiming
    }
  ];

  const queryData = async function () {
    const contract = new ethers.Contract(BGT_ADDRESS, ABI, provider?.getSigner())
    try {
      const balanceOfResult = await contract.balanceOf(account)
      setData((prev: DataType) => {
        return {
          ...prev,
          count: ethers.utils.formatUnits(balanceOfResult)
        }
      })
    } catch (error) {
      console.log('===error', error)
    }
  }

  const handleClaim = function (data: any) {

    const toastId = toast?.loading({
      title: `Claim...`
    });

    const abi = [{
      "constant": false,
      "inputs": [],
      "name": "getReward",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }]
    const contract = new ethers.Contract(data?.vaultAddress, abi, provider.getSigner())
    contract
      .getReward()
      .then((tx: any) => tx.wait())
      .then((receipt: any) => {
        toast?.dismiss(toastId);
        toast?.success({
          title: 'Claim Successfully!'
        });
        refresh()
      })
      .catch((error: Error) => {
        console.log('error: ', error);
        toast?.dismiss(toastId);
        toast?.fail({
          title: 'Claim Failed!',
          text: error?.message?.includes('user rejected transaction')
            ? 'User rejected transaction'
            : (error?.message ?? '')
        });
      });
  }

  const handleExplore = function () {
    // window.open("https://bartio.station.berachain.com/")
    router.push("/marketplace/invest?type=vaults")
    handleReport('1010-004-004');
  }

  const handleValidator = (data: any) => {
    handleReport(data?.validator?.metadata?.bp);
  };

  useEffect(() => {
    queryPageData()
  }, [])

  useEffect(() => {
    provider && account && queryData()
  }, [provider, account])

  return {
    data,
    queryData,
    loading,
    dataList,
    sortDataIndex,
    setSortDataIndex,
    pageData,
    queryPageData,
    filterList,
    handleClaim,
    handleExplore,
    handleValidator,
  }
}

interface Props {
  query(): any;
}
