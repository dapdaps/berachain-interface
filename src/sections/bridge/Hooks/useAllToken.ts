import { useMemo } from "react"
import useBridgeType from "./useBridgeType"
import { fullToken, stargateToken } from '../lib/allTokens'

const _allTokens: any = {
    'jumper': fullToken,
    'stargate': stargateToken
}
export default function useAllToken() {
  const { bridgeType } = useBridgeType()

  const allTokens = useMemo(() => {
    return _allTokens[bridgeType || 'jumper']
  }, [bridgeType])

  return allTokens
}   