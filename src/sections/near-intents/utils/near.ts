
import { getNearProvider, setNearProvider } from "@near-eth/client"
import { providers } from "near-api-js"
import type { CodeResult } from "near-api-js/lib/providers/provider"

import type { NearViewAccount } from "../types/interfaces"


// Copied from https://github.com/mynearwallet/my-near-wallet/blob/3b1a6c6e5c62a0235f5e32d370f803fa2180c6f8/packages/frontend/src/utils/wallet.ts#L75
const ACCOUNT_ID_REGEX = /^(([a-z\d]+[-_])*[a-z\d]+\.)*([a-z\d]+[-_])*[a-z\d]+$/

const IMPLICIT_ACCOUNT_MAX_LENGTH = 64

export function isLegitAccountId(accountId: string): boolean {
  return ACCOUNT_ID_REGEX.test(accountId)
}

export function isImplicitAccount(accountId: string): boolean {
  return (
    accountId.length === IMPLICIT_ACCOUNT_MAX_LENGTH && !accountId.includes(".")
  )
}


const NEAR_NODE_URL =
  process?.env?.nearNodeUrl ?? "https://rpc.testnet.near.org"

export async function storageBalance(contractId: string, accountId: string) {
  try {
    setNearProvider(new providers.JsonRpcProvider({ url: NEAR_NODE_URL }))

    const nearProvider = getNearProvider()
    const result = await nearProvider.query<CodeResult>({
      request_type: "call_function",
      account_id: contractId,
      method_name: "storage_balance_of",
      args_base64: Buffer.from(
        JSON.stringify({ account_id: accountId })
      ).toString("base64"),
      finality: "optimistic",
    })
    const balance = JSON.parse(Buffer.from(result.result).toString())
    // console.log("Fetching near storage balance of result:", result)
    return BigInt(balance?.total || "0")
  } catch (e) {
    console.error("Failed to check storage balance")
    return null
  }
}

export async function nearAccount(
  accountId: string
): Promise<NearViewAccount | null> {
  try {
    setNearProvider(new providers.JsonRpcProvider({ url: NEAR_NODE_URL }))

    const nearProvider = getNearProvider()
    const result = await nearProvider.query({
      request_type: "view_account",
      finality: "final",
      account_id: accountId,
    })
    // console.log("Fetching near account result:", result)
    return result as NearViewAccount
  } catch (e) {
    console.error(`Failed to fetch account or it doesn't exist - ${accountId}`)
    return null
  }
}

export async function nep141Balance(
  accountId: string,
  contractId: string
): Promise<string | null> {
  try {
    setNearProvider(new providers.JsonRpcProvider({ url: NEAR_NODE_URL }))
    const nearProvider = getNearProvider()
    const storageBalance = await nearProvider.query<CodeResult>({
      request_type: "call_function",
      account_id: contractId,
      method_name: "ft_balance_of",
      args_base64: Buffer.from(
        JSON.stringify({ account_id: accountId })
      ).toString("base64"),
      finality: "optimistic",
    })
    // console.log(
    //   `ft_balance_of ${contractId} for ${accountId} is ${storageBalance}`
    // )
    return JSON.parse(Buffer.from(storageBalance.result).toString())
  } catch (e) {
    console.error("Failed to check NEP-141 balance")
    return null
  }
}

export async function intentStatus(
  contractId: string,
  intentId: string
): Promise<string | null> {
  try {
    setNearProvider(new providers.JsonRpcProvider({ url: NEAR_NODE_URL }))

    const nearProvider = getNearProvider()
    const result = await nearProvider.query<CodeResult>({
      request_type: "call_function",
      account_id: contractId,
      method_name: "get_intent",
      args_base64: Buffer.from(JSON.stringify({ id: intentId })).toString(
        "base64"
      ),
      finality: "optimistic",
    })
    console.log(`get_intent ${contractId} for ${intentId} status is ${result}`)
    const intent = JSON.parse(Buffer.from(result.result).toString())
    return intent
  } catch (e) {
    console.error("Failed to get intent status")
    return null
  }
}

export function isStorageDepositException(contractId: string): boolean {
  const exceptionKeys = ["aurora"]
  return exceptionKeys.includes(contractId)
}
