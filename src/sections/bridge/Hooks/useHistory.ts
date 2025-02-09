import { useQuery } from "@tanstack/react-query"
import { useAccount } from "wagmi"
import * as http from "@/utils/http";

export const useHistory = () => {
    const { address } = useAccount()

    const { data, isLoading } = useQuery({
        queryKey: ['history', address],
        queryFn: () => http.get(`/api/action/get-actions-by-type?action_type=Bridge&page=1&page_size=99999`),
    })

    return { data, isLoading }
}       