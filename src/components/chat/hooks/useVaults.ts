import { useRequest } from 'ahooks';
import { get } from '@/utils/http';
import useCustomAccount from '@/hooks/use-account';
import { List } from '@/sections/vaults/v2/hooks/list';
import { useEffect, useMemo } from 'react';
import Big from 'big.js';

export function useVaults(props: { vaultsList: List }): Vaults {
  const { vaultsList } = props;

  const { listDataGroupByPoolAll, listLoading } = vaultsList ?? {};

  const { account } = useCustomAccount();

  const { runAsync: getRecommendList, data: recommendList, loading: recommendListLoading, mutate: setRecommendList } = useRequest(async () => {
    if (!account) return [];
    try {
      const res = await get("/api/go/vaults/interest", { address: account });
      if (res.code !== 200) return [];
      return res.data || [];
    } catch (err: any) {
      console.log('get recommend list failed: %o', err);
    }
    return [];
  }, { manual: true, debounceWait: 1000 });

  const recommendGroupedList = useMemo(() => {
    if (!recommendList || !recommendList.length || !listDataGroupByPoolAll || !listDataGroupByPoolAll.length) return [];
    const groupedList: any = [];
    recommendList.forEach((vault: any) => {
      const currGroup = listDataGroupByPoolAll.find((_grouped: any) => _grouped.list.some((_vault: any) => _vault.backendId === vault.id));
      if (currGroup && !groupedList.some((it: any) => it.pool_address === currGroup.pool_address)) {
        groupedList.push(currGroup);
      }
    });

    return groupedList;
  }, [recommendList, listDataGroupByPoolAll]);

  const recommendWithGroupedList = useMemo(() => {
    if (!recommendList || !recommendList.length || !listDataGroupByPoolAll || !listDataGroupByPoolAll.length) return [];
    return recommendList.map((item: any) => {
      const _groupVault = listDataGroupByPoolAll.find((_item: any) => _item.list?.some((_vault: any) => _vault.backendId === item.id));
      let _totalApr = Big(0);
      for (const key in item.apr) {
        _totalApr = Big(_totalApr).plus(item.apr[key] || 0);
      }
      return {
        ...item,
        totalApr: _totalApr,
        groupVault: _groupVault,
      };
    });
  }, [recommendList, listDataGroupByPoolAll]);

  const { runAsync: getRecommendChat, data: recommendChat, loading: recommendChatLoading } = useRequest(async () => {
    try {
      const res = await get("/api/go/chat/recommend/list");
      if (res.code !== 200) return [];
      const _list = res.data || [];
      return _list;
    } catch (err: any) {
      console.log('get recommend chat failed: %o', err);
    }
    return [];
  });

  const resetRecommendList = () => {
    setRecommendList([]);
  };

  useEffect(() => {
    if (!account) return;
    getRecommendList();
  }, [account]);

  return {
    getRecommendList,
    recommendList: recommendWithGroupedList,
    recommendListLoading: recommendListLoading || listLoading,
    getRecommendChat,
    recommendChat,
    recommendChatLoading,
    resetRecommendList,
  };
}

export interface Vaults {
  getRecommendList: () => Promise<any>;
  recommendList: any;
  recommendListLoading: boolean;
  getRecommendChat: () => Promise<any>;
  recommendChat: any;
  recommendChatLoading: boolean;
  resetRecommendList: () => void;
}