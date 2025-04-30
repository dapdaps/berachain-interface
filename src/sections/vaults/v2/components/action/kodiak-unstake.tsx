import { useEffect, useState } from "react";
import { useVaultsV2Context } from "@/sections/vaults/v2/context";
import useCustomAccount from "@/hooks/use-account";
import vaultAbi from "@/sections/pools/kodiak/island/abi/farm";
import islandAbi from "@/sections/pools/kodiak/island/abi/island";
import { Contract } from "ethers";
import Button from "@/components/button";
import CircleLoading from "@/components/circle-loading";
import Big from "big.js";
import Item from "@/sections/pools/kodiak/island/detail/actions/stake-item";
import { remove, uniq } from "lodash";
import useAction from "../../hooks/use-action";
import { getTokenAmountsV2 } from "@/sections/pools/helpers";

export default function KodiakUnstake() {
  const [items, setItems] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const { account, provider } = useCustomAccount();
  const { currentProtocol } = useVaultsV2Context();

  const {
    loading: staking,
    onAction,
    amount,
    handleAmountChange,
    dappParams,
    setDappParams
  } = useAction();

  const onQueryInfo = async () => {
    const FarmContract = new Contract(
      currentProtocol.vaultAddress,
      vaultAbi,
      provider
    );
    const IslandContract = new Contract(
      currentProtocol.token.address,
      islandAbi,
      provider
    );
    try {
      setLoading(true);
      const stakedRes = await FarmContract.lockedStakesOf(account);
      const totalSupply = await IslandContract.totalSupply();
      const reverses = await IslandContract.getUnderlyingBalances();
      const reserve0 = reverses[0].toString();
      const reserve1 = reverses[1].toString();
      if (stakedRes && stakedRes.length) {
        let totalAmount = Big(0);
        const items: any = [];

        stakedRes.forEach((item: any) => {
          totalAmount = totalAmount.add(item.liquidity.toString());
          const unlocked = Big(item.ending_timestamp.toString()).lt(
            Date.now() / 1000
          );

          const { amount0, amount1 } = getTokenAmountsV2({
            liquidity: item.liquidity.toString(),
            totalSupply: totalSupply.toString(),
            reserve0,
            reserve1,
            token0: currentProtocol.tokens[0],
            token1: currentProtocol.tokens[1]
          });

          items.push({
            multiplier: Big(item.lock_multiplier.toString())
              .div(1e18)
              .toFixed(2),
            ending_timestamp: item.ending_timestamp.toString(),
            start_timestamp: item.start_timestamp.toString(),
            kek_id: item.kek_id,
            unlocked,
            liquidity: item.liquidity.toString(),
            amount0,
            amount1
          });
        });
        let _amount = Big(amount || 0);
        setDappParams({
          kekIds: items
            .filter((item: any) => item.unlocked)
            .map((item: any) => {
              _amount.add(item.liquidity);
              return item.kek_id;
            })
        });
        handleAmountChange(_amount.div(1e18).toString());
        setItems(items);
      } else {
        setItems([]);
      }
    } catch (err) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const onSelect = (item: any) => {
    const id = item.kek_id;
    let _amount = Big(amount || 0);
    if (!dappParams?.kekIds) dappParams.kekIds = [];
    if (dappParams.kekIds.includes(id)) {
      remove(dappParams.kekIds, (i) => i === id);
      _amount = _amount.minus(item.liquidity);
    } else {
      dappParams.kekIds.push(id);
      _amount = _amount.add(item.liquidity);
    }
    setDappParams({ kekIds: uniq(dappParams.kekIds) });
    handleAmountChange(_amount.div(1e18).toString());
  };

  useEffect(() => {
    onQueryInfo();
  }, []);

  return (
    <>
      {items.map((item: any) => (
        <Item
          key={item.kek_id}
          token0={currentProtocol.tokens[0]}
          token1={currentProtocol.tokens[1]}
          item={item}
          onClick={onSelect}
          active={dappParams.kekIds?.includes(item.kek_id)}
        />
      ))}
      {loading && (
        <div className="h-[200px] flex justify-center items-center">
          <CircleLoading size={28} />
        </div>
      )}
      <Button
        disabled={!dappParams.kekIds?.length}
        type="primary"
        className="w-full h-[46px] mt-[16px] font-bold"
        loading={staking}
        onClick={onAction}
      >
        {!!dappParams.kekIds?.length ? "Unstake" : "None Positions"}
      </Button>
    </>
  );
}
