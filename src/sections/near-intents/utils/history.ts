import { getDiscoverDefuseAssets } from "../api/token"
import { getNearTransactionDetails } from "../api/transaction"
import { NEAR_TOKEN_META } from "../constants/tokens"
import type { SolverTokenList } from "../libs/de-sdk/providers/solver0Provider"
import { HistoryStatus } from "../stores/historyStore"
import {
  AssetTypeEnum,
  type IntentAsset,
  type NearIntentStatus,
  type NearTX,
  type NetworkToken,
  type Result,
} from "../types/interfaces"
import { intentStatus } from "./near"
import parseDefuseAsset, {
  type ParseDefuseAssetResult,
} from "./parseDefuseAsset"
import { tokenMetaAdapter } from "./token"

export function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str)
    return true
  } catch (e) {
    return false
  }
}

export function skipFirstCircle(key: string): string {
  const sfcKey = "__sfc_key"
  const getSfcKeyFromLocal = localStorage.getItem(sfcKey)
  if (!getSfcKeyFromLocal) {
    localStorage.setItem(sfcKey, JSON.stringify(true))
    return ""
  }
  return key
}

export type GetIntentResult = NearIntentStatus | null
export async function callRequestGetIntent(
  receiverId: string,
  intentId: string
): Promise<GetIntentResult> {
  const result = (await intentStatus(
    receiverId,
    intentId
  )) as NearIntentStatus | null

  if (!result?.status) {
    return null
  }

  const status =
    result?.status === HistoryStatus.INTENT_1_AVAILABLE
      ? HistoryStatus.AVAILABLE
      : (result.status as HistoryStatus)

  return {
    ...result,
    status,
  }
}

type GetSelectedTokenDetailsResult = {
  amount: string
  selectedToken?: NetworkToken
} | null
async function getSelectedTokenDetails(
  asset: IntentAsset
): Promise<GetSelectedTokenDetailsResult> {
  const tokenInType = asset.type
  let defuse_asset_id = ""
  let defuseAsset: ParseDefuseAssetResult = null
  let discoverAsset: Result<SolverTokenList>
  switch (tokenInType) {
    case AssetTypeEnum.native:
      return {
        amount: asset.amount,
        selectedToken: NEAR_TOKEN_META,
      }
    case AssetTypeEnum.nep141:
      discoverAsset = await getDiscoverDefuseAssets(asset.token as string)
      return {
        amount: asset.amount,
        selectedToken: tokenMetaAdapter(discoverAsset.result.tokens[0]),
      }
    case AssetTypeEnum.cross_chain:
      defuse_asset_id = asset.asset as string
      defuseAsset = parseDefuseAsset(defuse_asset_id)
      assert(defuseAsset, "Invalid defuse asset")
      discoverAsset = await getDiscoverDefuseAssets(defuseAsset.contractId)
      return {
        amount: asset.amount,
        selectedToken: tokenMetaAdapter(discoverAsset.result.tokens[0]),
      }
    default:
      return null
  }
}

type GetDetailsResult = {
  tokenIn?: string
  tokenOut?: string
  selectedTokenIn?: NetworkToken
  selectedTokenOut?: NetworkToken
}
export async function getDetailsFromGetIntent(
  receiverId: string,
  intentId: string
): Promise<GetDetailsResult> {
  const result = await callRequestGetIntent(receiverId, intentId)
  const details: GetDetailsResult = {}

  const assetInDetails: GetSelectedTokenDetailsResult = result?.asset_in
    ? await getSelectedTokenDetails(result.asset_in)
    : null
  if (assetInDetails) {
    Object.assign(details, {
      tokenIn: assetInDetails.amount,
      selectedTokenIn: assetInDetails.selectedToken,
    })
  }

  const assetOutDetails: GetSelectedTokenDetailsResult = result?.asset_in
    ? await getSelectedTokenDetails(result.asset_out)
    : null
  if (assetOutDetails) {
    Object.assign(details, {
      tokenOut: assetOutDetails.amount,
      selectedTokenOut: assetOutDetails.selectedToken,
    })
  }

  return {
    ...details,
  }
}

export const getDetailsFromFtTransferCall = async () => {}

export const getDetailsFromRollBackIntent = async () => {}

export const getDetailsFromNearWithdraw = async () => {}

type GetDetailsFromStorageDepositResult = {
  amount?: string
  receiverId?: string
}
export const getDetailsFromStorageDeposit = async (
  hash: string,
  accountId: string
): Promise<GetDetailsFromStorageDepositResult> => {
  const data = (await getNearTransactionDetails(
    hash,
    accountId
  )) as Result<NearTX>
  if (!data) {
    return {}
  }
  return {
    amount: data.result?.transaction.actions[0].FunctionCall.deposit,
    receiverId: data.result?.transaction.receiver_id,
  }
}

export const getDetailsFromNativeOnTransfer = async () => {}

function assert(condition: unknown, msg?: string): asserts condition {
  if (!condition) {
    throw new Error(msg)
  }
}
