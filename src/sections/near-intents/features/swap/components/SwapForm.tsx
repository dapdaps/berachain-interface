import SwitchTabs from "@/components/switch-tabs"
import useIsMobile from "@/hooks/use-isMobile"
import useToast from "@/hooks/use-toast"
import { LIST_TOKENS } from "@/sections/near-intents/constants/tokens"
import { useConnectWallet } from "@/sections/near-intents/hooks/useConnectWallet"
import { Callout, Flex } from "@radix-ui/themes"
import { useAppKit } from "@reown/appkit/react"
import { useSelector } from "@xstate/react"
import {
  Fragment,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react"
import { useFormContext } from "react-hook-form"
import type { ActorRefFrom, SnapshotFrom } from "xstate"
import { ButtonCustom } from "../../../components/Button/ButtonCustom"
import { ButtonSwitch } from "../../../components/Button/ButtonSwitch"
import { Form } from "../../../components/Form"
import { FieldComboInput } from "../../../components/Form/FieldComboInput"
import { SwapIntentCard } from "../../../components/IntentCard/SwapIntentCard"
import type { ModalSelectAssetsPayload } from "../../../components/Modal/ModalSelectAssets"
import { useTokensUsdPrices } from "../../../hooks/useTokensUsdPrices"
import { useModalStore } from "../../../providers/ModalStoreProvider"
import { isAggregatedQuoteEmpty } from "../../../services/quoteService"
import { ModalType } from "../../../stores/modalStore"
import type { SwappableToken } from "../../../types/swap"
import { formatUsdAmount } from "../../../utils/format"
import getTokenUsdPrice from "../../../utils/getTokenUsdPrice"
import { computeTotalBalance } from "../../../utils/tokenUtils"
import type { depositedBalanceMachine } from "../../machines/depositedBalanceMachine"
import type { intentStatusMachine } from "../../machines/intentStatusMachine"
import type { Context } from "../../machines/swapUIMachine"
import SwapCompareWith from "./SwapCompareWith"
import { SwapSubmitterContext } from "./SwapSubmitter"
import { SwapUIMachineContext } from "./SwapUIMachineProvider"
import { useBintent } from "@/stores/bintent"
import useClickTracking from "@/hooks/use-click-tracking"
export interface SwapFormProps {
  onNavigateDeposit?: () => void
}

export const SwapForm = ({ onNavigateDeposit }: SwapFormProps) => {
  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    formState: { errors, },
  } = useFormContext<SwapFormValues>()
  const { handleReport } = useClickTracking();
  const store = useBintent()

  const isMobile = useIsMobile();
  const toast = useToast();
  const { state } = useConnectWallet()
  const swapUIActorRef = SwapUIMachineContext.useActorRef()

  const snapshot = SwapUIMachineContext.useSelector((snapshot) => snapshot)
  const intentCreationResult = snapshot.context.intentCreationResult
  const intentRefs = snapshot.context.intentRefs

  const { data: tokensUsdPriceData } = useTokensUsdPrices()
  const modal = useAppKit()

  // const [currentTab, setCurrentTab] = useState<string>('trading_challenge');

  const { tokenIn, tokenOut, noLiquidity } = SwapUIMachineContext.useSelector(
    (snapshot) => {
      const tokenIn = snapshot.context.formValues.tokenIn
      const tokenOut = snapshot.context.formValues.tokenOut
      const noLiquidity =
        snapshot.context.quote && isAggregatedQuoteEmpty(snapshot.context.quote)
      return {
        tokenIn,
        tokenOut,
        noLiquidity,
      }
    }
  )

  // we need stable references to allow passing to useEffect
  const switchTokens = useCallback(() => {
    const { amountIn, amountOut } = getValues()
    setValue("amountIn", amountOut)
    setValue("amountOut", amountIn)
    swapUIActorRef.send({
      type: "input",
      params: {
        tokenIn: tokenOut,
        tokenOut: tokenIn,
      },
    })
  }, [tokenIn, tokenOut, getValues, setValue, swapUIActorRef.send])

  const { setModalType, payload, onCloseModal } = useModalStore(
    (state) => state
  )

  const openModalSelectAssets = (fieldName: string) => {
    setModalType(ModalType.MODAL_SELECT_ASSETS, {
      fieldName,
      selectToken: undefined,
      balances: depositedBalanceRef?.getSnapshot().context.balances,
    })
  }

  useEffect(() => {
    if (
      (payload as ModalSelectAssetsPayload)?.modalType !==
      ModalType.MODAL_SELECT_ASSETS
    ) {
      return
    }
    const { modalType, fieldName, token } = payload as ModalSelectAssetsPayload
    if (modalType === ModalType.MODAL_SELECT_ASSETS && fieldName && token) {
      const { tokenIn, tokenOut } =
        swapUIActorRef.getSnapshot().context.formValues

      switch (fieldName) {
        case "tokenIn":
          if (tokenOut === token) {
            // Don't need to switch amounts, when token selected from dialog
            swapUIActorRef.send({
              type: "input",
              params: { tokenIn: tokenOut, tokenOut: tokenIn },
            })
          } else {
            swapUIActorRef.send({ type: "input", params: { tokenIn: token } })
          }
          break
        case "tokenOut":
          if (tokenIn === token) {
            // Don't need to switch amounts, when token selected from dialog
            swapUIActorRef.send({
              type: "input",
              params: { tokenIn: tokenOut, tokenOut: tokenIn },
            })
          } else {
            swapUIActorRef.send({ type: "input", params: { tokenOut: token } })
          }
          break
      }
      onCloseModal(undefined)
    }
  }, [payload, onCloseModal, swapUIActorRef])

  const { onSubmit } = useContext(SwapSubmitterContext)

  const depositedBalanceRef = useSelector(
    swapUIActorRef,
    (state) => state.children.depositedBalanceRef
  )

  const tokenInBalance = useSelector(
    depositedBalanceRef,
    balanceSelector(tokenIn)
  )

  const tokenOutBalance = useSelector(
    depositedBalanceRef,
    balanceSelector(tokenOut)
  )

  const balanceInsufficient =
    tokenInBalance != null && snapshot.context.parsedFormValues.amountIn != null
      ? tokenInBalance < snapshot.context.parsedFormValues.amountIn
      : null

  const showDepositButton =
    tokenInBalance != null && tokenInBalance === 0n && onNavigateDeposit != null

  const usdAmountIn = getTokenUsdPrice(
    getValues().amountIn,
    tokenIn,
    tokensUsdPriceData
  )
  const usdAmountOut = getTokenUsdPrice(
    getValues().amountOut,
    tokenOut,
    tokensUsdPriceData
  )

  const hasOngoingIntents = intentRefs.some(intentRef => {
    const intentState = intentRef.getSnapshot();
    return intentState.matches("pending") || intentState.matches("checking");
  });

  useEffect(() => {
    if (store?.currentTab === "trading_challenge") {
      swapUIActorRef.send({
        type: "input",
        params: { tokenIn: LIST_TOKENS[0], tokenOut: LIST_TOKENS[1] },
      })
    } else {
      swapUIActorRef.send({
        type: "input",
        params: { tokenIn: LIST_TOKENS[1], tokenOut: LIST_TOKENS[0] },
      })
    }
  }, [store?.currentTab])

  useEffect(() => {
    return () => {
      store.set({
        currentTab: "trading_challenge"
      })
    }
  }, [])

  return (
    <Flex
      direction="column"
      gap="2"
      className="bg-[#FFFDEB] lg:rounded-[30px] lg:p-5 lg:border lg:border-black lg:shadow-shadow1 md:px-3 md:pb-[40px]"
    >
      <SwitchTabs
        tabs={[
          { label: "Trading Challenge", value: "trading_challenge" },
          { label: "Normal", value: "normal" }
        ]}
        onChange={(val) => {
          handleReport("1023-005")
          store.set({
            currentTab: val
          })
        }}
        current={store?.currentTab}
        className="mx-auto md:w-[320px] w-[480px]"
      />
      {
        store?.currentTab === "trading_challenge" ? (
          <div className="font-Montserrat text-[14px] my-[11px]">In this mode your trades will count towards the challenge, and only BERA token (token in /out) counts.  </div>
        ) : (
          <div className="font-Montserrat text-[14px] my-[11px] text-center">Cross-chain swap across any network, any token.</div>
        )
      }
      <Form<SwapFormValues>
        handleSubmit={handleSubmit(onSubmit)}
        register={register}
      >
        <FieldComboInput<SwapFormValues>
          fieldName="amountIn"
          selected={tokenIn}
          disabledSelect={store?.currentTab === "trading_challenge" && tokenIn?.symbol === LIST_TOKENS?.[0]?.symbol}
          handleSelect={() => {
            openModalSelectAssets("tokenIn")
          }}
          className="border border-[#373A53] rounded-t-xl"
          required
          errors={errors}
          usdAmount={usdAmountIn ? `~${formatUsdAmount(usdAmountIn)}` : null}
          balance={tokenInBalance}
        />

        <div className="relative w-full">
          <ButtonSwitch className="w-[34px] h-[34px] !bg-[#BC9549] rounded-md font-bold border-[2px] border-[#FFFDEB]" onClick={switchTokens} />
        </div>

        <FieldComboInput<SwapFormValues>
          fieldName="amountOut"
          selected={tokenOut}
          handleSelect={() => {
            openModalSelectAssets("tokenOut")
          }}
          disabledSelect={store?.currentTab === "trading_challenge" && tokenOut?.symbol === LIST_TOKENS?.[0]?.symbol}
          className="border border-[#373A53] border-t-[0] rounded-b-xl mb-[14px]"
          errors={errors}
          disabled={true}
          isLoading={snapshot.matches({ editing: "waiting_quote" })}
          usdAmount={usdAmountOut ? `~${formatUsdAmount(usdAmountOut)}` : null}
          balance={tokenOutBalance}
        />
        <SwapCompareWith
          tokenIn={tokenIn}
          tokenOut={tokenOut}
          currentTab={store?.currentTab}
          amountIn={getValues().amountIn}
          amountOut={getValues().amountOut}
          usdAmountOut={usdAmountOut}
          tokensUsdPriceData={tokensUsdPriceData}
        />
        <Flex align="stretch" direction="column">
          {!state.address ? (
            <ButtonCustom
              type="button"
              size="lg"
              fullWidth
              onClick={() => {
                if (isMobile) {
                  toast.info({
                    title: "Please visit the desktop version for a better experience."
                  })
                  return
                }
                modal.open()
              }}
            >
              Connect Wallet
            </ButtonCustom>
          ) : (
            <ButtonCustom
              type="submit"
              size="lg"
              fullWidth
              isLoading={snapshot.matches("submitting")}
              disabled={
                !!balanceInsufficient ||
                !!noLiquidity ||
                hasOngoingIntents
              }
            >
              {noLiquidity
                ? "No liquidity providers"
                : balanceInsufficient
                  ? "Insufficient Balance"
                  : "Swap"}
            </ButtonCustom>
          )}
        </Flex>
      </Form>

      {renderIntentCreationResult(intentCreationResult)}
    </Flex>
  )
}

function Intents({
  intentRefs,
}: { intentRefs: ActorRefFrom<typeof intentStatusMachine>[] }) {
  return (
    <div>
      {intentRefs.map((intentRef) => {
        return (
          <Fragment key={intentRef.id}>
            <SwapIntentCard intentStatusActorRef={intentRef} />
          </Fragment>
        )
      })}
    </div>
  )
}

export function renderIntentCreationResult(
  intentCreationResult: Context["intentCreationResult"]
) {
  if (!intentCreationResult || intentCreationResult.tag === "ok") {
    return null
  }

  let content: ReactNode = null

  const status = intentCreationResult.value.reason
  switch (status) {
    case "ERR_USER_DIDNT_SIGN":
      content =
        "It seems the message wasn’t signed in your wallet. Please try again."
      break

    case "ERR_CANNOT_VERIFY_SIGNATURE":
      content =
        "We couldn’t verify your signature, please try again with another wallet."
      break

    case "ERR_SIGNED_DIFFERENT_ACCOUNT":
      content =
        "The message was signed with a different wallet. Please try again."
      break

    case "ERR_PUBKEY_ADDING_DECLINED":
      content = null
      break

    case "ERR_PUBKEY_CHECK_FAILED":
      content =
        "We couldn’t verify your key, possibly due to a connection issue."
      break

    case "ERR_PUBKEY_ADDING_FAILED":
      content = "Transaction for adding public key is failed. Please try again."
      break

    case "ERR_PUBKEY_EXCEPTION":
      content = "An error occurred while adding public key. Please try again."
      break

    case "ERR_QUOTE_EXPIRED_RETURN_IS_LOWER":
      content =
        "The quote has expired or the return is lower than expected. Please try again."
      break

    case "ERR_CANNOT_PUBLISH_INTENT":
      content =
        "We couldn’t send your request, possibly due to a network issue or server downtime. Please check your connection or try again later."
      break

    case "ERR_WALLET_POPUP_BLOCKED":
      content = "Please allow popups and try again."
      break

    case "ERR_WALLET_CANCEL_ACTION":
      content = null
      break

    default:
      status satisfies never
      content = `An error occurred. Please try again. ${status}`
  }

  if (content == null) {
    return null
  }

  return (
    <Callout.Root size="1" color="red" className="mt-2 rounded-xl gap-1 p-4">
      <Callout.Text>{content}</Callout.Text>
    </Callout.Root>
  )
}

export function balanceSelector(token: SwappableToken) {
  return (state: undefined | SnapshotFrom<typeof depositedBalanceMachine>) => {
    if (!state) return
    return computeTotalBalance(token, state.context.balances)
  }
}
