import { DEFAULT_CHAIN_ID } from '@/configs';
import multicallAddresses from '@/configs/contract/multicall';
import useCustomAccount from '@/hooks/use-account';
import { BGT_ABI } from '@/sections/bgt/abi';
import { BGT_ADDRESS, VALIDATORS } from '@/sections/bgt/config';
import { multicall } from '@/utils/multicall';
import Big from 'big.js';
import { ethers } from 'ethers';
import { useState } from 'react';
export type QueueType = ValidatorType | { balance: string; blockNumberLast: any }

const multicallAddress = multicallAddresses[DEFAULT_CHAIN_ID];
export default function () {

  const {
    provider, account
  } = useCustomAccount()
  const [delegationQueue, setDelegationQueue] = useState<null | QueueType[]>(null)
  const [loading, setLoading] = useState(false)

  const getDelegationQueue = async () => {
    setLoading(true)
    const calls = []
    VALIDATORS.forEach(_validator => {
      calls.push({
        address: BGT_ADDRESS,
        name: 'boostedQueue',
        params: [account, _validator?.address]
      })
    })
    console.log('=====11111=====')
    try {
      const blockNumber = await provider.getBlockNumber();
      const response = await multicall({
        abi: BGT_ABI,
        options: {},
        calls,
        multicallAddress,
        provider
      })
      console.log('===response', response)
      const _delegationQueue = []
      for (let i = 0; i < response.length; i++) {
        const boostedQueue = response[i];

        console.log('===boostedQueue', boostedQueue)
        if (boostedQueue) {
          const difference = Big(blockNumber).minus(boostedQueue[0])
          const balance = ethers.utils.formatUnits(boostedQueue[1])
          if (Big(balance).gt(0)) {
            _delegationQueue.push({
              ...VALIDATORS[i],
              balance,
              blockNumberLast: boostedQueue[0],
              canConfirm: Big(difference).gt(8191),
              remainingBlockNumber: Big(8191).minus(difference).toFixed(),
              remainingPercentage: Big(difference).div(8191).times(100).toFixed() + '%'
            })
          }
        }
      }
      setDelegationQueue(_delegationQueue)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error(error)
    }
  }

  return {
    loading,
    delegationQueue,
    getDelegationQueue,
  }
}