import { useState } from "react";
import useToast from "@/hooks/use-toast";
import useCustomAccount from "@/hooks/use-account";
import { asyncFetch } from "@/utils/http";
import { utils } from "ethers";
import Big from "big.js";

export default function useBuy({ amount, spendToken, tokenBidPrice }: any) {
  const [buying, setBuying] = useState(false);
  const toast = useToast();
  const { account } = useCustomAccount();

  const onBuy = async () => {
    let toastId = toast.loading({ title: "Confirming..." });
    setBuying(true);
    try {
      const amountWithDecimals = Big(amount)
        .mul(10 ** spendToken.decimals)
        .toFixed(0);
      const signatureRes = await asyncFetch(
        "/api.ramen/v1/project/2/generate-bid-signature",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            address: account,
            spend_amount: amountWithDecimals
          })
        }
      );
      const signature = signatureRes.data.signature;
      if (!signature) throw Error("");
      const entryRes = await asyncFetch(
        "https://api-production-8b39.up.railway.app/encrypt/2",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Auction-House": "0xba0000907c7812aec8f7e9e27aeff4ea7565a8ba",
            "X-Chain-Id": 80094
          },
          body: JSON.stringify({
            amount: utils.hexZeroPad(
              utils.hexlify(utils.parseEther(amount)),
              32
            ),
            amount_out: utils.hexZeroPad(
              utils.hexlify(
                utils.parseEther(Big(amount).div(tokenBidPrice).toString())
              ),
              32
            ),
            bidder: account
          })
        }
      );
      if (!entryRes) throw Error("");
      const { ciphertext, x, y } = entryRes;
      toast.dismiss(toastId);
      toast.success("Buy successfully");
      return;
    } catch (err: any) {
      console.log("err", err);
      toast.dismiss(toastId);
      toast.fail({
        title: err?.message?.includes("user rejected transaction")
          ? "User rejected transaction"
          : `Buy failed!`
      });
    } finally {
      setBuying(false);
    }
  };

  return { buying, onBuy };
}
