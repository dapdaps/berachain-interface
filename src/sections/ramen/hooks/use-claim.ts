import useCustomAccount from "@/hooks/use-account";
import useToast from "@/hooks/use-toast";
import { useState } from "react";

export default function useClaim() {
  const [loading, setLoading] = useState(false);
  const { account } = useCustomAccount();
  const toast = useToast();

  const onClaim = async () => {
    let toastId = toast.loading({ title: "Confirming..." });
    setLoading(true);
    try {
      toast.dismiss(toastId);
      toast.success("Buy successfully");
      return;
    } catch (err: any) {
      toast.dismiss(toastId);
      toast.fail({
        title: err?.message?.includes("user rejected transaction")
          ? "User rejected transaction"
          : `Buy failed!`
      });
    } finally {
      setLoading(false);
    }
  };

  return { loading, onClaim };
}
