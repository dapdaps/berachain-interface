import ethers from "ethers"

import type {
  BaseTokenInfo,
  FungibleTokenInfo,
  NativeTokenInfo,
  UnifiedTokenInfo,
} from "../types/base"
import { SolverToken } from "../libs/de-sdk/providers/solver0Provider"
import { NetworkTokenWithSwapRoute } from "../types/interfaces"
import parseDefuseAsset from "./parseDefuseAsset"
import { getChainIconFromId } from "../hooks/useTokensListAdapter"

export function isBaseToken(
  token: BaseTokenInfo | UnifiedTokenInfo
): token is BaseTokenInfo {
  return "defuseAssetId" in token
}

export function isUnifiedToken(
  token: BaseTokenInfo | UnifiedTokenInfo
): token is UnifiedTokenInfo {
  return "unifiedAssetId" in token
}

export function isFungibleToken(
  token: BaseTokenInfo | UnifiedTokenInfo
): token is FungibleTokenInfo {
  return isBaseToken(token) && "address" in token && token.address !== "native"
}

export function isNativeToken(
  token: BaseTokenInfo | UnifiedTokenInfo
): token is NativeTokenInfo {
  return isBaseToken(token) && "type" in token && token.type === "native"
}

export const smallBalanceToFormat = (balance: string, toFixed = 14): string => {
  if (!Number.parseFloat(balance)) {
    return balance
  }
  const isSmallBalance = Number.parseFloat(balance) < 0.00001
  if (isSmallBalance) {
    return "~0.00001"
  }
  return Number.parseFloat(balance.substring(0, toFixed)).toString()
}

export const tokenBalanceToFormatUnits = ({
  balance,
  decimals,
}: {
  balance: string | undefined
  decimals: number
}): string => {
  if (balance == null || !Number.parseFloat(balance)) {
    return "0"
  }
  const balanceToUnits = ethers.utils.formatUnits(BigInt(balance), decimals).toString()

  return smallBalanceToFormat(balanceToUnits, 7)
}

export const tokenMetaAdapter = (
  token: SolverToken
): NetworkTokenWithSwapRoute => {
  const result = parseDefuseAsset(token.defuse_asset_id)
  return {
    defuse_asset_id: token.defuse_asset_id,
    symbol: token.asset_name,
    name: token.asset_name,
    decimals: token.decimals,
    icon: token.metadata_link,
    address: result?.contractId ?? "",
    blockchain: result?.blockchain ?? "",
    chainId: result?.network ?? "",
    chainName: result?.blockchain ?? "",
    chainIcon: getChainIconFromId(token.defuse_asset_id),
    routes: token.routes_to,
  }
}