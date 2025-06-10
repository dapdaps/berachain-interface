import { beraB } from "@/configs/tokens/bera-bArtio";
import { getDappLogo } from '@/sections/dashboard/utils';

export default {
  name: "BeraPaw",
  icon: getDappLogo("BeraPaw"),
  path: "/staking/berapaw",
  chains: {
    80094: {
      vaults: {
        host: "https://api.berachain.com/",
        query: (params: any) => {
          const orderBy = params.orderBy || "apr";
          const orderDirection = params.orderDirection || "desc";
          const pageSize = params.pageSize || 10;
          const skip = params.skip || 0;
          const search = params.search || "";
          return {
            operationName: "GetVaults",
            variables: {
              orderBy,
              orderDirection,
              pageSize,
              skip,
              search,
              where: {
                includeNonWhitelisted: false,
              },
            },
            query: "\n              query GetVaults($where: GqlRewardVaultFilter, $pageSize: Int, $skip: Int, $orderBy: GqlRewardVaultOrderBy = bgtCapturePercentage, $orderDirection: GqlRewardVaultOrderDirection = desc, $search: String) {\n                polGetRewardVaults(\n                  where: $where\n                  first: $pageSize\n                  skip: $skip\n                  orderBy: $orderBy\n                  orderDirection: $orderDirection\n                  search: $search\n                ) {\n                  pagination {\n                    currentPage\n                    totalCount\n                    __typename\n                  }\n                  vaults {\n                    ...ApiVault\n                    __typename\n                  }\n                  __typename\n                }\n              }\n\n              fragment ApiVault on GqlRewardVault {\n                id: vaultAddress\n                vaultAddress\n                address: vaultAddress\n                isVaultWhitelisted\n                dynamicData {\n                  allTimeReceivedBGTAmount\n                  apr\n                  tvl\n                  bgtCapturePercentage\n                  activeIncentivesValueUsd\n                  activeIncentivesRateUsd\n                  __typename\n                }\n                stakingToken {\n                  address\n                  name\n                  symbol\n                  decimals\n                  __typename\n                }\n                metadata {\n                  name\n                  logoURI\n                  url\n                  protocolName\n                  description\n                  __typename\n                }\n                activeIncentives {\n                  ...ApiVaultIncentive\n                  __typename\n                }\n                __typename\n              }\n\n              fragment ApiVaultIncentive on GqlRewardVaultIncentive {\n                active\n                remainingAmount\n                remainingAmountUsd\n                incentiveRate\n                tokenAddress\n                token {\n                  address\n                  name\n                  symbol\n                  decimals\n                  __typename\n                }\n                __typename\n              }\n            "
          };
        },
        queryTokenUrl: (params: { address: string; }) => `https://api.enso.finance/api/v1/tokens?address=${params.address}&chainId=80094&includeMetadata=true&page=1`,
      },
    }
  }
};
