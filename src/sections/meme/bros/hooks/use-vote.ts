import { useCallback, useState } from "react";
import { post } from "@/utils/http";
import useCustomAccount from "@/hooks/use-account";
import useToast from "@/hooks/use-toast";

export default function useVote(round: number, onSuccess: VoidFunction) {
  const [loading, setLoading] = useState(false);
  const { account, provider } = useCustomAccount();
  const toast = useToast();

  const onVote = useCallback(
    async (address: string) => {
      if (!account || !provider || !address) return;
      let toastId = toast.loading({ title: "Voting..." });
      try {
        setLoading(true);
        const result = await post("/api/meme/vote", {
          round: round,
          token_address: address
        });
        if (result.code === 0) {
          onSuccess();
          toast.dismiss(toastId);
          toast.success({
            title: "Voted successfully!"
          });
        } else {
          throw Error();
        }
      } catch (err) {
        console.log(err);
        toast.dismiss(toastId);
        toast.fail({ title: "Voted faily!" });
      } finally {
        setLoading(false);
      }
    },
    [round, account, provider]
  );

  return { loading, onVote };
}
