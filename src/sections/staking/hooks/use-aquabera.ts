
import multicallAddresses from '@/configs/contract/multicall';
import dappConfig from '@/configs/staking/dapps/aquabera';
import useCustomAccount from "@/hooks/use-account";
import { useMemo, useState } from "react";
import useAquaBeraData from "../Datas/AquaBera";
import _ from 'lodash';

export default function useAquaBera(name?: string) {
  const { chainId, account: sender, provider } = useCustomAccount();
  const [loading, setLoading] = useState<boolean>(true);
  const [dataList, setDataList] = useState<any>(null);
  const dexConfig = useMemo(() => dappConfig.chains[chainId], [chainId]);

  const multicallAddress = useMemo(
    () => chainId && multicallAddresses[chainId],
    [chainId]
  );

  const { reload } = useAquaBeraData({
    name: name || dappConfig?.name,
    pairs: dexConfig?.pairs,
    sender,
    provider,
    multicallAddress,
    onLoad: (data: any) => {
      setDataList(_.cloneDeep(data.dataList));
      setLoading(false);
    }
  });
  const handleReload = () => {
    setLoading(true);
    reload()
  }

  return {
    dataList,
    loading,
    reload: handleReload,
  }
}