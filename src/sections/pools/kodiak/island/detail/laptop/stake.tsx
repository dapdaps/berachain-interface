import Input from "@/sections/pools/components/deposit-amounts/input";
import Button from "@/components/button";
import StakeModal from "../action-modal/stake-modal";
import { useState, useMemo } from "react";
import { DEFAULT_CHAIN_ID } from "@/configs";
import Big from "big.js";

export default function Stake({ data, info, onSuccess }: any) {
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState("");
  const token = useMemo(
    () => ({
      address: data.id,
      symbol: data.symbol,
      chainId: DEFAULT_CHAIN_ID,
      decimals: 18,
      icon: ""
    }),
    [data]
  );
  const errorTips = useMemo(() => {
    if (!amount) return "Enter an amount";
    if (Big(balance || 0).lt(amount)) return "Insufficient Balance";
    return "";
  }, [amount, balance]);
  return (
    <>
      <Input
        value={amount}
        token={token}
        className="mt-[16px]"
        setValue={(val: any) => {
          setAmount(val);
        }}
        onLoad={setBalance}
      />
      <Button
        disabled={!!errorTips}
        type="primary"
        className="w-full h-[46px] mt-[16px]"
        onClick={() => {
          setShowModal(true);
        }}
      >
        {errorTips || "Withdraw"}
      </Button>
      {showModal && (
        <StakeModal
          data={data}
          info={info}
          liquidity={amount}
          open={showModal}
          onClose={() => {
            setShowModal(false);
          }}
          onSuccess={() => {
            setShowModal(false);
            onSuccess();
          }}
        />
      )}
    </>
  );
}
