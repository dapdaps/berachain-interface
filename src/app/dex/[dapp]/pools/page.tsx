"use client";

import PoolsView from "@/sections/pools";
import { useParams } from "next/navigation";
import dapps from "@/configs/swap";
import pools from "@/configs/pools";
import { DEFAULT_SWAP_DAPP } from "@/configs";

export default function SwapPage() {
  const urlParams = useParams();
  const dapp = dapps[urlParams.dapp as string] || dapps[DEFAULT_SWAP_DAPP];
  const config = pools[urlParams.dapp as string] || pools[DEFAULT_SWAP_DAPP];
  return <PoolsView dapp={{ ...dapp, poolConfig: config }} />;
}
