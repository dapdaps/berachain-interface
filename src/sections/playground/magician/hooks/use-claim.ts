import { useState } from "react";
import { Room } from "../config";
import useCustomAccount from "@/hooks/use-account";
import { useConnectWallet } from "@/hooks/use-connect-wallet";
import useToast from "@/hooks/use-toast";
import { useDebounceFn, useRequest } from "ahooks";
import { DEFAULT_CHAIN_ID } from "@/configs";
import { Contract } from "ethers";
import { RPS_CONTRACT_ADDRESS, RPS_CONTRACT_ADDRESS_ABI } from "../contract";

export function useClaim(props?: any) {
  const {
    getBetTokenBalance,
    onUserListClaimed,
  } = props ?? {};

  const { accountWithAk, account, chainId, provider } = useCustomAccount();
  const { onConnect, onSwitchChain } = useConnectWallet();
  const toast = useToast();

  const [claimData, setClaimData] = useState<{ open: boolean, room?: Room }>({
    open: false,
    room: void 0,
  });

  const { run: onClaimSuccess } = useDebounceFn(() => {
    getBetTokenBalance();
    onUserListClaimed(claimData.room ?? {});
    onClaimOpen(false);
  }, { wait: 1000 });

  const onClaimOpen = (open?: boolean, room?: Room) => {
    setClaimData((prev) => {
      const _claim = { ...prev };
      _claim.open = open ?? false;
      _claim.room = room;
      return _claim;
    });
  };

  const { runAsync: onClaim, loading: claiming } = useRequest(async () => {
    if (!claimData.room) {
      return;
    }

    if (!account) {
      onConnect();
      return;
    }
    if (chainId !== DEFAULT_CHAIN_ID) {
      onSwitchChain({ chainId: DEFAULT_CHAIN_ID });
      return;
    }

    let toastId = toast.loading({
      title: "Claiming...",
    });
    const signer = provider.getSigner(account);
    const contract = new Contract(RPS_CONTRACT_ADDRESS, RPS_CONTRACT_ADDRESS_ABI, signer);

    // check room status
    try {
      const res = await contract.canClaimTimeout(claimData.room.room_id);
      console.log("%c canClaimTimeout: %o", "color: #007acc;", res);
      if (!res) {
        toast.dismiss(toastId);
        toast.fail({
          title: "Claim failed",
          text: "This room can't be claimed yet",
        });
        return;
      }
    } catch (error: any) {
      console.log("claim check failed: %o", error);
      toast.dismiss(toastId);
      toast.fail({
        title: "Claim failed",
        text: error.message,
      });
      return;
    }

    // claim
    try {
      const tx = await contract.claimTimeout(claimData.room.room_id);
      toast.dismiss(toastId);
      toastId = toast.loading({ title: "Confirming...", chainId, tx: tx.hash });
      const { status, transactionHash } = await tx.wait();
      toast.dismiss(toastId);

      if (status !== 1) {
        toast.fail({
          title: "Claim failed",
          tx: transactionHash,
          chainId,
        });
        return;
      }

      toast.success({
        title: "Claim successful",
        tx: transactionHash,
        chainId,
      });

      // claim done
      onClaimSuccess();
    } catch (error: any) {
      console.log("claim failed: %o", error);
      toast.fail({
        title: "Claim failed",
        text: error.message,
      });
    }
  }, { manual: true });

  return {
    claimData,
    onClaimOpen,
    onClaim,
    claiming,
  };
}
