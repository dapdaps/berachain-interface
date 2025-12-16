import axios, { type AxiosInstance } from "axios";
import Big from "big.js";
import { ONECLICK_PROXY, ONECLICK_PROXY_ABI } from "./contract";
import { numberRemoveEndZero } from "@/utils/number-formatter";
import { getPrice } from "@/utils/formatMoney";
import { DEFAULT_GAS_LIMIT } from "@/sections/bridge/lib/bridges/oneclick/wallet";
import { ZeroAddress } from "@/hooks/use-add-action";

export const BridgeFee = [
  {
    recipient: "reffer.near",
    // No bridge fee will be charged temporarily
    fee: 0, // 100=1% 1=0.01%
  },
];

const excludeFees: string[] = ["sourceGasFeeUsd"];

class OneClickService {
  private api: AxiosInstance;
  private offsetTime = 1000 * 60 * 30;
  constructor() {
    this.api = axios.create({
      baseURL: "https://1click.chaindefuser.com/v0",
      timeout: 30000,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  public async quote(params: {
    wallet: any,
    fromToken: any,
    toToken: any,
    dry: boolean;
    slippageTolerance: number;
    originAsset: string;
    destinationAsset: string;
    amount: string;
    refundTo: string;
    refundType: "ORIGIN_CHAIN";
    recipient: string;
    connectedWallets?: string[];
  }) {
    const res = await this.api.post("/quote", {
      depositMode: "SIMPLE",
      swapType: "EXACT_INPUT",
      depositType: "ORIGIN_CHAIN",
      sessionId: `session_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      recipientType: "DESTINATION_CHAIN",
      deadline: new Date(Date.now() + this.offsetTime).toISOString(),
      quoteWaitingTimeMs: 3000,
      appFees: BridgeFee,
      referral: "stableflow",
      ...params,
      // delete params
      wallet: void 0,
      fromToken: void 0,
      toToken: void 0,
      prices: void 0,
    });

    if (res.data) {
      res.data.estimateTime = res.data?.quote?.timeEstimate; // seconds
      res.data.outputAmount = numberRemoveEndZero(Big(res.data?.quote?.amountOut || 0).div(10 ** params.toToken.decimals).toFixed(params.toToken.decimals, 0));

      try {
        res.data.fees = {
          bridgeFeeUsd: numberRemoveEndZero(Big(res.data?.quote?.amountInUsd || 0).minus(res.data?.quote?.amountOutUsd || 0).toFixed(20)),
        };

        try {
          const sourceGasFee = await params.wallet.estimateTransferGas({
            originAsset: params.fromToken.contractAddress,
            depositAddress: res.data?.quote?.depositAddress,
            amount: params.amount,
          });
          const sourceGasFeeUsd = Big(sourceGasFee.estimateGas || 0).div(10 ** params.fromToken.nativeToken.decimals).times(getPrice(params.wallet.prices, params.fromToken.nativeToken.symbol));
          res.data.fees.sourceGasFeeUsd = numberRemoveEndZero(Big(sourceGasFeeUsd).toFixed(20));
          res.data.estimateSourceGas = sourceGasFee.estimateGas;
          res.data.estimateSourceGasUsd = numberRemoveEndZero(Big(sourceGasFeeUsd).toFixed(20));
        } catch (err) {
          const { usd, wei } = await params.wallet.getEstimateGas({
            gasLimit: DEFAULT_GAS_LIMIT,
            price: getPrice(params.wallet.prices, params.fromToken.nativeToken.symbol),
            nativeToken: params.fromToken.nativeToken,
          });
          res.data.fees.sourceGasFeeUsd = usd;
          res.data.estimateSourceGas = wei;
          res.data.estimateSourceGasUsd = usd;
        }

        // calculate total fees
        for (const feeKey in res.data.fees) {
          if (excludeFees.includes(feeKey)) {
            continue;
          }
          res.data.totalFeesUsd = Big(res.data.totalFeesUsd || 0).plus(res.data.fees[feeKey] || 0);
        }
        res.data.totalFeesUsd = numberRemoveEndZero(Big(res.data.totalFeesUsd).toFixed(20));

      } catch (error) {
        console.log("oneclick estimate failed: %o", error);
      }

      const proxyAddress = ONECLICK_PROXY[params.fromToken.chainName];
      const isNativeToken = params.fromToken.contractAddress === ZeroAddress;
      if (proxyAddress && !isNativeToken) {
        const proxyResult = await params.wallet.quoteOneClickProxy({
          proxyAddress,
          abi: ONECLICK_PROXY_ABI,
          fromToken: params.fromToken,
          refundTo: params.refundTo,
          recipient: params.recipient,
          amountWei: params.amount,
          prices: params.wallet.prices,
          depositAddress: res.data?.quote?.depositAddress,
        });

        for (const proxyKey in proxyResult) {
          if (proxyKey === "fees") {
            for (const feeKey in proxyResult.fees) {
              if (excludeFees.includes(feeKey)) {
                continue;
              }
              res.data.fees[feeKey] = proxyResult.fees[feeKey];
            }
            continue;
          }
          res.data[proxyKey] = proxyResult[proxyKey];
        }
      }
    }

    return res;
  }

  public async send(params: any) {
    const {
      wallet,
      fromToken,
      depositAddress,
      amountWei,
      sendParam,
    } = params;

    // proxy transfer
    if (sendParam) {
      const tx = await wallet.sendTransaction(sendParam);
      return tx;
    }

    const hash = await wallet.transfer({
      originAsset: fromToken.contractAddress,
      depositAddress: depositAddress,
      amount: amountWei,
    });
    return hash;
  }

  public async submitHash(params: { txHash: string; depositAddress: string }) {
    return await this.api.post("/deposit/submit", params);
  }

  public async getStatus(params: {
    depositAddress: string;
    depositMemo?: string;
  }) {
    return await this.api.get("/status", { params });
  }

  public async getTokens() {
    return await this.api.get("/tokens");
  }
}

export default new OneClickService();
