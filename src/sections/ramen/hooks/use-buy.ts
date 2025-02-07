import { useState } from "react";
import useToast from "@/hooks/use-toast";
import { TOKENS } from "../config";
import { asyncFetch } from "@/utils/http";
import useCustomAccount from "@/hooks/use-account";
import { useSignMessage } from "wagmi";

export default function useBuy({ detail, amount }: any) {
  const [buying, setBuying] = useState(false);
  const toast = useToast();
  const { account } = useCustomAccount();
  const { data: signature, signMessageAsync } = useSignMessage();

  const fixedBuy = async () => {
    await signMessageAsync({
      message: `You are entering ${amount} entries into the Gacha lottery for this token launch.`
    });
    const res = await asyncFetch(
      `/api.ramen/v1/project/${detail.slug}/lottery/buy`,
      {
        method: "POST",
        body: JSON.stringify({
          amount,
          address: account,
          signature
        })
      }
    );
    return res;
  };

  const buy = async () => {};

  const onBuy = async () => {
    let toastId = toast.loading({ title: "Confirming..." });
    setBuying(true);
    try {
      const token = TOKENS[detail.slug];
      if (token.isFixed) {
        const res = await fixedBuy();
        if (res.status !== "OK") {
          throw Error("");
        }
        toast.dismiss(toastId);
        toast.success("Buy successfully");
        return;
      }
    } catch (err: any) {
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
