"use client";

import Bex from "./beraswap/pools";
import Kodiak from "./kodiak/pools";

const PoolsPanel = ({ dex, ...rest }: any) => {
  if (dex?.toLowerCase() === "bex") return <Bex {...rest} />;
  if (dex?.toLowerCase() === "kodiak") return <Kodiak {...rest} />;
};

export default function Pools({ dex }: any) {
  return <PoolsPanel dex={dex} />;
}
