import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import useCustomAccount from './use-account';

const IBGT_ADDRESS = "0x46efc86f0d7455f135cc9df501673739d513e982"

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
}]

export type DataType = {
  count: number | string;
  total: number | string;
  staked: number | string;
}
export function useIBGT() {

  const { provider, account } = useCustomAccount()

  const [data, setData] = useState<DataType>({
    count: 0,
    total: 0,
    staked: 0,
  })

  const queryData = async function () {
    const contract = new ethers.Contract(IBGT_ADDRESS, ABI, provider?.getSigner())
    try {
      const balanceOfResult = await contract?.balanceOf(account)
      const totalSupplyResult = await contract?.totalSupply()
      const stakedBalanceOfResult = await contract?.balanceOf("0x4B95296B937AF613D65206Ba7C203CB9A1263003")
      setData((prev: DataType) => {
        return {
          ...prev,
          count: ethers.utils.formatUnits(balanceOfResult),
          total: ethers.utils.formatUnits(totalSupplyResult),
          staked: ethers.utils.formatUnits(stakedBalanceOfResult)
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
