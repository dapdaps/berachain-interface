"use client";

import { useRef, forwardRef, useState, useEffect, useMemo } from "react";
import BasicModal from "./components/modal";
import Bex from "./bex/add-liquidity";
import Kodiak from "./kodiak/add-liquidity";
import BurrBear from "./burrbear/add-liquidity";
import useIsMobile from "@/hooks/use-isMobile";
import AquaBeraConfig from "@/configs/staking/dapps/aquabera";
import Big from 'big.js';
import { DEFAULT_CHAIN_ID } from '@/configs';
import AquaBeraContent from '@/sections/staking/Bridge/Modal/content';

const AddLiquidityPanel = forwardRef(({ dex, ...rest }: any, ref: any) => {
  if (dex?.toLowerCase() === "bex") {
    return (
      <Bex {...rest} />
    );
  }
  if (dex?.toLowerCase() === "kodiak") {
    return (
      <Kodiak {...rest} ref={ref} />
    );
  }
  if (dex?.toLowerCase() === "burrbear") {
    return (
      <BurrBear {...rest} ref={ref} />
    );
  }
  if (dex?.toLowerCase() === "aquabera") {
    return (
      <AquaBeraContent
        className="!border-0 !w-full !p-0 !shadow-[unset]"
        title={null}
        {...rest}
        ref={ref}
      />
    );
  }
});

export default function AddLiquidityModal(props: any) {
  const {
    dex,
    open,
    onClose,
    onSuccess,
    data,
    ...rest
  } = props;

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
    if (["bex", "burrbear"].includes(dex?.toLowerCase())) return { data };
    if (["aquabera"].includes(dex?.toLowerCase())) {
      const _chains: any = AquaBeraConfig["chains"];
      return {
        ...data,
        config: { ..._chains[DEFAULT_CHAIN_ID] },
        data: {
          pool: {
            apr: Big(data.totalApy || 0).times(7).div(365).toNumber(),
            balance: data.balance || 10,
            chainTopTokens: [
              data.tokens[1],
              data.tokens[0],
            ],
            ichiAddress: data.pool_address,
            id: data.name,
            platform: dex?.toLowerCase(),
            tokens: data.tokens,
            tvl: data.tvl,
            usdDepositAmount: data.user_stake ? data.user_stake.usd : 0,
            values: ["0", "0"],
            yourValue: "0"
          },
          token0: {
            ...data.tokens[0],
          },
          token1: {
            ...data.tokens[1],
          },
        },
        show: true,
        type: 0,
      };
    }
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
