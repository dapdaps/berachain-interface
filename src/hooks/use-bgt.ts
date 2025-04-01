import { useEffect, useState } from "react";

import { DEFAULT_CHAIN_ID } from "@/configs";
import multicallAddresses from "@/configs/contract/multicall";
import useClickTracking from "@/hooks/use-click-tracking";
import useIsMobile from "@/hooks/use-isMobile";
import useToast from "@/hooks/use-toast";
import useInfraredList from "@/sections/staking/hooks/use-infrared-list";
import { asyncFetch, post } from "@/utils/http";
import { multicall } from "@/utils/multicall";
import { numberFormatter } from "@/utils/number-formatter";
import Big from "big.js";
import { ethers } from "ethers";
import _ from "lodash";
import { useRouter } from "next/navigation";
import useCustomAccount from "./use-account";
import { useBgtStore } from "@/stores/bgt";

export const BGT_ADDRESS = "0x656b95E550C07a9ffe548bd4085c72418Ceb1dba";
export const ERC20_ABI = [
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "pure",
    type: "function"
  }
];
export const ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "token0",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "token1",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];
export const VAULT_ADDRESS_ABI = [
  {
    constant: false,
    inputs: [
      {
        name: "amount",
        type: "uint256"
      }
    ],
    name: "stake",
    outputs: [
      {
        name: "",
        type: "bool"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    type: "function",
    name: "withdraw",
    inputs: [
      {
        name: "_shareAmt",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      }
    ],
    "name": "getReward",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    type: "function",
    name: "earned",
    inputs: [
      {
        name: "account",
        type: "address",
        internalType: "address"
      }
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "view"
  }
];
export const BEARCHAIN_API = "https://api.berachain.com/"
export type DataType = {
  count: number | string;
  totalSupply?: any;
};
export function useBGT(tab?: string) {
  const store = useBgtStore()
  const isMobile = useIsMobile();
  const toast = useToast();
  const router = useRouter();
  const { handleReport } = useClickTracking();
  const { provider, account, chainId } = useCustomAccount();
  const [data, setData] = useState<DataType>({
    count: 0
  });
  const [yourVaults, setYourVaults] = useState<any>([]);
  const [vaults, setVaults] = useState<any>([])

  const [updater, setUpdater] = useState(0);
  const { loading, dataList } = useInfraredList(updater);

  const [isLoading, setIsLoading] = useState(false);

  const [vaultsLoading, setVaultsLoading] = useState(false)
  const [sortDataIndex, setSortDataIndex] = useState("");
  const [myVaults, setMyVaults] = useState<any>(null);

  const [pageData, setPageData] = useState<any>(null);

  const multicallAddress = multicallAddresses[DEFAULT_CHAIN_ID];

  const filterList = sortDataIndex
    ? // @ts-ignore
    _.cloneDeep(yourVaults).sort((prev, next) =>
      Big(next[sortDataIndex]).minus(prev[sortDataIndex]).toFixed()
    )
    : yourVaults;
  const queryPageData = async function () {
    const result = await asyncFetch(
      BEARCHAIN_API,
      {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({ "operationName": "GlobalData", "variables": { "chain": "BERACHAIN" }, "query": "query GlobalData($chain: GqlChain!) {\n  top3EmittingValidators: polGetValidators(\n    orderBy: bgtCapturePercentage\n    orderDirection: desc\n    first: 3\n  ) {\n    pagination {\n      currentPage\n      totalCount\n      __typename\n    }\n    validators {\n      ...ApiValidatorMinimal\n      __typename\n    }\n    __typename\n  }\n  polGetGlobalInfo(chain: $chain) {\n    totalActiveBoostAmount\n    totalValidatorsCount\n    totalWhitelistedRewardVaults\n    totalActiveRewardVaults\n    totalActiveIncentives\n    totalActiveIncentivesValueUSD\n    totalDistributedBGTAmount\n    totalStakedBeraAmount\n    annualizedBGTEmission\n    annualizedBGTInflation\n    __typename\n  }\n  allValidatorsCount: polGetValidators {\n    pagination {\n      totalCount\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment ApiValidatorMinimal on GqlValidator {\n  id\n  pubkey\n  operator\n  metadata {\n    name\n    logoURI\n    __typename\n  }\n  dynamicData {\n    activeBoostAmount\n    usersActiveBoostCount\n    queuedBoostAmount\n    usersQueuedBoostCount\n    allTimeDistributedBGTAmount\n    rewardRate\n    stakedBeraAmount\n    lastDayDistributedBGTAmount\n    activeBoostAmountRank\n    __typename\n  }\n  __typename\n}" })
      }
    );
    const top3EmittingValidators = result?.data?.top3EmittingValidators
    if (top3EmittingValidators?.validators) {
      top3EmittingValidators.validators.forEach((v: any) => {
        if (!v?.metadata) return;
        switch (v.metadata.name) {
          case "Infrared":
            v.metadata.bp = "1010-004-001";
            v.metadata.bpMobile = "1016-003";
            break;
          case "Kodiak Finance":
            v.metadata.bp = "1010-004-002";
            v.validator.metadata.bpMobile = "1016-004";
            break;
          case "The-Honey-Jar":
            v.metadata.bp = "1010-004-003";
            v.metadata.bpMobile = "1016-005";
            break;
          default:
            break;
        }
      });
    }
    setPageData(result?.data);
    store.set({
      totalCount: top3EmittingValidators?.pagination?.totalCount
    })
  };

  const refresh = function () {
    setUpdater(Date.now());
  };

  const queryData = async function () {
    const contract = new ethers.Contract(
      BGT_ADDRESS,
      ABI,
      provider?.getSigner()
    );
    try {
      const balanceOfResult = await contract.balanceOf(account);
      const totalSupplyResult = await contract.totalSupply();
      setData((prev: DataType) => {
        return {
          ...prev,
          count: ethers.utils.formatUnits(balanceOfResult),
          totalSupply: ethers.utils.formatUnits(totalSupplyResult)
        };
      });
    } catch (error) {
      console.error("error===", error);
    }
  };

  const setClaiming = function (index: any, claiming: any) {
    setYourVaults((prev: any) => {
      const curr: any = _.cloneDeep(prev);
      curr[index].claiming = claiming;
      return curr;
    });
  };
  const handleClaim = function (data: any, index: number) {
    console.log("---data", data);
    const toastId = toast?.loading({
      title: `Claim...`
    });

    setClaiming(index, true);
    const contract = new ethers.Contract(
      data?.vaultAddress,
      VAULT_ADDRESS_ABI,
      provider.getSigner()
    );
    contract
      .getReward(account, account)
      .then((tx: any) => tx.wait())
      .then((receipt: any) => {
        toast?.dismiss(toastId);
        toast?.success({
          title: "Claim Successful!"
        });
        setClaiming(index, false);
        refresh();
      })
      .catch((error: Error) => {
        console.log("error: ", error);
        toast?.dismiss(toastId);
        setClaiming(index, false);
        toast?.fail({
          title: "Claim Failed!",
          text: error?.message?.includes("user rejected transaction")
            ? "User rejected transaction"
            : error?.message ?? ""
        });
      });
  };

  const handleExplore = function () {
    // router.push("/marketplace/invest?type=vaults");
    handleReport("1010-004-004");
  };

  const handleValidator = (data: any) => {
    if (isMobile) {
      handleReport(data?.metadata?.bpMobile);
      return false;
    }
    handleReport(data?.metadata?.bp);
    router.push("/bgt/validator?id=" + data?.id);
  };

  const queryYourVaults = async () => {
    try {
      setIsLoading(true);
      const response = await post(
        BEARCHAIN_API,
        { "operationName": "GetUserVaults", "variables": { "userId": account, "chain": "BERACHAIN" }, "query": "query GetUserVaults($userId: String!, $chain: GqlChain!) {\n  userVaultDeposits: polGetUserVaultDeposits(userAddress: $userId, chain: $chain) {\n    pagination {\n      currentPage\n      totalCount\n      __typename\n    }\n    deposits {\n      amount\n      vaultAddress\n      vault {\n        ...ApiVault\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment ApiVault on GqlRewardVault {\n  id: vaultAddress\n  vaultAddress\n  address: vaultAddress\n  isVaultWhitelisted\n  dynamicData {\n    allTimeReceivedBGTAmount\n    apr\n    bgtCapturePercentage\n    activeIncentivesValueUsd\n    __typename\n  }\n  stakingToken {\n    address\n    name\n    symbol\n    decimals\n    __typename\n  }\n  metadata {\n    name\n    logoURI\n    url\n    protocolName\n    description\n    __typename\n  }\n  activeIncentives {\n    ...ApiVaultIncentive\n    __typename\n  }\n  __typename\n}\n\nfragment ApiVaultIncentive on GqlRewardVaultIncentive {\n  active\n  remainingAmount\n  remainingAmountUsd\n  incentiveRate\n  tokenAddress\n  token {\n    address\n    name\n    symbol\n    decimals\n    __typename\n  }\n  __typename\n}" }
      )
      const { deposits, pagination } = response?.data?.userVaultDeposits
      // const vaults = deposits;
      const depositedAmountCalls: any = [];
      const bgtRewardsCalls: any = [];
      deposits.forEach((deposit: any) => {
        depositedAmountCalls.push({
          address: deposit?.vaultAddress,
          name: "balanceOf",
          params: [account]
        });
        bgtRewardsCalls.push({
          address: deposit?.vaultAddress,
          name: "earned",
          params: [account]
        });
      });
      const depositedAmountResult = await multicall({
        abi: ABI,
        options: {},
        calls: depositedAmountCalls,
        multicallAddress,
        provider
      });
      const bgtRewardsResult = await multicall({
        abi: VAULT_ADDRESS_ABI,
        options: {},
        calls: bgtRewardsCalls,
        multicallAddress,
        provider
      });

      const _yourVaults = [];

      console.log('====depositedAmountResult====', depositedAmountResult)
      console.log('====bgtRewardsResult====', bgtRewardsResult)
      for (let i = 0; i < deposits.length; i++) {
        if (depositedAmountResult[i]) {
          _yourVaults.push({
            ...deposits[i],
            depositedAmount: ethers.utils.formatUnits(
              depositedAmountResult?.[i][0] ?? 0
            ),
            earned: bgtRewardsResult[i]
              ? ethers.utils.formatUnits(bgtRewardsResult?.[i][0] ?? 0)
              : 0,
            earnedShown: numberFormatter(
              bgtRewardsResult[i]
                ? ethers.utils.formatUnits(bgtRewardsResult?.[i][0] ?? 0)
                : 0,
              6,
              true
            ),
            claim: handleClaim
          });
        }
      }
      setIsLoading(false);
      setYourVaults(_yourVaults);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const queryVaults = async () => {
    try {
      setVaultsLoading(true)
      const response = await post(
        BEARCHAIN_API,
        {
          "operationName": "GetVaults",
          "variables": { "skip": 0, "pageSize": 10, "where": { "includeNonWhitelisted": false } },
          "query": "query GetVaults($where: GqlRewardVaultFilter, $pageSize: Int, $skip: Int, $orderBy: GqlRewardVaultOrderBy = bgtCapturePercentage, $orderDirection: GqlRewardVaultOrderDirection = desc, $search: String) {\n  polGetRewardVaults(\n    where: $where\n    first: $pageSize\n    skip: $skip\n    orderBy: $orderBy\n    orderDirection: $orderDirection\n    search: $search\n  ) {\n    pagination {\n      currentPage\n      totalCount\n      __typename\n    }\n    vaults {\n      ...ApiVault\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment ApiVault on GqlRewardVault {\n  id: vaultAddress\n  vaultAddress\n  address: vaultAddress\n  isVaultWhitelisted\n  dynamicData {\n    allTimeReceivedBGTAmount\n    apr\n    bgtCapturePercentage\n    activeIncentivesValueUsd\n    __typename\n  }\n  stakingToken {\n    address\n    name\n    symbol\n    decimals\n    __typename\n  }\n  metadata {\n    name\n    logoURI\n    url\n    protocolName\n    description\n    __typename\n  }\n  activeIncentives {\n    ...ApiVaultIncentive\n    __typename\n  }\n  __typename\n}\n\nfragment ApiVaultIncentive on GqlRewardVaultIncentive {\n  active\n  remainingAmount\n  remainingAmountUsd\n  incentiveRate\n  tokenAddress\n  token {\n    address\n    name\n    symbol\n    decimals\n    __typename\n  }\n  __typename\n}"
        }
      )
      console.log('====response', response)
      setVaults(response?.data?.polGetRewardVaults?.vaults ?? [])
      setVaultsLoading(false)
    } catch (error) {
      console.error(error)
      setVaultsLoading(false)
    }
  }

  useEffect(() => {
    queryPageData();
    queryVaults()
  }, []);

  useEffect(() => {
    if (tab === "your" && account) {
      queryYourVaults();
    }
  }, [tab, account, updater]);

  useEffect(() => {
    provider && account && queryData();
  }, [provider, account]);

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
    vaults,
    vaultsLoading,
    handleClaim,
    handleExplore,
    handleValidator
  };
}

interface Props {
  query(): any;
}
