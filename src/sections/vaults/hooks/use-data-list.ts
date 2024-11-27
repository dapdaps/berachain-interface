import useAquaBera from "@/sections/staking/hooks/use-aquabera";
import useInfraredList from "@/sections/staking/hooks/use-infrared-list";
import Big from "big.js";
import { useMemo, useState } from "react";


export default function useDataList() {

  const { dataList: infraredData, loading: infraredLoading, fetchAllData: infraredReload } = useInfraredList(0, "Infrared");
  const { dataList: aquabearData, loading: aquabearLoading, reload: aquabearReload } = useAquaBera("AquaBera")
  // const [dataList, setDataList] = useState([])
  const [updater, setUpdater] = useState(0)


  const [dataList, loading, reload] = useMemo(() => {
    const _dataList = []
    infraredData?.forEach((_data: any) => {
      _dataList.push({
        ..._data,
        pool: {
          name: _data?.initialData?.pool?.name || 'iBGT',
          protocol: _data?.initialData?.pool?.protocol
        },
        platform: "infrared"
      })
    })
    aquabearData?.forEach((_data: any) => {
      const _depositAmount = _data?.pairedTokens?.reduce((acc, curr) => Big(acc).plus(curr?.yourValue).toFixed(), Big(0))
      _dataList.push({
        ..._data,
        images: [_data?.icon],
        tokens: [_data?.symbol],
        apy: _data?.maxApr,
        depositAmount: _depositAmount,
        usdDepositAmount: _depositAmount,
        platform: "aquabera",
        pool: {
          name: _data?.symbol,
          protocol: 'BEX'
        },
      })
    })
    return [_dataList, infraredLoading || aquabearLoading, () => {
      infraredReload()
      aquabearReload()
    }]
  }, [infraredData, aquabearData, infraredLoading, aquabearLoading])

  return {
    dataList,
    loading,
    reload
  }
}