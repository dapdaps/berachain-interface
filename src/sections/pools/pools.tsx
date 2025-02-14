"use client";

import BeraSwap from "./beraswap/pools";
import Kodiak from "./kodiak/pools";

const PoolsPanel = ({ dex, ...rest }: any) => {
  if (dex?.toLowerCase() === "beraswap") return <BeraSwap {...rest} />;
  if (dex?.toLowerCase() === "kodiak") return <Kodiak {...rest} />;
};

export default function Pools({ dex }: any) {
  return <PoolsPanel dex={dex} />;
}
