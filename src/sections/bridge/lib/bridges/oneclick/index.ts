import { ExecuteRequest, FeeType, QuoteRequest } from "../../type";
import { ChainMap } from "./config";
import oneClickService from "@/sdk/oneclick";
import { numberFormatter } from "@/utils/number-formatter";
import { setQuote } from "../../util/routerController";
import { Signer } from "ethers";
import Big from "big.js";

const formatQuoteParams = (quoteRequest: QuoteRequest, isDry: boolean): any => {
  const onclickTokens = sessionStorage.getItem("oneclick-tokens");
  const onclickTokensState = onclickTokens ? JSON.parse(onclickTokens) : {};
  const onclickTokensList = onclickTokensState.state?.tokens || [];

  const originChain = ChainMap[quoteRequest.fromChainId];
  const destinationChain = ChainMap[quoteRequest.toChainId];

  const originToken = onclickTokensList.find((token: any) => token.blockchain === originChain.blockchain && token.contractAddress.toLowerCase() === quoteRequest.fromToken.address.toLowerCase());
  const destinationToken = onclickTokensList.find((token: any) => token.blockchain === destinationChain.blockchain && token.contractAddress.toLowerCase() === quoteRequest.toToken.address.toLowerCase());

  if (!originToken || !destinationToken) {
    throw new Error("Oneclick not support this token pair");
  }

  return {
    wallet: quoteRequest.wallet,
    fromToken: {
      ...originToken,
      chainName: originChain.chainName,
      nativeToken: originChain.nativeToken,
    },
    toToken: {
      ...destinationToken,
      chainName: destinationChain.chainName,
      nativeToken: destinationChain.nativeToken,
    },
    dry: isDry,
    slippageTolerance: 50,
    originAsset: originToken.assetId,
    destinationAsset: destinationToken.assetId,
    amount: Big(quoteRequest.amount || 0).toFixed(0),
    refundTo: quoteRequest.fromAddress,
    refundType: "ORIGIN_CHAIN",
    recipient: quoteRequest.destAddress,
  };
};

export async function getQuote(quoteRequest: QuoteRequest, signer: any): Promise<any> {
  const quoteParams = formatQuoteParams(quoteRequest, true);

  const response = await oneClickService.quote(quoteParams);

  const quote = response.data ?? {};

  console.log("%cQuote result: %o", "background:#016B61;color:#fff;", quote);
  const uuid = setQuote({
    route: quote,
    amount: quoteRequest.amount,
    isNative: false,
    bridgeType: 'Oneclick',
  })

  return {
    uuid,
    quote,
    icon: '/images/logo-stableflow.svg',
    bridgeName: 'Stableflow',
    bridgeType: 'Oneclick',
    fee: quote.totalFeesUsd,
    receiveAmount: quote.quote?.amountOut,
    gas: quote.estimateSourceGasUsd,
    duration: numberFormatter(quote.estimateTime / 60, 2, true),
    feeType: FeeType.usd,
    gasType: FeeType.usd,
    identification: quoteRequest.identification,
  };
}

export async function execute(request: ExecuteRequest, signer: Signer, options?: { quoteRequest?: QuoteRequest; route?: any; }): Promise<any> {
  const { quoteRequest, route } = options ?? {};

  const quoteParams = formatQuoteParams(quoteRequest as QuoteRequest, false);

  const response = await oneClickService.quote(quoteParams);

  const quote = response.data ?? {};

  // proxy transfer
  if (quote.sendParam) {
    // check allowance
    if (quote.needApprove && quote.approveSpender) {
      // check is from ethereum erc20
      if (quoteParams.fromToken.chainName === "Ethereum") {
        const allowance = await quoteRequest?.wallet.allowance({
          contractAddress: quoteParams.fromToken.contractAddress,
          spender: quote.approveSpender,
          address: quoteParams.refundTo,
          amountWei: quoteParams.amount,
        });
        // if allowance is not enough, reset allowance first
        if (Big(allowance.allowance || 0).gt(0) && allowance.needApprove) {
          await quoteRequest?.wallet.approve({
            contractAddress: quoteParams.fromToken.contractAddress,
            spender: quote.approveSpender,
            amountWei: "0",
          });
        }
      }
      const res = await quoteRequest?.wallet.approve({
        contractAddress: quoteParams.fromToken.contractAddress,
        spender: quote.approveSpender,
        amountWei: quoteParams.amount,
        isCheckAllowance: true,
      });
      if (!res) {
        throw new Error("Insufficient allowance");
      }
    }

    const hash = await quoteRequest?.wallet.sendTransaction(quote.sendParam);
    return { hash, depositAddress: quote.sendParam.param[1] };
  }

  // transfer to deposit address
  const hash = await quoteRequest?.wallet.transfer({
    originAsset: quoteRequest.fromToken.address,
    depositAddress: quote.quote?.depositAddress,
    amount: quoteParams.amount,
  });
  return { hash, depositAddress: quote.quote?.depositAddress };
}

export async function getStatus(params: any) {
  if (!params.depositAddress) {
    return { status: 0 };
  }
  const result = await oneClickService.getStatus({
    depositAddress: params.depositAddress,
  });
  const status = result.data.status;
  return status === "SUCCESS" ? { status: 1 } : { status: 0 };
}
