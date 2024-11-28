import useMergeDataList from "@/hooks/use-merge-data-list";
import useAquaBera from "@/sections/staking/hooks/use-aquabera";
import useInfraredList from "@/sections/staking/hooks/use-infrared-list";
import { usePriceStore } from '@/stores/usePriceStore';
import { useMemo } from "react";
export default function useDataList(updater: number) {

  const prices = usePriceStore(store => store.price);
  const { loading: infraredLoading, dataList: infraredData } = useInfraredList(updater)

  const { loading: aquaBeraLoading, dataList: aquaBeraData } = useAquaBera()
  const { getMergeDataList } = useMergeDataList()

  const [loading, dataList] = useMemo(() => {
    return [
      infraredLoading || aquaBeraLoading,
      getMergeDataList({
        infrared: infraredData,
        aquaBera: aquaBeraData
      })
    ]
  }, [
    infraredLoading,
    infraredData,
    aquaBeraLoading,
    aquaBeraData
  ])
  return {
    loading,
    dataList
  }
}