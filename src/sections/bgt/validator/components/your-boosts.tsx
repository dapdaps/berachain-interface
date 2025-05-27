import { BGT_ADDRESS } from "@/hooks/use-bgt";
import { memo, useEffect, useState } from "react";
import { BGT_ABI } from "@/sections/bgt/abi";
import useCustomAccount from "@/hooks/use-account";
import { ethers } from "ethers";
import { numberFormatter } from "@/utils/number-formatter";
import { usePriceStore } from "@/stores/usePriceStore";
import Big from "big.js";
import Skeleton from "react-loading-skeleton";

export default memo(function YourBoosts({
  pageData
}) {
  const prices: any = usePriceStore(store => store.price);
  const { account, provider } = useCustomAccount()
  const [loading, setLoading] = useState(true)

  const [boosts, setBoosts] = useState(0)
  async function getBoosts() {
    try {
      const contract = new ethers.Contract(BGT_ADDRESS, BGT_ABI, provider);
      setLoading(true)
      const response = await contract?.boosted(account, pageData?.pubkey)
      setBoosts(ethers.utils.formatUnits(response))
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }
  useEffect(() => {
    account && provider && pageData && getBoosts()
  }, [account, pageData, provider])
  return (
    <div className="flex flex-col gap-4">
      <div className="text-xl font-semibold">Your Boosts</div>
      {
        account ? (
          <div className="flex items-center justify-between font-medium leading-6">
            {
              loading ? (
                <Skeleton width={36} />
              ) : (
                <div className="flex items-center gap-[8px]">
                  <div className="w-[24px]">
                    <img src="/images/dapps/infrared/bgt.svg" alt="bgt" />
                  </div>
                  <span className="text-black">
                    {numberFormatter(boosts, 2, true, { isShort: true })} BGT
                  </span>
                </div>
              )
            }
            <span className="text-[#3D405A]">{numberFormatter(Big(boosts).times(prices?.["iBGT"] ?? 0).toFixed(), 2, true, { isShort: true, prefix: "$" })}</span>
          </div>
        ) : <></>
      }
    </div>
  )
})
