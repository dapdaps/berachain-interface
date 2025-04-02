import { useBridgeHistory } from "@/stores/useBridgeHistory"
import { useInterval } from "ahooks"
import { useEffect } from "react"
import * as http from "@/utils/http";
import { useHistory } from "../useHistory";

export const useStatus = ({ getStatus }: { getStatus: any }) => {
    const { data: list, isLoading, updateStatus } = useHistory()

    const pendingCount = list.filter((item: any) => Number(item.bridge_status) !== 4)
    const historyCount = list.filter((item: any) => Number(item.bridge_status) === 4)

    useInterval(async () => {
        const pendingTxs = list.filter((item: any) => Number(item.bridge_status) !== 4)

        if (pendingTxs.length > 0) {
            for (const tx of pendingTxs) {
                try {
                    const extra_data = JSON.parse(tx.extra_data)
                    const response = await getStatus(extra_data, tx.template, null)
                    if (response.status === 1) {
                        updateStatus(tx)
                    }
                } catch (error) {
                    console.error('Failed to fetch transaction status:', error)
                }
            }
        }
    }, 5000)

    return { pendingCount: pendingCount.length, historyCount: historyCount.length, list }
}   