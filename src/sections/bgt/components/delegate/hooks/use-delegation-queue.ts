import { DEFAULT_CHAIN_ID } from '@/configs';
import multicallAddresses from '@/configs/contract/multicall';
import useCustomAccount from '@/hooks/use-account';
import { BEARCHAIN_API } from '@/hooks/use-bgt';
import { BGT_ABI } from '@/sections/bgt/abi';
import { BGT_ADDRESS } from '@/sections/bgt/config';
import { ValidatorType } from '@/sections/bgt/types';
import { post } from '@/utils/http';
import { multicall } from '@/utils/multicall';
import Big from 'big.js';
import { ethers } from 'ethers';
import { useState } from 'react';
export type QueueType = ValidatorType | { balance: string; blockNumberLast: any }

const multicallAddress = multicallAddresses[DEFAULT_CHAIN_ID];
export default function useDelegationQueue() {
  const {
    provider, account
  } = useCustomAccount()

  const [delegationQueue, setDelegationQueue] = useState<null | QueueType[]>(null)
  const [loading, setLoading] = useState(false)


  async function getUserValidators() {
    try {
      // setLoading(true)
      const firstResponse = await post("https://api.goldsky.com/api/public/project_clq1h5ct0g4a201x18tfte5iv/subgraphs/pol-subgraph/mainnet-v1.1.0/gn", {
        "operationName": "GetUserValidatorInformation",
        "variables": { "address": account },
        "query": "query GetUserValidatorInformation($address: Bytes!, $block: Block_height) {\n  userValidatorInformations: userBoosts(\n    block: $block\n    where: {user: $address}\n    first: 1000\n  ) {\n    id\n    queuedBoostAmount\n    activeBoostAmount\n    queuedDropBoostAmount\n    queuedDropBoostStartBlock\n    queuedBoostStartBlock\n    user\n    validator {\n      ...ValidatorMinimal\n      __typename\n    }\n    __typename\n  }\n  _meta {\n    ...SubgraphStatusMeta\n    __typename\n  }\n}\n\nfragment ValidatorMinimal on Validator {\n  id\n  publicKey\n  activeBoostAmount: activeBoostAmount\n  __typename\n}\n\nfragment SubgraphStatusMeta on _Meta_ {\n  block {\n    timestamp\n    __typename\n  }\n  hasIndexingErrors\n  __typename\n}"
      })
      const idIn = firstResponse?.data?.userValidatorInformations?.map((userValidatorInfor) => userValidatorInfor?.validator?.id)
      const secondResponse = await post(BEARCHAIN_API, {
        "operationName": "GetValidators",
        "variables": { "sortBy": "lastDayDistributedBGTAmount", "sortOrder": "desc", "chain": "BERACHAIN", "where": { idIn } },
        "query": "query GetValidators($where: GqlValidatorFilter, $sortBy: GqlValidatorOrderBy = lastDayDistributedBGTAmount, $sortOrder: GqlValidatorOrderDirection = desc, $pageSize: Int, $skip: Int, $search: String, $chain: GqlChain) {\n  validators: polGetValidators(\n    where: $where\n    orderBy: $sortBy\n    orderDirection: $sortOrder\n    first: $pageSize\n    skip: $skip\n    search: $search\n    chain: $chain\n  ) {\n    pagination {\n      currentPage\n      totalCount\n      totalPages\n      pageSize\n      __typename\n    }\n    validators {\n      ...ApiValidator\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment ApiValidator on GqlValidator {\n  ...ApiValidatorMinimal\n  operator\n  rewardAllocationWeights {\n    ...ApiRewardAllocationWeight\n    __typename\n  }\n  lastBlockUptime {\n    isActive\n    __typename\n  }\n  metadata {\n    name\n    logoURI\n    website\n    description\n    __typename\n  }\n  __typename\n}\n\nfragment ApiValidatorMinimal on GqlValidator {\n  id\n  pubkey\n  operator\n  metadata {\n    name\n    logoURI\n    __typename\n  }\n  dynamicData {\n    activeBoostAmount\n    usersActiveBoostCount\n    queuedBoostAmount\n    usersQueuedBoostCount\n    allTimeDistributedBGTAmount\n    rewardRate\n    stakedBeraAmount\n    lastDayDistributedBGTAmount\n    activeBoostAmountRank\n    boostApr\n    commissionOnIncentives\n    __typename\n  }\n  __typename\n}\n\nfragment ApiRewardAllocationWeight on GqlValidatorRewardAllocationWeight {\n  percentageNumerator\n  validatorId\n  receivingVault {\n    ...ApiVault\n    __typename\n  }\n  receiver\n  startBlock\n  __typename\n}\n\nfragment ApiVault on GqlRewardVault {\n  id: vaultAddress\n  vaultAddress\n  address: vaultAddress\n  isVaultWhitelisted\n  dynamicData {\n    allTimeReceivedBGTAmount\n    apr\n    bgtCapturePercentage\n    activeIncentivesValueUsd\n    activeIncentivesRateUsd\n    __typename\n  }\n  stakingToken {\n    address\n    name\n    symbol\n    decimals\n    __typename\n  }\n  metadata {\n    name\n    logoURI\n    url\n    protocolName\n    description\n    __typename\n  }\n  activeIncentives {\n    ...ApiVaultIncentive\n    __typename\n  }\n  __typename\n}\n\nfragment ApiVaultIncentive on GqlRewardVaultIncentive {\n  active\n  remainingAmount\n  remainingAmountUsd\n  incentiveRate\n  tokenAddress\n  token {\n    address\n    name\n    symbol\n    decimals\n    __typename\n  }\n  __typename\n}"
      })
      const validators = firstResponse?.data?.userValidatorInformations?.map(userValidatorInfor => {
        const validator = secondResponse?.data?.validators?.validators?.find((validator) => validator?.id === userValidatorInfor?.validator?.id) ?? null
        return {
          ...userValidatorInfor,
          ...validator,
        }
      })
      return validators
    } catch (error) {
      console.error(error)
      return []
    }
  }
  const getDelegationQueue = async () => {
    setLoading(true)
    const calls: any = []
    const validators = await getUserValidators()

    if (validators?.length > 0) {
      validators?.forEach(_validator => {
        calls.push({
          address: BGT_ADDRESS,
          name: 'boostedQueue',
          params: [account, _validator?.pubkey]
        })
      })
      try {
        const blockNumber = await provider.getBlockNumber();
        const response = await multicall({
          abi: BGT_ABI,
          options: {},
          calls,
          multicallAddress,
          provider
        })
        const _delegationQueue = []
        for (let i = 0; i < response.length; i++) {
          const boostedQueue = response[i];

          if (boostedQueue) {
            const difference = Big(blockNumber).minus(boostedQueue[0])
            const balance = ethers.utils.formatUnits(boostedQueue[1])
            if (Big(balance).gt(0)) {
              _delegationQueue.push({
                ...validators[i],
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
      } catch (error) {
        console.error(error)
      }
    }
    setLoading(false)
  }
  return {
    loading,
    delegationQueue,
    getDelegationQueue,
  }
}