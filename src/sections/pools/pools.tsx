"use client";

import Bex from "./bex/pools";
import Kodiak from "./kodiak/pools";
import BurrBear from "./burrbear/pools";

const PoolsPanel = ({ dex, ...rest }: any) => {
  if (dex?.toLowerCase() === "bex") return <Bex {...rest} />;
  if (dex?.toLowerCase() === "kodiak") return <Kodiak {...rest} />;
  if (dex?.toLowerCase() === "burrbear") return <BurrBear {...rest} />;
};

export default function Pools({ dapp, dex }: any) {
  return <PoolsPanel dex={dex} dapp={dapp} />;
}
