import { DEFAULT_CHAIN_ID } from '@/configs';
import multicallAddresses from '@/configs/contract/multicall';
import infraredConfig from '@/configs/liquidity/dapps/infrared';
import useCustomAccount from '@/hooks/use-account';
import { asyncFetch } from '@/utils/http';
import { useEffect, useMemo, useState } from 'react';
import useInfraredData from '../Datas/Infrared';

export default function useInfraredList(updater?: number) {
  const { chainId, account: sender, provider } = useCustomAccount();
  const infraredDexConfig = infraredConfig.chains[DEFAULT_CHAIN_ID];
  const { pairs, addresses, ALL_DATA_URL, IBGT_ADDRESS } = infraredDexConfig;

  const [allData, setAllData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataList, setDataList] = useState<any>(null);
  const multicallAddress = useMemo(
    () => chainId && multicallAddresses[chainId],
    [chainId]
  );

  function fetchAllData() {
    setLoading(true);
    asyncFetch(ALL_DATA_URL).then((res) => {
      setAllData(res?.data);
    });
  }

  useInfraredData({
    pairs,
    sender,
    provider,
    addresses,
    allData,
    multicallAddress,
    IBGT_ADDRESS,
    onLoad: (data: any) => {
      setDataList(data.dataList);
      setLoading(false);
    }
  });

  useEffect(() => {
    fetchAllData();
  }, [updater]);

  return {
    loading,
    dataList
  };
}
