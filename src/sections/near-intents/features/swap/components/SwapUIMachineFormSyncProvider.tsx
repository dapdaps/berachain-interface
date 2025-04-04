import { useSelector } from "@xstate/react"
import { type PropsWithChildren, useEffect, useRef, useState } from "react"
import { useFormContext } from "react-hook-form"
import { ChainType } from "../../../types/deposit"
import type { SwapWidgetProps } from "../../../types/swap"
import { usePublicKeyModalOpener } from "../hooks/usePublicKeyModalOpener"
import type { SwapFormValues } from "./SwapForm"
import { SwapUIMachineContext } from "./SwapUIMachineProvider"
import useAddAction from "@/hooks/use-add-action"
import { ethers } from "ethers"
import useToast from "@/hooks/use-toast"
import { useAccount } from "wagmi"
import { useBintent } from "@/stores/bintent"

type SwapUIMachineFormSyncProviderProps = PropsWithChildren<{
  userAddress: string | null
  userChainType: ChainType | null
  onSuccessSwap: SwapWidgetProps["onSuccessSwap"]
}>

export function SwapUIMachineFormSyncProvider({
  children,
  userAddress,
  userChainType,
  onSuccessSwap,
}: SwapUIMachineFormSyncProviderProps) {
  const { watch, setValue } = useFormContext<SwapFormValues>()
  const actorRef = SwapUIMachineContext.useActorRef()
  const { addAction } = useAddAction("dapp", true);
  const toast = useToast()
  const store = useBintent()

  // Make `onSuccessSwap` stable reference, waiting for `useEvent` hook to come out
  const onSuccessSwapRef = useRef(onSuccessSwap)
  onSuccessSwapRef.current = onSuccessSwap
  const { chainId } = useAccount()


  const addActionChainIdMap: Record<any, number> = {
    [ChainType.Near]: 99998,
    [ChainType.Solana]: 99997,
  }


  useEffect(() => {
    const sub = watch(async (value, { name }) => {
      if (name != null && name === "amountIn") {
        actorRef.send({
          type: "input",
          params: { [name]: value[name] },
        })
      }
    })
    return () => {
      sub.unsubscribe()
    }
  }, [watch, actorRef])

  useEffect(() => {
    if (userAddress == null || userChainType == null) {
      actorRef.send({ type: "LOGOUT" })
    } else {
      actorRef.send({ type: "LOGIN", params: { userAddress, userChainType } })
    }
  }, [actorRef, userAddress, userChainType])

  useEffect(() => {
    const sub = actorRef.on("*", (event) => {
      switch (event.type) {
        case "INTENT_PUBLISHED": {
          setValue("amountIn", "")
          break
        }

        case "INTENT_SETTLED": {
          const snapshot = actorRef.getSnapshot()
          const amountIn = ethers.utils.formatUnits(snapshot.context.intentCreationResult?.value?.intentDescription?.quote.totalAmountIn || 0n, snapshot.context.formValues.tokenIn.decimals)
          const amountOut = ethers.utils.formatUnits(snapshot.context.intentCreationResult?.value?.intentDescription?.quote.totalAmountOut || 0n, snapshot.context.formValues.tokenOut.decimals)

          onSuccessSwapRef.current({
            amountIn: 0n, // todo: remove amount fields, as they may not exist for all types of intents
            amountOut: 0n,
            tokenIn: event.data.tokenIn,
            tokenOut: event.data.tokenOut,
            txHash: event.data.txHash,
            intentHash: event.data.intentHash,
          })

          if (!userChainType) break

          toast.success({
            title: "Swap successful"
          })
          addAction({
            type: "Swap",
            inputCurrency: event.data.tokenIn,
            outputCurrency: event.data.tokenOut,
            template: "near-intents",
            transactionHash: event.data.intentHash,
            inputCurrencyAmount: parseFloat(amountIn),
            outputCurrencyAmount: parseFloat(amountOut),
            status: 1,
            token_in_currency: event.data.tokenIn,
            token_out_currency: event.data.tokenOut,
            sub_type: 'swap',
            chainId: addActionChainIdMap[userChainType] || chainId,
            account_id: userAddress,
            extra_data: {
              ...(store?.extra_data && typeof store.extra_data === "object" ? store.extra_data : {}),
              amountIn: snapshot.context.intentCreationResult?.value?.intentDescription?.quote.totalAmountIn?.toString(), 
              amountOut: snapshot.context.intentCreationResult?.value?.intentDescription?.quote.totalAmountOut?.toString(),
              decimalsIn: snapshot.context.formValues.tokenIn.decimals,
              decimalsOut: snapshot.context.formValues.tokenOut.decimals,
            }
          });
          break
        }
      }
    })

    return () => {
      sub.unsubscribe()
    }
  }, [actorRef, setValue, addAction, userChainType, store.extra_data])

  const swapRef = useSelector(actorRef, (state) => state.children.swapRef)
  const publicKeyVerifierRef = useSelector(swapRef, (state) => {
    if (state) {
      return state.children.publicKeyVerifierRef
    }
  })

  usePublicKeyModalOpener(publicKeyVerifierRef)

  return <>{children}</>
}
