import { useBridgeHistory } from "@/stores/useBridgeHistory"
import { useInterval } from "ahooks"
import { useEffect } from "react"
import * as http from "@/utils/http";
import { useHistory } from "../useHistory";

export const useStatus = () => {
    const { data: list, isLoading, updateStatus } = useHistory()

    const pendingCount = list.filter((item: any) => Number(item.bridge_status) !== 4)
    const historyCount = list.filter((item: any) => Number(item.bridge_status) === 4)

    useInterval(async () => {
        const pendingTxs = list.filter((item: any) => Number(item.bridge_status) !== 4)

        if (pendingTxs.length > 0) {
            // const newList = [...list]

            for (const tx of pendingTxs) {
                try {
                    const response = await fetch(`https://api-mainnet.layerzero-scan.com/tx/${tx.tx_id}`)
                    const resJson = await response.json()

                    const data = resJson.messages?.length > 0 ? resJson.messages[0] : null

                    if (data && data.dstTxHash && data.status === 'DELIVERED') {
                        // update status
                        updateStatus(tx)

                        // const index = newList.findIndex((item: any) => item.transactionHash === tx.tx_id)
                        // if (index !== -1) {
                        //     // newList[index] = {
                        //     //     ...newList[index],
                        //     //     status: 2
                        //     // }
                        // }
                    }
                } catch (error) {
                    console.error('Failed to fetch transaction status:', error)
                }
            }

            // if (list.length === newList.length) {
            //     set({ list: newList })
            // }
        }
    }, 5000)

    return { pendingCount: pendingCount.length, historyCount: historyCount.length, list }
}   