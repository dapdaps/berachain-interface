"use client";

import { useSwitchChain } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import useAccount from "@/hooks/use-account";
import { DEFAULT_CHAIN_ID } from "@/configs";
import LightButton from "@/components/check-in/button";
import Loading from "@/components/loading";

interface ActionBtnProps {
  onPlay?: (tier: number) => void;
  loading?: boolean;
  tier?: number;
}

export default function ActionBtn({ onPlay, loading, tier = 0 }: ActionBtnProps) {
  const { isPending: switching, switchChain } = useSwitchChain();
  const { openConnectModal } = useConnectModal();
  const { account, chainId } = useAccount();

  if (!account || !chainId) {
    return (
      <LightButton
        className="w-full h-[60px]"
        onClick={() => {
          openConnectModal?.();
        }}
      >
        Connect wallet
      </LightButton>
    );
  }

  if (chainId !== DEFAULT_CHAIN_ID) {
    return (
      <LightButton
        className="w-full h-[60px]"
        onClick={() => {
          switchChain({
            chainId: DEFAULT_CHAIN_ID
          });
        }}
        disabled={switching}
      >
        {switching ? <Loading size={20} /> : "Switch Network"}
      </LightButton>
    );
  }

  return (
    <LightButton
      className="w-full h-[60px]"
      onClick={() => {
        onPlay?.(tier);
      }}
      disabled={loading}
    >
      {loading ? <Loading size={20} /> : "PLAY"}
    </LightButton>
  );
}
