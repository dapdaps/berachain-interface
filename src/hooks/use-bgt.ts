import { useEffect, useState } from 'react';

import { ethers } from 'ethers';
import useCustomAccount from './use-account';


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
  const { provider, account } = useCustomAccount()
  const [data, setData] = useState<DataType>({
    count: 0,

  })

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

  useEffect(() => {
    provider && account && queryData()
  }, [provider, account])
  return {
    data,
    queryData
  }
}

interface Props {
  query(): any;
}
