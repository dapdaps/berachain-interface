"use client";

import SwapView from "@/sections/swap";
import { useParams } from "next/navigation";
import dapps from "@/configs/swap";
import { DEFAULT_SWAP_DAPP, DEFAULT_CHAIN_ID } from "@/configs";
import useDexTokens from "@/hooks/use-dex-tokens";
import { useMemo } from "react";

export default function SwapPage() {
  const urlParams = useParams();
  const dapp = dapps[urlParams.dapp as string] || dapps[DEFAULT_SWAP_DAPP];
  const tokens = useDexTokens(dapp);

  const dappConfig = useMemo(
    () => ({
      ...dapp,
      tokens: {
        [DEFAULT_CHAIN_ID]: tokens
      }
    }),
    [dapp, tokens]
  );

  return <SwapView dapp={dappConfig} />;
}
