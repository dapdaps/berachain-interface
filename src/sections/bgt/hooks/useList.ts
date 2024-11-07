import { useState, useEffect } from 'react';
import { get } from '@/utils/http';

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

const pageSize = 9
export const useVaultList = (initialParams?: VaultListParams) => {
  const [data, setData] = useState<VaultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [params, setParams] = useState<VaultListParams>({
    page: 1,
    sortBy: 'activeIncentivesInHoney',
    sortOrder: 'desc',
    filterByProduct: '',
    query: '',
    ...initialParams,
  });
  const [maxPage, setMaxPage] = useState(1);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        page: params.page?.toString() || '1',
        pageSize: pageSize?.toString() || '10',
        sortBy: params.sortBy || 'activeIncentivesInHoney',
        sortOrder: params.sortOrder || 'desc',
        filterByProduct: params.filterByProduct || '',
        query: params.query || '',
      });

      const response = await get(
        `https://bartio-pol-indexer.berachain.com/berachain/v1alpha1/beacon/vaults?${queryParams}`
      );

      setData(response.vaults || []);
      setMaxPage(Math.ceil(response.total / pageSize) || 0);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch data'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params]);

  const updateParams = (newParams: Partial<VaultListParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };

  const setPage = (page: number) => {
    updateParams({ page });
  };

  const setSortBy = (sortBy: VaultListParams['sortBy'], sortOrder?: 'asc' | 'desc') => {
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