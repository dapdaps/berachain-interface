import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import { get } from '@/utils/http';
import {
  formatExecution,
  gasFormatter,
  getDappLogo
} from '@/sections/dashboard/utils';
import useUser from '@/hooks/use-user';
import { upperFirst } from 'lodash';
import useIsMobile from '@/hooks/use-isMobile';

export function useRecords(props: Props) {
  const { currentChain } = props;

  const { address } = useAccount();
  const { accessToken, accessTokenLoading } = useUser();
  const isMobile = useIsMobile();

  const [hasMore, setHasMore] = useState(false);
  const [records, setRecords] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageTotal, setPageTotal] = useState(1);
  const [lastPageStart, setLastPageStart] = useState<any>({});

  const getRecords = async (params: any = {}) => {
    const _pageIndex = params.pageIndex || pageIndex;
    const _direction = params.direction || 'next';

    const _params: any = {
      address,
      limit: 20,
      start_time: _pageIndex === 1 ? '' : records.slice(-1)[0].tx_time,
      chain_id: currentChain.id,
      dapp: ''
    };
    if (_direction === 'prev') {
      _params.start_time =  _pageIndex === 1 ? '' : lastPageStart[_pageIndex];
    }

    console.log('_pageIndex: %o, _params: %o', _pageIndex, _params);

    try {
      setLoading(true);
      setRecords([]);
      const result = await get(`/api.db3.app/api/transaction/list`, _params, { isSkipFormatUrl: true });

      const _list = result.data.list
        // ?.filter((record: any) => record.token_in && record)
        .map((record: any) => {
          return {
            key: record.id,
            ...record,
            id: record.id,
            executed: formatExecution(record, isMobile),
            action: upperFirst(record.type),
            gas: gasFormatter(record),
            dapp_logo: getDappLogo(record.dapp),
            dapp_name: record.dapp,
            chain_logo: currentChain.icon
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
    setLastPageStart({ ...lastPageStart, [pageIndex]: records[0].tx_time });
    const _pageIndex = pageIndex + 1;
    setPageIndex(_pageIndex);
    getRecords({ pageIndex: _pageIndex, direction: 'next' });
  };

  const handlePrev = () => {
    if (pageIndex === 1 || loading) return;
    const _pageIndex = pageIndex - 1;
    setPageIndex(_pageIndex);
    getRecords({ pageIndex: _pageIndex, direction: 'prev' });
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
    handlePrev
  };
}

interface Props {
  currentChain: any;
  networkList: any;
}
