"use client";

import Bex from "./bex/yours";
import Kodiak from "./kodiak/yours";
import BurrBear from "./burrbear/yours";
const Panel = ({ dex, ...rest }: any) => {
  if (dex?.toLowerCase() === "bex") return <Bex {...rest} />;
  if (dex?.toLowerCase() === "kodiak") return <Kodiak {...rest} />;
  if (dex?.toLowerCase() === "burrbear") return <BurrBear {...rest} />;
};

export default function Yours({ dex }: any) {
  return <Panel dex={dex} />;
}
