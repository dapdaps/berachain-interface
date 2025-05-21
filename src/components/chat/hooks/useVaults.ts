import { useRequest } from 'ahooks';
import { get } from '@/utils/http';
import useCustomAccount from '@/hooks/use-account';
import { List } from '@/sections/vaults/v2/hooks/list';
import { useEffect } from 'react';

export function useVaults(props: { vaultsList: List }): Vaults {
  const { vaultsList } = props;

  const { listDataGroupByPoolAll } = vaultsList ?? {};

  const { account } = useCustomAccount();

  const { runAsync: getRecommendList, data: recommendList, loading: recommendListLoading } = useRequest(async () => {
    if (!account) return [];
    try {
      const res = await get("/api/go/vaults/interest", { address: account });
      if (res.code !== 200) return [];
      const _list = res.data || [];
      const groupedList: any = [];
      _list.forEach((vault: any) => {
        const currGroup = listDataGroupByPoolAll.find((_grouped: any) => _grouped.list.some((_vault: any) => _vault.backendId === vault.id));
        if (currGroup && !groupedList.some((it: any) => it.pool_address === currGroup.pool_address)) {
          groupedList.push(currGroup);
        }
      });

      return groupedList;
    } catch (err: any) {
      console.log('get recommend list failed: %o', err);
    }
    return [];
  }, { manual: true, debounceWait: 1000 });

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

  useEffect(() => {
    if (!account || !listDataGroupByPoolAll || !listDataGroupByPoolAll.length) return;
    getRecommendList();
  }, [listDataGroupByPoolAll, account]);

  return {
    getRecommendList,
    recommendList,
    recommendListLoading,
    getRecommendChat,
    recommendChat,
    recommendChatLoading,
  };
}

export interface Vaults {
  getRecommendList: () => Promise<any>;
  recommendList: any;
  recommendListLoading: boolean;
  getRecommendChat: () => Promise<any>;
  recommendChat: any;
  recommendChatLoading: boolean;
}
