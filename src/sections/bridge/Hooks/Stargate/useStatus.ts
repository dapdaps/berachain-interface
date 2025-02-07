import { useBridgeHistory } from "@/stores/useBridgeHistory"
import { useInterval } from "ahooks"

export const useStatus = () => {
    const { list, set}: any = useBridgeHistory()

    const pendingCount = list.filter((item: any) => item.status === 1)
    const historyCount = list.filter((item: any) => item.status !== 1)

    useInterval(async () => {
        const pendingTxs = list.filter((item: any) => item.status === 1)

        if (pendingTxs.length > 0) {
            const newList = [...list]

            for (const tx of pendingTxs) {
                try {
                    const response = await fetch(`https://api-mainnet.layerzero-scan.com/tx/${tx.transactionHash}`)
                    const resJson = await response.json()

                    const data = resJson.messages?.length > 0 ? resJson.messages[0] : null

                    if (data && data.dstTxHash && data.status === 'DELIVERED') {
                        const index = newList.findIndex((item: any) => item.transactionHash === tx.transactionHash)
                        if (index !== -1) {
                            newList[index] = {
                                ...newList[index],
                                status: 2
                            }
                        }
                    }
                } catch (error) {
                    console.error('Failed to fetch transaction status:', error)
                }
            }

            
            set({ list: newList })
        }
    }, 5000)

    return { pendingCount: pendingCount.length, historyCount: historyCount.length, list }
}   