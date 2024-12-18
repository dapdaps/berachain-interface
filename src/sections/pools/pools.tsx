"use client";

import Bex from "./bex/pools";
import Kodiak from "./kodiak/pools";
import Burrbear from "./burrbear/pools";

const PoolsPanel = ({ dex, ...rest }: any) => {
  if (dex?.toLowerCase() === "bex") return <Bex {...rest} />;
  if (dex?.toLowerCase() === "kodiak") return <Kodiak {...rest} />;
  if (dex?.toLowerCase() === "burrbear") return <Burrbear {...rest} />;
};

export default function Pools({ dex }: any) {
  return <PoolsPanel dex={dex} />;
}
