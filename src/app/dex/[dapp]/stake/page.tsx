"use client";

import StakeView from "@/sections/dex-stake";
import { useParams } from "next/navigation";
import dapps from "@/configs/dex-stake";
import { DEFAULT_SWAP_DAPP, DEFAULT_CHAIN_ID } from "@/configs";
import { useMemo } from "react";

export default function SwapPage() {
  const urlParams = useParams();
  const dapp = dapps[urlParams.dapp as string] || dapps[DEFAULT_SWAP_DAPP];

  const dappConfig = useMemo(
    () => ({
      ...dapp,
    }),
    [dapp]
  );

  return <StakeView dapp={dappConfig} />;
}
