import { useState } from "react";
import useBerpsData from "@/sections/staking/Datas/Berps";
import { useIbgtVaults } from "@/stores/ibgt-vaults";

export function useBerps(props: any) {
  const ibgtVaults: any = useIbgtVaults();

  const { name, pairs, sender, provider, multicallAddress } = props;
  const [loading, setLoading] = useState<boolean>(true);
  const [dataList, setDataList] = useState<any>(null);

  const { reload } = useBerpsData({
    name,
    pairs,
    sender,
    provider,
    allData: [],
    multicallAddress,
    onLoad: (data: any) => {
      setDataList(data.dataList);
      setLoading(false);
      ibgtVaults.set({ berpsVaults: [...data.dataList] });
    }
  });

  return {
    dataList,
    loading,
    reload
  };
}
