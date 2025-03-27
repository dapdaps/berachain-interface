"use client";

import { useRef, forwardRef, useState, useEffect, useMemo } from "react";
import BasicModal from "./components/modal";
import Bex from "./bex/add-liquidity";
import Kodiak from "./kodiak/add-liquidity";
import useIsMobile from "@/hooks/use-isMobile";

const AddLiquidityPanel = forwardRef(({ dex, ...rest }: any, ref: any) => {
  if (dex?.toLowerCase() === "bex") return <Bex {...rest} />;
  if (dex?.toLowerCase() === "kodiak") return <Kodiak {...rest} ref={ref} />;
});

export default function AddLiquidityModal({
  dex,
  open,
  onClose,
  onSuccess,
  data,
  ...rest
}: any) {
  const panelRef = useRef<any>();
  const [hasClearAll, setHasClearAll] = useState<any>();
  const isMobile = useIsMobile();

  useEffect(() => {
    setHasClearAll(!!panelRef.current?.onClearAll);
  }, []);

  const title = useMemo(() => {
    if (isMobile && data.version === "v3") return "Set Price Range";
    if (data.token0 && data.token1)
      return `Provide ${data.token0.symbol}-${data.token1.symbol}`;
    return `Provide ${data.symbol || data.token.symbol}`;
  }, [isMobile, data]);

  const params = useMemo(() => {
    if (dex?.toLowerCase() === "bex") return { data };
    return {
      ...data,
      defaultToken0: data.token0 || data.tokens?.[0],
      defaultToken1: data.token1 || data.tokens?.[1],
      defaultFee: data.fee,
      version: data.version
    };
  }, [data, dex]);

  return (
    <BasicModal
      title={title}
      dex={dex}
      fee={data.fee}
      version={data.version}
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
          ref={panelRef}
          onSuccess={() => {
            onClose();
            onSuccess?.();
          }}
          {...params}
          {...rest}
        />
      </div>
    </BasicModal>
  );
}
