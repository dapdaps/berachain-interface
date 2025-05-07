"use client";

import BasicModal from "./components/modal";
import Bex from "./bex/remove-liquidity";
import Kodiak from "./kodiak/remove-liquidity";
import BurrBear from "./burrbear/remove-liquidity";
import { useMemo } from "react";

const RemoveLiquidityPanel = ({ dex, ...rest }: any) => {
  if (dex?.toLowerCase() === "bex") return <Bex {...rest} />;
  if (dex?.toLowerCase() === "kodiak") return <Kodiak {...rest} />;
  if (dex?.toLowerCase() === "burrbear") return <BurrBear {...rest} />;
};

export default function RemoveLiquidityModal({
  dex,
  open,
  data,
  tokenId,
  onClose,
  onSuccess
}: any) {
  const mergedTitle = useMemo(() => {
    if (data.token0 && data.token1)
      return `Remove ${data.token0.symbol}-${data.token1.symbol}`;
    return `Remove ${data.symbol}`;
  }, [data]);
  const params = useMemo(() => {
    if (["bex", "burrbear"].includes(dex?.toLowerCase())) return { data };
    return {
      tokenId,
      ...data,
      version: data.version
    };
  }, [data, dex, tokenId]);
  return (
    <BasicModal
      title={mergedTitle}
      dex={dex}
      fee={data.fee}
      version={data.version}
      open={open}
      onClose={onClose}
    >
      <div className="pb-[20px]">
        <RemoveLiquidityPanel
          dex={dex}
          onSuccess={() => {
            onSuccess();
            onClose();
          }}
          {...params}
        />
      </div>
    </BasicModal>
  );
}
