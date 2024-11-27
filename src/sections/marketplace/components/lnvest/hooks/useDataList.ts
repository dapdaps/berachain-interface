import useAquaBera from "@/sections/staking/hooks/use-aquabera"
import useInfraredList from "@/sections/staking/hooks/use-infrared-list"
import { useMemo } from "react"

export default function useDataList(updater: number) {
  const { loading: infraredLoading, dataList: infraredDataList } = useInfraredList(updater)

  const { loading: aquaBeraLoading, dataList: aquaBeraDataList } = useAquaBera()

  const [loading, dataList] = useMemo(() => {
    return [
      infraredLoading || aquaBeraLoading,
      [...(infraredDataList ? infraredDataList : []),
      ...(aquaBeraDataList ? aquaBeraDataList : [])
        .map(aquaBeraData => {
          console.log('===aquaBeraData', aquaBeraData)
          return {
            ...aquaBeraData,
            type: "Staking",
            platform: 'aquabera',
            // apr: `${aquaBeraData?.minApr}-${aquaBeraData?.maxApr}`,
            images: [aquaBeraData.icon],
            tokens: [aquaBeraData.symbol]
          }
        })]
    ]
  }, [
    infraredLoading,
    infraredDataList,
    aquaBeraLoading,
    aquaBeraDataList
  ])
  return {
    loading,
    dataList
  }
}