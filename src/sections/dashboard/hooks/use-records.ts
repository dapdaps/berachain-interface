import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import { get } from '@/utils/http';
import { formatExecution, gasFormatter, getDappLogo } from '@/sections/dashboard/utils';
import useUser from '@/hooks/use-user';
import { upperFirst } from 'lodash';

export function useRecords(props: Props) {
  const { currentChain } = props;

  const { address } = useAccount();
  const { accessToken, accessTokenLoading } = useUser();

  const [hasMore, setHasMore] = useState(false);
  const [records, setRecords] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageTotal, setPageTotal] = useState(1);

  const getRecords = async (params: any = {}) => {
    const _pageIndex = params.pageIndex || pageIndex;

    try {
      setLoading(true);
      setRecords([]);
      const result = await get(`/db3`, {
        url: 'api/transaction/list',
        params: JSON.stringify({
          address,
          limit: 20,
          start_time: _pageIndex === 1 ? '' : records.slice(-1)[0].tx_time,
          chain_id: currentChain.id,
          dapp: '',
        }),
      });

      const _list = result.data.list
        .filter((record: any) => record.token_in && record)
        .map((record: any) => {
          return {
            key: record.id,
            ...record,
            id: record.id,
            executed: formatExecution(record),
            action: upperFirst(record.type),
            gas: gasFormatter(record),
            dapp_logo: getDappLogo(record.dapp),
            dapp_name: record.dapp,
            chain_logo: currentChain.icon,
          };
        });

      setRecords(_list);
      setHasMore(result.data.has_more);
      if (_pageIndex > pageTotal) {
        setPageTotal(_pageIndex);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching resultNetwork data:', error);
      setLoading(false);
      setHasMore(false);
      setRecords([]);
    }
  };

  const handleNext = () => {
    if (!hasMore || loading) return;
    const _pageIndex= pageIndex + 1;
    setPageIndex(_pageIndex);
    getRecords({ pageIndex: _pageIndex });
  };

  const handlePrev = () => {
    if (pageIndex === 1 || loading) return;
    const _pageIndex= pageIndex - 1;
    setPageIndex(_pageIndex);
    getRecords({ pageIndex: _pageIndex });
  };

  useEffect(() => {
    if (!accessToken) {
      setHasMore(false);
      setPageIndex(1);
      setPageTotal(1);
      setRecords([]);
      return;
    }
    if (accessTokenLoading) return;
    getRecords();
  }, [accessToken, accessTokenLoading]);

  return {
    hasMore,
    records,
    loading,
    pageIndex,
    pageTotal,
    handleNext,
    handlePrev,
  };
}

interface Props {
  currentChain: any;
  networkList: any;
}
