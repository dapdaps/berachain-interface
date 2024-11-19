import { useEffect, useMemo, useState } from 'react';
import Modal from "@/components/modal";
import Input from "@/sections/pools/components/deposit-amounts/input";
import Range from "@/components/range";
import {
  StyledHeaderAction,
  StyledHeaderActions
} from "@/sections/pools/components/select-price-range/styles";
import { usePriceStore } from "@/stores//usePriceStore";
import Button from "@/sections/pools/components/button/remove-button";
import Big from "big.js";
import useInfrared from "@/sections/staking/hooks/use-infrared";
import IncreaseLiquidityModal from "@/sections/pools/increase-liquidity-modal";
import UserInfo from "./user-info";
import { StakePrompt } from '@/sections/staking/Bridge/Detail/StakePrompt';
import BaseButton from '@/sections/pools/components/button/base-button';
import WithdrawQueueDrawer from '@/sections/staking/Bridge/Detail/Berps/Drawer';

const BerpsTypeName = {
  Stake: 'Deposit',
  Unstake: 'Withdraw',
};

export default function HandleModal({
  show,
  onClose,
  data,
  type,
  onSuccess
}: any) {

  const pool = data?.initialData?.pool;
  const isBERPS = data?.name === 'Berps';
  const vaultAddress = isBERPS ? data?.withdrawToken?.address : data.vaultAddress;
  const approveSpender = type ? "" : vaultAddress;
  const symbol = useMemo(() => {
    if (isBERPS) {
      if (type) {
        return data?.withdrawToken?.symbol;
      }
      return data?.depositToken?.symbol;
    }
    return pool?.name || data.tokens[0];
  }, [isBERPS, type, pool, data]);

  const [value, setValue] = useState("");
  const [percent, setPercent] = useState(0);
  const prices = usePriceStore((store) => store.price);
  const [balance, setBalance] = useState("");
  const [showMint, setShowMint] = useState(false);
  const [withdrawalQueueVisible, setWithdrawalQueueVisible] = useState(false);
  const { loading, onHandle } = useInfrared({
    amount: value,
    decimals: 18,
    vaultAddress: vaultAddress,
    tokens: data.tokens,
    type,
    onSuccess() {
      onClose();
      onSuccess();
    },
    isBERPS
  });

  const token = useMemo(() => {
    if (isBERPS) {
      if (type) {
        return data?.withdrawToken;
      }
      return data?.depositToken;
    }
    return type
      ? {
          address: data.vaultAddress,
          decimals: 18,
          icons: data.images
        }
      : {
          address: pool?.lp_token_address || data.LP_ADDRESS,
          decimals: 18,
          symbol: pool?.name || data.tokens[0],
          icons: data.images
        };
  }, [pool, type, isBERPS]);

  useEffect(() => {
    if (!show) {
      setValue("");
      setPercent(0);
    }
  }, [show]);

  return (
    <>
      <Modal open={show} onClose={onClose} closeIconClassName="md:hidden">
        <div className="bg-[#FFFDEB] px-[15px] py-[20px] rounded-t-[20px]">
          <div className="text-[18px] font-bold">
            {
              type ?
                isBERPS ? BerpsTypeName['Unstake'] : "Unstake" :
                isBERPS ? BerpsTypeName['Stake'] : "Stake"
            } {symbol}
          </div>
          <UserInfo data={data} className="justify-between mt-[16px]" />
          <Input
            value={value}
            setValue={setValue}
            token={token}
            prices={{ ...prices, bHONEY: data?.withdrawTokenPrice }}
            onLoad={(val: string) => {
              setBalance(val);
            }}
          />
          <StyledHeaderActions className="mt-[14px]">
            {[
              { label: "10%", value: 10 },
              { label: "20%", value: 20 },
              { label: "50%", value: 50 },
              { label: "Max", value: 100 }
            ].map((item, i) => (
              <StyledHeaderAction
                key={i}
                className={`${
                  item.value === percent ? "bg-[#FFDC50]" : "bg-transparent"
                } cursor-pointer`}
                onClick={() => {
                  if (!balance) return;
                  setValue(
                    Big(balance)
                      .mul(item.value / 100)
                      .toString()
                  );
                  setPercent(item.value);
                }}
              >
                {item.label}
              </StyledHeaderAction>
            ))}
          </StyledHeaderActions>
          <div className="mt-[30px]">
            <Range
              value={percent}
              onChange={(ev: any) => {
                setPercent(ev.target.value);
                if (balance)
                  setValue(
                    Big(balance || 0)
                      .mul(ev.target.value / 100)
                      .toString()
                  );
              }}
            />
          </div>
          {
            isBERPS && !type && (
              <StakePrompt className="mt-[20px]" />
            )
          }
          <div className="mt-[30px]">
            <Button
              text={(
                type ?
                  isBERPS ? BerpsTypeName['Unstake'] : "Unstake" :
                  isBERPS ? BerpsTypeName['Stake'] : "Stake"
              )}
              errorTips=""
              loading={loading}
              onClick={onHandle}
              value={value}
              token={token}
              spender={approveSpender}
              disabled={type && Big(balance || 0).lte(0) && isBERPS}
            />
            {
              isBERPS && !!type && (
                <BaseButton
                  onClick={() => {
                    setWithdrawalQueueVisible(true);
                  }}
                >
                  Withdrawal Queue
                </BaseButton>
              )
            }
          </div>
          {!!balance && Big(balance).eq(0) && !isBERPS && (
            <div className="mt-[16px] text-center text-[#FD4C67] text-[14px] font-medium">
              You don’t have any {pool?.name || data.tokens[0]} yet
            </div>
          )}
          {["BEX"].includes(pool?.protocol) && type === 0 && (
            <div
              onClick={() => {
                setShowMint(true);
              }}
              className="flex items-center justify-center gap-[8px] mt-[16px] text-center text-[18px] font-semibold"
            >
              <div>Mint {pool?.name} LP</div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="8"
                height="14"
                viewBox="0 0 8 14"
                fill="none"
              >
                <path
                  d="M1 13L6 7L1 1"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )}
        </div>
      </Modal>
      {pool &&
        data.tokens.length === 2 &&
        pool.underlying_tokens?.length === 2 && (
          <IncreaseLiquidityModal
            open={showMint}
            onClose={() => {
              setShowMint(false);
            }}
            onSuccess={() => {
              onSuccess();
            }}
            token0={{ ...pool?.underlying_tokens[0], icon: data.images[0] }}
            token1={{ ...pool?.underlying_tokens[1], icon: data.images[1] }}
            dex={pool?.protocol}
            title={`Mint ${pool?.underlying_tokens[0]?.symbol}-${pool?.underlying_tokens[1]?.symbol}`}
          />
        )}
      <WithdrawQueueDrawer
        visible={withdrawalQueueVisible}
        onClose={() => {
          setWithdrawalQueueVisible(false);
        }}
        data={data}
      />
    </>
  );
}
