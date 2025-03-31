import { Contract } from "ethers";
import { useCallback, useState } from "react";
import useCustomAccount from "@/hooks/use-account";
import useToast from "@/hooks/use-toast";
import useAddAction from "@/hooks/use-add-action";
import vaultAbi from "../../vaults/dapps/bex/bex-vault";
import { DEFAULT_CHAIN_ID } from "@/configs";

export default function useStake(pool: any, onSuccess: Function) {
  const [loading, setLoading] = useState(false);
  const { account, provider } = useCustomAccount();
  const toast = useToast();
  const { addAction } = useAddAction("dapp");

  const onStake = useCallback(
    async (amount: string) => {
      if (!amount || !pool) return;
      let toastId = toast.loading({ title: "Confirming..." });
      try {
        setLoading(true);
        const signer = provider.getSigner(account);
        const VaultContract = new Contract(pool.vaultAddress, vaultAbi, signer);
        const tx = await VaultContract.stake(amount);
        toast.dismiss(toastId);
        toastId = toast.loading({ title: "Pending..." });
        const { status, transactionHash } = await tx.wait();
        if (status === 1) {
          toast.success({
            title: "Stake successful!",
            tx: transactionHash,
            chainId: DEFAULT_CHAIN_ID
          });
          onSuccess();
        } else {
          toast.fail({ title: "Stake failed!" });
        }
        addAction?.({
          type: "Staking",
          action: "Stake",
          token: pool.token,
          amount,
          template: "Bex",
          add: false,
          status,
          transactionHash,
          sub_type: "Stake",
          tokens: [pool.token],
          amounts: [amount],
          extra_data: {}
        });
        setLoading(false);
      } catch (err: any) {
        toast.dismiss(toastId);
        setLoading(false);
        toast.fail({
          title: err?.message?.includes("user rejected transaction")
            ? "User rejected transaction"
            : `Unstake failed!`
        });
      }
    },
    [pool]
  );

  return { loading, onStake };
}
