import { useState, useEffect } from 'react';
import { get, post } from '@/utils/http';

interface VaultListParams {
  page?: number;
  sortBy?: 'activeIncentivesInHoney' | 'bgtInflationCapture';
  sortOrder?: 'asc' | 'desc';
  filterByProduct?: string;
  query?: string;
}

interface Validator {
  logoURI: string;
}

interface Incentive {
  token: {
    symbol: string;
  };
}

interface VaultItem {
  name: string;
  product: string;
  metadata: {
    logoURI: string;
  };
  productMetadata: {
    logoURI: string;
  };
  activeIncentivesInHoney: number;
  bgtInflationCapture: number;
  activeValidators: Validator[];
  activeIncentives: Incentive[];
}

export const useVaultList = (initialParams?: VaultListParams) => {
  const [data, setData] = useState<VaultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const pageSize = 10
  const [params, setParams] = useState<VaultListParams>({
    page: 1,
    sortBy: '',
    sortOrder: '',
    filterByProduct: '',
    query: '',
    ...initialParams,
  });
  const [maxPage, setMaxPage] = useState(1);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await post(
        `https://api.berachain.com/`,
        {
          "operationName": "GetVaults",
          "variables": {
            "orderBy": params?.sortBy,
            "orderDirection": params?.sortOrder,
            "pageSize": pageSize, "skip": pageSize * (params?.page - 1),
            "where": { "includeNonWhitelisted": false }
          },
          "query": "query GetVaults($where: GqlRewardVaultFilter, $pageSize: Int, $skip: Int, $orderBy: GqlRewardVaultOrderBy = bgtCapturePercentage, $orderDirection: GqlRewardVaultOrderDirection = desc, $search: String) {\n  polGetRewardVaults(\n    where: $where\n    first: $pageSize\n    skip: $skip\n    orderBy: $orderBy\n    orderDirection: $orderDirection\n    search: $search\n  ) {\n    pagination {\n      currentPage\n      totalCount\n      __typename\n    }\n    vaults {\n      ...ApiVault\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment ApiVault on GqlRewardVault {\n  id: vaultAddress\n  vaultAddress\n  address: vaultAddress\n  isVaultWhitelisted\n  dynamicData {\n    allTimeReceivedBGTAmount\n    apr\n    bgtCapturePercentage\n    activeIncentivesValueUsd\n    __typename\n  }\n  stakingToken {\n    address\n    name\n    symbol\n    decimals\n    __typename\n  }\n  metadata {\n    name\n    logoURI\n    url\n    protocolName\n    description\n    __typename\n  }\n  activeIncentives {\n    ...ApiVaultIncentive\n    __typename\n  }\n  __typename\n}\n\nfragment ApiVaultIncentive on GqlRewardVaultIncentive {\n  active\n  remainingAmount\n  remainingAmountUsd\n  incentiveRate\n  tokenAddress\n  token {\n    address\n    name\n    symbol\n    decimals\n    __typename\n  }\n  __typename\n}"
        }
      );
      const { vaults, pagination } = response?.data?.polGetRewardVaults
      if (params.add) {
        setData([...data, ...(vaults || [])])
      } else {
        setData(vaults || []);
      }
      setMaxPage(Math.ceil(pagination.totalCount / pageSize) || 0);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch data'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    console.log('====params', params)
    fetchData();
  }, [params]);

  const updateParams = (newParams: Partial<VaultListParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };

  const setPage = (page: number) => {
    updateParams({ page });
  };

  const setSortBy = (sortBy: VaultListParams['sortBy'], sortOrder?: 'asc' | 'desc') => {
    console.log('======sortBy', sortBy, '====sortOrder', sortOrder)
    updateParams({ sortBy, sortOrder, page: 1 });
  };

  const setFilter = (filterByProduct: string) => {
    updateParams({ filterByProduct, page: 1 });
  };

  return {
    data,
    loading,
    error,
    maxPage,
    params,
    setPage,
    setSortBy,
    setFilter,
    refresh: fetchData,
  };
};