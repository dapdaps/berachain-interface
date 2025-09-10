import { useEffect, useMemo, useState } from "react";

import chains from "./lib/util/chainConfig";
import Card from "@/components/card";
import TokenAmout from "./TokenAmount";
import Routes from "./Routes";
import SubmitBtn from "./SubmitBtn";
import Confirm from "./Confrim";
import { useAccount } from "wagmi";
import { formatLongText } from "@/utils/utils";
import useAllToken from "./Hooks/useAllToken";
import { tokenPairs } from "./lib/bridges/stargate/config";
import useBridge from "./Hooks/useBridge";
import type { Token, Chain } from "@/types";
import useBridgeType from "./Hooks/useBridgeType";
import useToast from "@/hooks/use-toast";
import { balanceFormated } from "@/utils/balance";

const ComingSoon = false;
const chainList = Object.values(chains).filter((chain) =>
  [1, 80094, 42161, 8453, 56, 43114, 59144, 5000, 10, 137, 534352].includes(
    chain.chainId
  )
);

export default function BridgeContent({
  type,
  defaultFromToken,
  defaultToToken,
  defaultFromChain = 1,
  defaultToChain = 80094,
  isShowConfirm = true,
  onCallback,
  onShowHistory,
  showRoute = false
}: any) {
  const [confirmShow, setConfirmShow] = useState(false);
  const { address } = useAccount();
  const [limitBera, setLimitBera] = useState(0);

  const { bridgeType } = useBridgeType();
  const allTokens = useAllToken();
  const { success } = useToast();
  const [banlanceIndex, setBanlanceIndex] = useState(0);
  const [isReverse, setIsReverse] = useState(false);


  const {
    fromChain,
    setFromChain,
    toChain,
    setToChain,
    fromToken,
    setFromToken,
    toToken,
    setToToken,
    sendAmount,
    onSendAmountChange,
    setSelectedRoute,
    updateBanlance,
    reciveAmount,
    identification,
    routeSortType,
    sendDisabled,
    disableText,
    sendLoading,
    quoteLoading,
    selectedRoute,
    routes,
    executeRoute
  } = useBridge({
    originFromChain: chains[defaultFromChain],
    originToChain: chains[defaultToChain],
    derection: 1,
    account: address,
    defaultBridgeText: type === 'super-swap' ? "SuperSwap" : "Bridge",
    tool: showRoute ? undefined : bridgeType
  });

  const _allTokens = useMemo(() => {
    if (!fromToken || bridgeType !== "stargate") {
      return allTokens;
    }

    const newAllTokens: any = {};
    Object.keys(allTokens).map((key: any) => {
      newAllTokens[key] = allTokens[key].filter((token: Token) => {
        let symbol = token.symbol.toUpperCase();
        if (
          [5000, 43114, 56].includes(Number(token.chainId)) &&
          fromToken.symbol.toUpperCase() === "WETH" &&
          token.symbol.toUpperCase() === "WETH"
        ) {
          symbol = "ETH";
        }
        return (
          tokenPairs[fromChain.chainId][fromToken.symbol.toUpperCase()] ===
          symbol
        );
      });
    });

    return newAllTokens;
  }, [fromToken, fromChain, bridgeType]);

  useEffect(() => {
    if (bridgeType !== "stargate") {
      return;
    }

    if (!fromToken) {
      setToToken(undefined);
      return;
    }
    const tokenPair =
      tokenPairs[fromChain.chainId][fromToken?.symbol.toUpperCase()];
    if (tokenPair) {
      const token = allTokens[toChain.chainId].find(
        (token: Token) => token.symbol.toUpperCase() === tokenPair
      ) as Token;
      if (tokenPairs[toChain.chainId][tokenPair]) {
        setToToken(token);
      } else {
        setToToken(undefined);
      }
    } else {
      setToToken(undefined);
    }
  }, [fromChain, fromToken, bridgeType, allTokens]);

  useEffect(() => {
    const fromTokens = allTokens[defaultFromChain];
    const toTokens = allTokens[defaultToChain];
    if (defaultFromToken && defaultToToken) {
      setFromToken(
        fromTokens.find(
          (token: Token) =>
            token.symbol.toUpperCase() === defaultFromToken.toUpperCase()
        )
      );
      setToToken(
        toTokens.find(
          (token: Token) =>
            token.symbol.toUpperCase() === defaultToToken.toUpperCase()
        )
      );
    } else {
      const fromToken = fromTokens.find(
        (token: Token) => token.symbol.toUpperCase() === "ETH"
      );
      const toToken = toTokens.find(
        (token: Token) => token.symbol.toUpperCase() === "WETH"
      );
      setFromToken(fromToken);
      setToToken(toToken);
    }
  }, [defaultFromToken, defaultToToken, allTokens]);


  return (
    <>
      <Card className="md:!rounded-[20px]">
        <TokenAmout
          isDest={false}
          allTokens={allTokens}
          limitBera={type === "kodiak" ? true : limitBera === 1}
          chain={fromChain}
          token={fromToken ?? null}
          amount={sendAmount}
          onAmountChange={(v: string) => {
            onSendAmountChange(v);
          }}
          chainList={chainList}
          onChainChange={(chain: Chain) => {
            setFromChain(chain);
          }}
          onTokenChange={(token: Token) => {
            setFromToken(token);
          }}
          comingSoon={ComingSoon}
          updateRef={banlanceIndex}
        />
        <div
          className="h-[8px] md:h-4 flex justify-center items-center"
          onClick={() => {
            const [_fromChain, _toChain] = [toChain, fromChain];
            const [_fromToken, _toToken] = [toToken, fromToken];
            setFromChain(_fromChain);
            setToChain(_toChain);
            setFromToken(_fromToken);
            setToToken(_toToken);
            setLimitBera(limitBera === 0 ? 1 : 0);
          }}
        >
          <svg
            className="cursor-pointer"
            width="42"
            height="42"
            viewBox="0 0 42 42"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="2"
              y="2"
              width="38"
              height="38"
              rx="10"
              fill="#BC9549"
              stroke="#FFFDEB"
              stroke-width="4"
            />
            <path
              d="M21.4999 16V26.5M21.4999 26.5L16 21M21.4999 26.5L27 21"
              stroke="black"
              stroke-width="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <TokenAmout
          allTokens={_allTokens}
          isDest={true}
          limitBera={type === "kodiak" ? true : limitBera === 0}
          amount={reciveAmount ?? ""}
          chainList={chainList}
          chain={toChain}
          token={toToken ?? null}
          disabledInput={true}
          onChainChange={(chain: Chain) => {
            setToChain(chain);
          }}
          onTokenChange={(token: Token) => {
            setToToken(token);
          }}
          comingSoon={ComingSoon}
          updateRef={banlanceIndex}
        />

        {
          bridgeType === 'superSwap' && selectedRoute && (
            <div className="flex items-center justify-start gap-2 pt-[17px] lg:pl-[20px] text-[14px] text-[#3D405A]">
              {
                isReverse ? (
                  <div>1 {toToken?.symbol} = {balanceFormated(1 / Number(selectedRoute?.toexchangeRate), 4)} {fromToken?.symbol}</div>
                ) : (
                  <div>1 {fromToken?.symbol} = {balanceFormated(Number(selectedRoute?.toexchangeRate), 4)} {toToken?.symbol}</div>
                )
              }
              <svg onClick={() => setIsReverse(!isReverse)} className="cursor-pointer" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.01514 6.11148C0.887128 4.95763 1.55283 3.03456 3.70343 3.03456C5.85402 3.03456 10.9999 3.03456 10.9999 3.03456M10.9999 3.03456L9.01977 1M10.9999 3.03456L9.01977 5" stroke="black"></path><path d="M10.9849 5.88071C11.1129 7.03456 10.4472 8.95763 8.29657 8.95763C6.14598 8.95763 1.00006 8.95763 1.00006 8.95763M1.00006 8.95763L3.01978 11M1.00006 8.95763L3.01978 7" stroke="black"></path></svg>
            </div>
          )
        }

        {
          bridgeType !== 'superSwap' && <div className="flex items-center justify-between pt-[17px] lg:pl-[20px] text-[14px] text-[#3D405A]">
            <div>Receive address</div>
            <div className="flex items-center gap-2">
              <div>{formatLongText(address, 6, 6)}</div>
            </div>
          </div>
        }


        {routes && routes.length > 0 && toToken && (
          <Routes
            fromChain={fromChain}
            selectedRoute={selectedRoute}
            setSelectedRoute={setSelectedRoute}
            toToken={toToken as Token}
            routes={routes}
          />
        )}

        <SubmitBtn
          text={type === "super-swap" ? "SuperSwap" : "Bridge"}
          fromChainId={fromChain.chainId}
          isLoading={quoteLoading || sendLoading}
          disabled={sendDisabled || !selectedRoute}
          onClick={async () => {
            const result = await executeRoute();
            onCallback?.({
              ...result,
              inputCurrencyAmount: sendAmount,
              inputCurrency: fromToken,
              outputCurrencyAmount: reciveAmount,
              outputCurrency: toToken,
              template: selectedRoute?.bridgeName
            });
            setBanlanceIndex(banlanceIndex + 1);
            if (result?.isSuccess && isShowConfirm) {
              if (type === 'super-swap') {

              } else {
                setConfirmShow(true);
              }

            }
          }}
          comingSoon={ComingSoon}
        />
      </Card>
      {isShowConfirm && (
        <Confirm
          fromChain={fromChain}
          toChain={toChain}
          fromToken={fromToken as Token}
          toToken={toToken as Token}
          amount={sendAmount}
          receiveAmount={reciveAmount ?? ""}
          show={confirmShow}
          onClose={() => {
            setConfirmShow(false);
          }}
          showHistory={() => {
            onShowHistory?.();
          }}
        />
      )}
    </>
  );
}
