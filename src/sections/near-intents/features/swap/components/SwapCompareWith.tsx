import { getEVMChainId } from "@/sections/near-intents/utils/evmChainId";
import getTokenUsdPrice from "@/sections/near-intents/utils/getTokenUsdPrice";
import { objectToQueryString } from "@/utils/http";
import { numberFormatter } from "@/utils/number-formatter";
import Big from "big.js";
import { ethers } from "ethers";
import { memo, useEffect, useMemo, useState } from "react";


const NATIVE_CHAIN_ADDRESS = {
  berachain: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  solana: "So11111111111111111111111111111111111111112",

}
export default memo(function SwapCompareWith({
  tokenIn,
  tokenOut,
  amountIn,
  amountOut,
  usdAmountOut,
  tokensUsdPriceData
}) {
  const [gunAmountOut, setGunAmountOut] = useState("")

  async function handleQueryGunAmountOut() {
    try {
      const _inToken = tokenIn?.groupedTokens?.[0] ?? tokenIn
      const _outToken = tokenOut?.groupedTokens?.[0] ?? tokenOut
      const srcChain = getEVMChainId(_inToken?.chainName)
      const destChain = getEVMChainId(_outToken?.chainName)
      const srcToken = _inToken?.type === "native" ? NATIVE_CHAIN_ADDRESS[_inToken?.chainName] : _inToken?.address
      const destToken = _outToken?.type === "native" ? NATIVE_CHAIN_ADDRESS[_outToken?.chainName] : _outToken?.address
      const amount = ethers.utils.parseUnits(Big(amountIn ? amountIn : 0).toFixed(_inToken?.decimals), _inToken?.decimals)
      const other = srcChain === 7565164 ? {
        "senderAddress": "7hkTCa27atsc9fyNLoPjeft2AnkxXGD8uzBV8V7JWQDt",
        "affiliateWallet": "C3GUQuUmjzkXw9WWePEhRWSPKMRpW4dsm13D2DuuC7sL",
        "dstChainOrderAuthorityAddress": "0x88A179ab23CA1F5D942AB23C10a0CA37B6b785Ac",
        "destinationAddress": "0x88A179ab23CA1F5D942AB23C10a0CA37B6b785Ac"
      } : (destChain === 7565164 ? {
        "senderAddress": "0x88A179ab23CA1F5D942AB23C10a0CA37B6b785Ac",
        "affiliateWallet": "0xd5359Cc56362EEd1f69Db0b00711407249B4785C",
        "dstChainOrderAuthorityAddress": "7hkTCa27atsc9fyNLoPjeft2AnkxXGD8uzBV8V7JWQDt",
        "destinationAddress": "7hkTCa27atsc9fyNLoPjeft2AnkxXGD8uzBV8V7JWQDt"
      } : {
        "senderAddress": "0x88A179ab23CA1F5D942AB23C10a0CA37B6b785Ac",
        "affiliateWallet": "0xd5359Cc56362EEd1f69Db0b00711407249B4785C",
        "dstChainOrderAuthorityAddress": "0x88A179ab23CA1F5D942AB23C10a0CA37B6b785Ac",
        "destinationAddress": "0x88A179ab23CA1F5D942AB23C10a0CA37B6b785Ac",
      })

      const queryStr = objectToQueryString({
        srcChain,
        destChain,
        srcToken,
        destToken,
        amount,
        slippage: 1,
        affiliateFee: 0.1,
        ...other
      })
      const response = await fetch("https://dextra-node-825534211396.us-central1.run.app/v2/quote?" + queryStr, {
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY
        }
      })
      const result = await response.json()
      if (result?.error) {
        throw new Error(result?.error)
      } else {
        setGunAmountOut(ethers.utils.formatUnits(result?.outputAmount?.value ?? 0, result?.outputAmount?.decimals ?? 18))
      }
    } catch (error) {
      setGunAmountOut("")
      throw new Error(error)
    }
  }
  const usdGunAmountOut = useMemo(() => gunAmountOut ? (
    getTokenUsdPrice(
      gunAmountOut,
      tokenOut,
      tokensUsdPriceData
    )
  ) : 0, [gunAmountOut])
  const saved = useMemo(() => Big(usdAmountOut ? usdAmountOut : 0).minus(usdGunAmountOut ? usdGunAmountOut : 0).toFixed(), [usdAmountOut, usdGunAmountOut])
  const gapPercentage = useMemo(() => Big(saved).div(usdAmountOut ? usdAmountOut : 1).times(100).toFixed(), [saved, usdAmountOut])

  useEffect(() => {
    if (tokenIn && tokenOut && Number(amountIn) > 0) {
      handleQueryGunAmountOut()
    }
  }, [tokenIn, tokenOut, amountIn])

  console.log('====gunAmountOut', gunAmountOut)

  return gunAmountOut && Big(saved).gt(0) ? (
    <div className="flex flex-col gap-[5px] mb-[20px]">
      <div className="text-black text-[12px] font-medium">Compare with</div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[3px]">
          <div className="w-[20px]">
            <img src="/images/campaign/gun.svg" alt="gun" />
          </div>
          <div className=" text-black text-[12px] font-medium">{numberFormatter(gunAmountOut ? gunAmountOut : 0, 3, true)}</div>
          <div className="text-[#8D8D8D] text-[12px] font-medium">~{numberFormatter(usdGunAmountOut ? usdGunAmountOut : 0, 2, true, { prefix: "$" })}</div>
          <div className="text-[#FF4649] text-[12px] font-medium"> (-{numberFormatter(gapPercentage, 1, true)}%)</div>
        </div>
        <div className="text-black text-[12px] font-medium">You saved <span className="text-[#7EA82B] font-bold">{numberFormatter(saved, 2, true, { prefix: "$" })}</span> by using Bintent</div>
      </div>
    </div>
  ) : <></>
})
