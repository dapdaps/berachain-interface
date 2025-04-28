import { useRequest } from 'ahooks';
import axios from 'axios';
import { useEffect } from 'react';
import { getTokenLogo } from '@/sections/dashboard/utils';

export function useBerapaw(props: any) {
  const { vaults, name } = props;

  const { host, query } = vaults;
  console.log('useBerapaw props: %o', props);

  const { data, runAsync, loading } = useRequest(async () => {
    try {
      const res = await axios.post(host, query({ pageSize: 300 }));
      if (res.status !== 200 || !res.data.data?.polGetRewardVaults?.vaults) {
        return [];
      }
      const { vaults } = res.data.data.polGetRewardVaults;
      return vaults.map((it: any) => {
        const underlyingTokens = it.activeIncentives?.map((incentive: any) => ({
          ...incentive.token,
          icon: getTokenLogo(incentive.token?.symbol),
        })) ?? [];
        const obj: any = {
          ...it,
          tokens: underlyingTokens,
        };
        return obj;
      });
    } catch (err: any) {
      console.log("get berapaw vaults failed: %o", err);
    }
    return [];
  }, { manual: true });

  useEffect(() => {
    if (!name || name !== "BeraPaw") return;
    runAsync();
  }, [name]);

  return {
    loading,
    dataList: data,
    getDataList: runAsync,
  };
}
