import { type PropsWithChildren, useEffect } from "react"
import { useFormContext } from "react-hook-form"
import type { ChainType } from "../../../types/deposit"
import { reverseAssetNetworkAdapter } from "../../../utils/adapters"
import type { DepositFormValues } from "./DepositForm"
import { DepositUIMachineContext } from "./DepositUIMachineProvider"

type DepositUIMachineFormSyncProviderProps = PropsWithChildren<{
  userAddress?: string
  userChainType?: ChainType
}>

export function DepositUIMachineFormSyncProvider({
  children,
  userAddress,
  userChainType,
}: DepositUIMachineFormSyncProviderProps) {
  const { watch } = useFormContext<DepositFormValues>()
  const actorRef = DepositUIMachineContext.useActorRef()

  useEffect(() => {
    const sub = watch(async (value, { name }) => {
      if (name === "network") {
        const networkValue = value[name]
        if (networkValue === undefined) {
          return
        }
        const networkFromMachine = actorRef
          .getSnapshot()
          .context.depositFormRef.getSnapshot().context.blockchain
        const networkFromForm = networkValue
          ? reverseAssetNetworkAdapter[networkValue]
          : null
        // This is a hack to prevent double updates of the network triggered by form
        if (networkFromMachine === networkFromForm) {
          return
        }
        actorRef.send({
          type: "DEPOSIT_FORM.UPDATE_BLOCKCHAIN",
          params: { network: networkValue },
        })
      }
      if (name === "amount") {
        const amountValue = value[name]
        if (amountValue === undefined) {
          return
        }
        actorRef.send({
          type: "DEPOSIT_FORM.UPDATE_AMOUNT",
          params: { amount: amountValue },
        })
      }
    })
    return () => {
      sub.unsubscribe()
    }
  }, [watch, actorRef])

  useEffect(() => {
    if (!userAddress || userChainType == null) {
      actorRef.send({
        type: "LOGOUT",
      })
    } else {
      actorRef.send({
        type: "LOGIN",
        params: { userAddress, userChainType },
      })
    }
  }, [actorRef, userAddress, userChainType])

  return <>{children}</>
}
