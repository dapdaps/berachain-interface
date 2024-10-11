import useInfraredList from "@/sections/liquidity/hooks/use-infrared-list"

export default function useDataList(updater: number) {
  const { loading, dataList } = useInfraredList(updater)
  return {
    loading,
    dataList: [...(dataList ? dataList : [])]
  }
}