import { DEFAULT_CHAIN_ID } from "@/configs";
import multicallAddresses from "@/configs/contract/multicall";
import infraredConfig from "@/configs/staking/dapps/infrared";
import useCustomAccount from "@/hooks/use-account";
import { asyncFetch } from "@/utils/http";
import { useEffect, useMemo, useState } from "react";
import useInfraredData from "../Datas/Infrared";
import { useIbgtVaults } from "@/stores/ibgt-vaults";
import { useDebounceFn } from "ahooks";

export default function useInfraredList(updater?: number, name?: string) {
  const { chainId, account: sender, provider } = useCustomAccount();
  // @ts-ignore
  const infraredDexConfig = infraredConfig.chains[DEFAULT_CHAIN_ID];
  const { ALL_DATA_URL, IBGT_ADDRESS, IBGT_VAULT_ADDRESS } = infraredDexConfig;
  const ibgtVaults: any = useIbgtVaults();
  const [maxApr, setMaxApr] = useState(0);
  const [allData, setAllData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataList, setDataList] = useState<any>(null);
  const [fullDataList, setFullDataList] = useState<any>(null);

  const multicallAddress = useMemo(
    () => chainId && multicallAddresses[chainId],
    [chainId]
  );

  const { run: debounceFetchAllData } = useDebounceFn(
    () => {
      !loading && fetchAllData();
    },
    {
      wait: 300
    }
  );
  function fetchAllData() {
    setLoading(true);
    asyncFetch(
      `${process.env.NEXT_PUBLIC_API}/api/infrared?path=api%2Fvaults&params=chainId%3D80094%26offset%3D0%26limit%3D100`
    ).then((res) => {
      setAllData(res?.vaults);
      setMaxApr(res?.aprMax);
    });
  }

  const { reload } = useInfraredData({
    name: name || infraredConfig.name,
    sender,
    provider,
    allData,
    multicallAddress,
    IBGT_ADDRESS,
    IBGT_VAULT_ADDRESS,
    onLoad: (data: any) => {
      setDataList([...data.dataList]);
      setFullDataList([...data.fullDataList]);
      setLoading(false);
      ibgtVaults.set({ vaults: [...data.dataList] });
    }
  });

  useEffect(() => {
    debounceFetchAllData();
  }, [updater]);

  return {
    loading,
    dataList,
    fullDataList,
    maxApr,
    fetchAllData,
    reload
  };
}
