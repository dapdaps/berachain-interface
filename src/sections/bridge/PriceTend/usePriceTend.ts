import { get } from "@/utils/http"
import { useEffect, useState } from "react"

export default function usePriceTend({ address }: { address: string }) {
    const [priceTend, setPriceTend] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (address) {
            getPriceTend()
        }
    }, [address])

    const getPriceTend = async () => {
        setIsLoading(true)
        const _address = address === 'native' ? '0x0000000000000000000000000000000000000000' : address
        const res = await get(`/api/go/token/price/7day?address=${_address}`)
        if (res.code === 200) {
            setPriceTend(res.data || [])
        } else {
            setPriceTend([])
        }
        setIsLoading(false)
    }

    return {
        priceTend,
        isLoading,
    }
}