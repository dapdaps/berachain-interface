import { useMemo } from "react"
import useBridgeType from "./useBridgeType"
import { fullToken, stargateToken } from '../lib/allTokens'
import useDexTokens from "@/hooks/use-dex-tokens"

const _allTokens: any = {
    'jumper': fullToken,
    'superSwap': fullToken,
    'stargate': stargateToken
}

const KodiakDapp = {
  name: 'Kodiak',
  tokens: {
    80094: []
  }
}

const defaultDapp = {
  name: 'default',
  tokens: {
    80094: []
  }
}

export default function useAllToken() {
  const { bridgeType } = useBridgeType({ type: 'bridge' })
  const kodiakTokens = useDexTokens(bridgeType === 'superSwap' ? KodiakDapp : defaultDapp)

  const allTokens = useMemo(() => {
    return bridgeType === 'superSwap' ? { 80094: kodiakTokens } : (_allTokens[bridgeType || 'jumper'])
  }, [bridgeType, kodiakTokens])

  return allTokens
}   