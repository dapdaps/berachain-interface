import { asyncFetch, post } from '@/utils/http';
import { useState } from 'react';
import { BEARCHAIN_API } from './use-bgt';

export default function () {

  const [loading, setLoading] = useState(false)
  const [pageData, setPageData] = useState(null)
  const getPageData = async (validatorId: string) => {

    console.log('=====validatorId=====', validatorId)
    setLoading(true)
    try {
      const response = await post(
        BEARCHAIN_API,
        {
          "operationName": "GetValidator",
          "variables": { "id": validatorId, "chain": "BERACHAIN" },
          "query": "query GetValidator($id: String!, $chain: GqlChain!) {\n  validator: polGetValidator(validatorId: $id, chain: $chain) {\n    ...ApiValidator\n    __typename\n  }\n  uptime: polGetValidatorBlockUptimes(validatorId: $id, chain: $chain) {\n    ...ApiValidatorBlockUptime\n    __typename\n  }\n}\n\nfragment ApiValidator on GqlValidator {\n  ...ApiValidatorMinimal\n  operator\n  rewardAllocationWeights {\n    ...ApiRewardAllocationWeight\n    __typename\n  }\n  lastBlockUptime {\n    isActive\n    __typename\n  }\n  metadata {\n    name\n    logoURI\n    website\n    description\n    __typename\n  }\n  __typename\n}\n\nfragment ApiValidatorMinimal on GqlValidator {\n  id\n  pubkey\n  operator\n  metadata {\n    name\n    logoURI\n    __typename\n  }\n  dynamicData {\n    activeBoostAmount\n    usersActiveBoostCount\n    queuedBoostAmount\n    usersQueuedBoostCount\n    allTimeDistributedBGTAmount\n    rewardRate\n    stakedBeraAmount\n    lastDayDistributedBGTAmount\n    activeBoostAmountRank\n    __typename\n  }\n  __typename\n}\n\nfragment ApiRewardAllocationWeight on GqlValidatorRewardAllocationWeight {\n  percentageNumerator\n  validatorId\n  receivingVault {\n    ...ApiVault\n    __typename\n  }\n  receiver\n  startBlock\n  __typename\n}\n\nfragment ApiVault on GqlRewardVault {\n  id: vaultAddress\n  vaultAddress\n  address: vaultAddress\n  isVaultWhitelisted\n  dynamicData {\n    allTimeReceivedBGTAmount\n    apr\n    bgtCapturePercentage\n    activeIncentivesValueUsd\n    __typename\n  }\n  stakingToken {\n    address\n    name\n    symbol\n    decimals\n    __typename\n  }\n  metadata {\n    name\n    logoURI\n    url\n    protocolName\n    description\n    __typename\n  }\n  activeIncentives {\n    ...ApiVaultIncentive\n    __typename\n  }\n  __typename\n}\n\nfragment ApiVaultIncentive on GqlRewardVaultIncentive {\n  active\n  remainingAmount\n  remainingAmountUsd\n  incentiveRate\n  tokenAddress\n  token {\n    address\n    name\n    symbol\n    decimals\n    __typename\n  }\n  __typename\n}\n\nfragment ApiValidatorBlockUptime on GqlValidatorBlockUptime {\n  isActive\n  isProposer\n  isSigner\n  status\n  blockNumber\n  __typename\n}"
        }
      )

      setLoading(false)
      setPageData(response?.data?.validator)
    } catch (error) {
      setLoading(false)
      setPageData(null)
      console.error(error)
    }
  }
  return {
    loading,
    pageData,
    getPageData,
  }
}