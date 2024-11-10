"use client";

import { useRef, forwardRef } from "react";
import BasicModal from "./components/modal";
import Bex from "./bex/add-liquidity";
import Kodiak from "./kodiak/increase-liquidity";

const AddLiquidityPanel = forwardRef(({ dex, ...rest }: any, ref: any) => {
  if (dex?.toLowerCase() === "bex") return <Bex {...rest} />;
  if (dex?.toLowerCase() === "kodiak") return <Kodiak {...rest} ref={ref} />;
});

export default function IncreaseLiquidityModal({
  token0,
  token1,
  version,
  dex,
  fee,
  open,
  tokenId,
  title,
  onClose
}: any) {
  const panelRef = useRef<any>();
  return (
    <BasicModal
      title={title || `Provide ${token0?.symbol}-${token1?.symbol}`}
      dex={dex}
      fee={fee}
      version={version}
      open={open}
      onClose={onClose}
      onClearAll={panelRef?.current?.onClearAll}
    >
      <div className="pb-[20px]">
        <AddLiquidityPanel
          dex={dex}
          defaultToken0={token0}
          defaultToken1={token1}
          defaultFee={fee}
          version={version}
          ref={panelRef}
          tokenId={tokenId}
          onSuccess={onClose}
        />
      </div>
    </BasicModal>
  );
}
