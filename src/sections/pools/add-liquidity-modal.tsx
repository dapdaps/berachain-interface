"use client";

import { useRef, forwardRef, useState, useEffect } from "react";
import BasicModal from "./components/modal";
import Bex from "./bex/add-liquidity";
import Kodiak from "./kodiak/add-liquidity";
import useIsMobile from "@/hooks/use-isMobile";

const AddLiquidityPanel = forwardRef(({ dex, ...rest }: any, ref: any) => {
  if (dex?.toLowerCase() === "bex") return <Bex {...rest} />;
  if (dex?.toLowerCase() === "kodiak") return <Kodiak {...rest} ref={ref} />;
});

export default function AddLiquidityModal({
  token0,
  token1,
  version,
  dex,
  fee,
  open,
  onClose
}: any) {
  const panelRef = useRef<any>();
  const [hasClearAll, setHasClearAll] = useState<any>();
  const isMobile = useIsMobile();

  useEffect(() => {
    setHasClearAll(!!panelRef.current?.onClearAll);
  }, []);

  return (
    <BasicModal
      title={
        isMobile && version === "v3"
          ? "Set Price Range"
          : `Provide ${token0?.symbol}-${token1?.symbol}`
      }
      dex={dex}
      fee={fee}
      version={version}
      open={open}
      hasClearAll={hasClearAll}
      onClose={onClose}
      onClearAll={() => {
        panelRef.current?.onClearAll();
      }}
    >
      <div className="pb-[20px] md:max-h-[80dvh] md:overflow-y-auto">
        <AddLiquidityPanel
          dex={dex}
          defaultToken0={token0}
          defaultToken1={token1}
          defaultFee={fee}
          version={version}
          ref={panelRef}
          onSuccess={onClose}
        />
      </div>
    </BasicModal>
  );
}
