import useCollectInfo from "@/sections/pools/hooks/use-collect-info";
import dexs from "@/configs/pools";
import { useMemo } from "react";
import Big from "big.js";
import { balanceFormated } from "@/utils/balance";

export default function UnclaimedFees({ pool, dex }: any) {
  const { info } = useCollectInfo(pool.tokenId, dexs[dex]);
  const total = useMemo(() => {
    if (!pool.price0 || !pool.price1) return "";
    if (!info?.amount0 || !info?.amount1) return "";
    const _a0 = Big(info.amount0).div(10 ** pool.token0.decimals);
    const _a1 = Big(info.amount1).div(10 ** pool.token1.decimals);
    const _t = Big(pool.price0)
      .mul(_a0)
      .add(Big(pool.price1).mul(_a1))
      .toString();
    return balanceFormated(_t, 2);
  }, [info, pool]);

  return total ? "$" + total : "";
}
