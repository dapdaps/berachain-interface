"use client";

import { useRef, forwardRef, useMemo } from "react";
import BasicModal from "./components/modal";
import BeraSwap from "./beraswap/add-liquidity";
import Kodiak from "./kodiak/increase-liquidity";

const AddLiquidityPanel = forwardRef(({ dex, ...rest }: any, ref: any) => {
  if (dex?.toLowerCase() === "bex") return <BeraSwap {...rest} />;
  if (dex?.toLowerCase() === "kodiak") return <Kodiak {...rest} ref={ref} />;
});

export default function IncreaseLiquidityModal({
  dex,
  open,
  title,
  data,
  onClose,
  onSuccess
}: any) {
  const panelRef = useRef<any>();

  const mergedTitle = useMemo(() => {
    if (title) return title;
    if (data.token0 && data.token1)
      return `Provide ${data.token0.symbol}-${data.token1.symbol}`;
    return `Provide ${data.symbol}`;
  }, [data, title]);

  const params = useMemo(() => {
    if (dex?.toLowerCase() === "bex") return { data };
    return {
      defaultToken0: data.token0,
      defaultToken1: data.token1,
      defaultFee: data.fee,
      ...data
    };
  }, [data, dex]);

  return (
    <BasicModal
      title={mergedTitle}
      dex={dex}
      fee={data.fee}
      version={data.version}
      open={open}
      onClose={onClose}
      onClearAll={panelRef?.current?.onClearAll}
    >
      <div className="pb-[20px] md:max-h-[80dvh] md:overflow-y-auto">
        <AddLiquidityPanel
          dex={dex}
          ref={panelRef}
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
