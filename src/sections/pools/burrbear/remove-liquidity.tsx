"use client";

import { memo, useMemo, useState } from "react";
import Tokens from "../components/tokens";
import RemovePercent from "../components/remove-percent";
import RemoveButton from "../components/button/remove-button";
import RemoveAmount from "../components/remove-amount";
import useRemove from "./use-remove";
import usePoolInfo from "./use-pool-info";

const Remove = ({ poolIdx, onSuccess }: any) => {
  const [percent, setPercent] = useState(0);
  const { info, userInfo, loading: infoLoading } = usePoolInfo(poolIdx);

  const { loading: removing, onRemove } = useRemove({
    poolIdx,
    info,
    percent,
    liquidity: userInfo?.liquidity,
    onSuccess: () => {
      onSuccess();
    }
  });

  const errorTips = useMemo(() => {
    if (!percent) return "Select a percent";
    return "";
  }, [percent]);

  return (
    <>
      <RemovePercent percent={percent} setPercent={setPercent} />
      {/* <RemoveAmount
        type="V2"
        amount0={amount0}
        amount1={amount1}
        token0={token0}
        token1={token1}
        percent={percent}
      />
      <RemoveButton
        text="Remove Liquidity"
        loading={removing || infoLoading || loading}
        onClick={onRemove}
        errorTips={errorTips}
      /> */}
    </>
  );
};

export default memo(Remove);
