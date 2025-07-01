import Modal from "@/components/modal";
import { numberFormatter } from "@/utils/number-formatter";
import Big from "big.js";
import clsx from "clsx";
import Unstake from "./actions/unstake";
import { useState } from "react";
import Card from "@/components/card";
import Stake from "./actions/stake";

const MigrateAutoCompound = (props: any) => {
  const { data, info, className, onSuccess, dapp } = props;

  const { tokenLp, baults, farm } = data ?? {};

  const { id: baultContractAddress, apy, blacklisted, price, totalAssets, totalSupply } = baults?.[0] ?? {};

  const [open, setOpen] = useState(false);
  // 1 = unstake
  // 2 = stake
  const [step, setStep] = useState(1);
  const [amountMigrate, setAmountMigrate] = useState("");

  if (!info?.locked.amount || Big(info.locked.amount || 0).lte(0)) {
    return null;
  }

  return (
    <div className={clsx("text-[14px] font-[400] leading-[1.2] mt-[20px] rounded-[10px] bg-black/5 px-[16px] py-[20px] w-[440px] md:w-full md:mt-[12px] md:rounded-[20px] md:bg-[#FFFDEB] md:border md:border-black md:p-[10px]", className)}>
      <div className="flex justify-between items-center">
        <div className="h-[32px] flex justify-center items-center flex-shrink-0 rounded-[16px] text-black font-montserrat text-[16px] font-[500] leading-[90%]">
          AUTO-COMPOUND (Baults)
        </div>
        <div className="">
          {numberFormatter(apy, 2, true, { isShort: true, isShortUppercase: true, isZeroPrecision: true })}% APY
        </div>
      </div>
      <div className="font-[500] mt-[10px]">
        Boost Your Yields with Auto-Compounding
      </div>
      <div className="mt-[10px]">
        You have {numberFormatter(info.locked.amountUsd, 2, true, { isShort: true, round: 0, prefix: "$" })} staked in the Reward Vault. Migrate to baults to automatically reinvest your rewards and maximize your yield.
      </div>
      <div className="mt-[16px]">
        <button
          type="button"
          className="h-[46px] bg-[#FFDC50] px-[10.5px] leading-[30px] border border-[#373A53] rounded-[10px] text-center text-[16px] font-[500] text-black disabled:!opacity-30 disabled:!cursor-not-allowed  w-full"
          onClick={() => setOpen(true)}
        >
          Migrate to Auto-Compound
        </button>
      </div>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setStep(1);
          onSuccess?.({ isLoading: false });
        }}
      >
        <Card className="!pt-[45px] w-[450px] md:w-full">
          <div className="absolute top-[20px] left-[20px] font-bold">
            Migrate to Auto-Compound
          </div>
          {
            step === 1 && (
              <Unstake
                data={data}
                info={info}
                onSuccess={({ amount }: any) => {
                  setStep(2);
                  setAmountMigrate(amount);
                }}
                dapp={dapp}
                isMigrate
              />
            )
          }
          {
            step === 2 && (
              <Stake
                data={data}
                info={info}
                onSuccess={() => {
                  setOpen(false);
                  onSuccess?.();
                }}
                dapp={dapp}
                isMigrate
                amountMigrate={amountMigrate}
              />
            )
          }
        </Card>
      </Modal>
    </div>
  )
}

export default MigrateAutoCompound;
