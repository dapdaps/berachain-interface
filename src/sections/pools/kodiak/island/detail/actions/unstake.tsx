import Button from "@/components/button";
import Input from "@/sections/pools/components/deposit-amounts/input";
import { useMemo, useState } from "react";
import useUnstake from "../../hooks/use-unstake";
import Big from "big.js";
import { remove, uniq } from "lodash";
import Item from "./stake-item";
import { DEFAULT_CHAIN_ID } from "@/configs";
import SwitchTabs from "@/components/switch-tabs";
import { numberFormatter } from "@/utils/number-formatter";
import { useShares } from "../../../baults/hooks/use-shares";
import useApprove from "@/hooks/use-approve";

export default function Unstake({ data, info, onSuccess, dapp, isMigrate }: any) {
  const { poolConfig } = dapp ?? {};
  const { baultRouter } = poolConfig ?? {};

  const [amount, setAmount] = useState("");
  const [kekIds, setKekIds] = useState<any>([]);
  const [amount0, setAmount0] = useState("");
  const [amount1, setAmount1] = useState("");
  const [balance, setBalance] = useState("");
  const [currentTab, setCurrentTab] = useState("");

  const token = useMemo(
    () => ({
      address: data.farm.id,
      symbol: data.tokenLp.symbol,
      chainId: DEFAULT_CHAIN_ID,
      decimals: 18,
      icon: data.icon
    }),
    [data]
  );
  const baultToken = useMemo(
    () => {
      if (!data.baults?.[0]) return void 0;
      return {
        address: data.baults[0].id,
        symbol: `Bault-${data.tokenLp.symbol}`,
        chainId: DEFAULT_CHAIN_ID,
        decimals: data.tokenLp.decimals,
        icon: data.icon
      };
    },
    [data]
  );
  const tabs = useMemo<any>(() => {
    const _tabs = [];
    if (Big(info.locked?.amount || 0).gt(0) && data.farm?.id) {
      _tabs.push({ label: "Reward Vault", value: "rewardVault" });
    }
    if (Big(info.lockedBault?.balance || 0).gt(0) && data.baults?.[0] && !isMigrate) {
      _tabs.push({ label: "Auto-Compound", value: "autoCompound" });
    }
    setCurrentTab(_tabs[0].value);
    return _tabs;
  }, [info, isMigrate]);

  const {
    baultTokenShareAmount,
    baultTokenShareAmountLoading,
  } = useShares({
    data,
    lpAmount: amount
  });
  const { loading, onUnstake } = useUnstake({
    kekIds,
    token: { symbol: data.symbol },
    amount,
    onSuccess: () => {
      if (isMigrate) {
        onSuccess?.({ amount });
        return;
      }
      onSuccess?.();
    },
    amount0,
    amount1,
    data,
    dapp,
    currentTab,
    baultTokenShareAmount
  });
  const { approved, approve, approving, checking, allowance } = useApprove({
    token: baultToken,
    amount,
    isMax: true,
    spender: baultRouter,
    onSuccess() { }
  });

  const onSelect = (item: any) => {
    const id = item.kek_id;
    let _amount = Big(amount || 0);
    let _a0 = Big(amount0 || 0);
    let _a1 = Big(amount1 || 0);
    if (kekIds.includes(id)) {
      remove(kekIds, (i) => i === id);
      _amount = _amount.minus(item.liquidity);
      _a0 = _a0.minus(item.amount0);
      _a1 = _a1.minus(item.amount1);
    } else {
      kekIds.push(id);
      _amount = _amount.add(item.liquidity);
      _a0 = _a0.add(item.amount0);
      _a1 = _a1.add(item.amount1);
    }
    setKekIds(uniq(kekIds));
    setAmount(_amount.div(1e18).toString());
    setAmount0(_a0.toString());
    setAmount1(_a1.toString());
  };

  const errorTips = useMemo(() => {
    if (data.farm.provider === "kodiak") {
      if (!kekIds.length) return "Select a position";
    }
    if (data.farm.provider === "bgt") {
      if (!amount) return "Enter an amount";
      if (Big(balance || 0).lt(amount)) return "Insufficient Balance";
    }

    return "";
  }, [amount, balance, kekIds]);

  return (
    <>
      {
        tabs.length > 1 && (
          <SwitchTabs
            tabs={tabs}
            className="!h-[40px] !bg-[#DFDCC4] mt-[10px]"
            current={currentTab}
            onChange={(_tab) => {
              setAmount("");
              setCurrentTab(_tab);
            }}
          />
        )
      }

      {
        currentTab === "rewardVault" && (
          <>
            {data.farm.provider === "kodiak" &&
              info.locked.items.map((item: any) => (
                <Item
                  key={item.kek_id}
                  token0={data.token0}
                  token1={data.token1}
                  item={item}
                  onClick={onSelect}
                  active={kekIds.includes(item.kek_id)}
                />
              ))}
            {data.farm.provider === "bgt" && (
              <Input
                value={amount}
                token={token}
                className="mt-[16px]"
                setValue={(val: any) => {
                  setAmount(val);
                }}
                onLoad={setBalance}
              />
            )}
            {
              isMigrate && (
                <div className="w-full border border-[#CE4314] rounded-[12px] bg-[#FFEFEF] p-[10px] mt-[16px]">
                  <div className="font-[600]">Important</div>
                  <div className="text-[14px]">
                    Any unclaimed rewards in your current vault will not be automatically migrated. Make sure to claim them separately before or after migration.
                  </div>
                </div>
              )
            }
            <Button
              disabled={!!errorTips}
              type="primary"
              className="w-full h-[46px] mt-[16px]"
              loading={loading}
              onClick={onUnstake}
            >
              {errorTips || "Unstake"}
            </Button>
          </>
        )
      }

      {
        currentTab === "autoCompound" && (
          <>
            <div className="rounded-[12px] border-[#373A53] border p-[14px] mt-[10px] text-[14px] text-[#000] font-medium leading-[1.5]">
              <div className="flex justify-between items-start gap-[10px]">
                <div className="">
                  Your Auto-Compound Shares:
                </div>
                <div className="w-[180px] shrink-0 flex justify-end items-center gap-[5px] font-[700]">
                  <div>{numberFormatter(info.lockedBault?.balance, 9, true, { isShort: false, isShortUppercase: true })} Bault-{data.tokenLp.symbol}</div>
                  {/* <img src={data.icon} alt="" className="w-[20px] h-[20px] rounded-full shrink-0" /> */}
                </div>
              </div>
              <div className="flex justify-between items-start gap-[10px]">
                <div className=""></div>
                <div className="w-[180px] shrink-0 text-[#3D405A] text-[12px]">
                  ≈{numberFormatter(info.lockedBault?.receiveLpAmount, 9, true, { isShort: false, isShortUppercase: true })} {data.tokenLp.symbol}
                </div>
              </div>
            </div>
            <Input
              value={amount}
              token={baultToken}
              className="mt-[16px]"
              setValue={(val: any) => {
                setAmount(val);
              }}
              onLoad={setBalance}
            />
            <Button
              disabled={!!errorTips || baultTokenShareAmountLoading || checking || approving}
              type="primary"
              className="w-full h-[46px] mt-[16px]"
              loading={loading || baultTokenShareAmountLoading || checking || approving}
              onClick={() => {
                if (!approved) {
                  approve();
                  return;
                }
                onUnstake();
              }}
            >
              {errorTips || approved ? "Redeem" : "Approve " + baultToken?.symbol}
            </Button>
          </>
        )
      }
    </>
  );
}
