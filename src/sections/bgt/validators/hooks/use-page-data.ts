import { BEARCHAIN_API } from "@/hooks/use-bgt"
import { post } from "@/utils/http"
import { useEffect, useState } from "react"

export default function usePageData() {
  const [loading, setLoading] = useState(false)
  const [pageData, setPageData] = useState()

  async function handleQueryPageData() {
    try {
      const response = await post(BEARCHAIN_API, {
        "operationName": "GlobalData",
        "variables": { "chain": "BERACHAIN" },
        "query": "query GlobalData($chain: GqlChain!) {\n  top3EmittingValidators: polGetValidators(\n    orderBy: bgtCapturePercentage\n    orderDirection: desc\n    first: 3\n  ) {\n    pagination {\n      currentPage\n      totalCount\n      __typename\n    }\n    validators {\n      ...ApiValidatorMinimal\n      __typename\n    }\n    __typename\n  }\n  polGetGlobalInfo(chain: $chain) {\n    totalActiveBoostAmount\n    totalValidatorsCount\n    totalWhitelistedRewardVaults\n    totalActiveRewardVaults\n    totalActiveIncentives\n    totalActiveIncentivesValueUSD\n    totalDistributedBGTAmount\n    totalStakedBeraAmount\n    annualizedBGTEmission\n    annualizedBGTInflation\n    __typename\n  }\n  allValidatorsCount: polGetValidators {\n    pagination {\n      totalCount\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment ApiValidatorMinimal on GqlValidator {\n  id\n  pubkey\n  operator\n  metadata {\n    name\n    logoURI\n    __typename\n  }\n  dynamicData {\n    activeBoostAmount\n    usersActiveBoostCount\n    queuedBoostAmount\n    usersQueuedBoostCount\n    allTimeDistributedBGTAmount\n    rewardRate\n    stakedBeraAmount\n    lastDayDistributedBGTAmount\n    activeBoostAmountRank\n    boostApr\n    commissionOnIncentives\n    __typename\n  }\n  __typename\n}"
      })
      console.log('====response', response)
    } catch (error) {
      console.error(error)
    }

  }
  useEffect(() => {
    handleQueryPageData()
  }, [])
  return {
    loading,
    pageData
  }
}