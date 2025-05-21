import { useRequest } from 'ahooks';
import { get } from '@/utils/http';
import useCustomAccount from '@/hooks/use-account';
import { List } from '@/sections/vaults/v2/hooks/list';
import { useEffect, useMemo } from 'react';

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
        if (currGroup) {
          groupedList.push(currGroup);
        }
      });

      return groupedList;
    } catch (err: any) {
      console.log('get recommend list failed: %o', err);
    }
    return [];
  }, { manual: true, debounceWait: 1000 });

  useEffect(() => {
    if (!account || !listDataGroupByPoolAll || !listDataGroupByPoolAll.length) return;
    getRecommendList();
  }, [listDataGroupByPoolAll, account]);

  return {
    getRecommendList,
    recommendList,
    recommendListLoading,
  };
}

export interface Vaults {
  getRecommendList: () => Promise<any>;
  recommendList: any;
  recommendListLoading: boolean;
}
