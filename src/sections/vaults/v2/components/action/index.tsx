import clsx from 'clsx';
import LazyImage from '@/components/layz-image';
import InputNumber from '@/components/input-number';
import { useState } from 'react';
import { numberFormatter } from '@/utils/number-formatter';
import { useVaultsV2Context } from '@/sections/vaults/v2/context';

const Action = (props: any) => {
  const { className } = props;

  const { actionType } = useVaultsV2Context();

  const balance = "123";

  const [amount, setAmount] = useState<string>();
  const [inputError, setInputError] = useState<boolean>(false);
  const [inputErrorMessage, setInputErrorMessage] = useState<string>();

  const handleAmountChange = (_amount: string) => {
    setAmount(_amount);
  };

  const handleBalance = () => {
    handleAmountChange(balance);
  };

  return (
    <div
      className={clsx(
        "text-black font-Montserrat text-[18px] font-semibold leading-[90%]",
        className
      )}
    >
      <div className="">
        {actionType.title}
      </div>
      <div className="mt-[30px] flex justify-between items-start gap-[10px]">
        <div className="flex items-center w-0 flex-1">
          <div className="flex items-center shrink-0">
            <LazyImage src="/images/icon-coin.svg" width={50} height={50} containerClassName="shrink-0 rounded-full overflow-hidden" />
            <LazyImage src="/images/icon-coin.svg" width={50} height={50} containerClassName="shrink-0 rounded-full overflow-hidden translate-x-[-20px]" />
          </div>
          <div className="flex-1 w-0 overflow-hidden">
            <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
              HONEY-USDC.e
            </div>
            <div className="mt-[8px] flex items-center gap-[4px]">
              <LazyImage src="/images/icon-coin.svg" width={16} height={16} containerClassName="shrink-0" />
              <div className="text-[14px] font-medium leading-[100%]">
                Hub
              </div>
            </div>
          </div>
        </div>
        <button
          type="button"
          className="px-[15px] shrink-0 disabled:!cursor-not-allowed disabled:opacity-30 h-[26px] rounded-[6px] border border-[#373A53] bg-[#FFF] text-[#000] text-center font-Montserrat text-[14px] font-medium leading-normal"
        >
          Get
        </button>
      </div>
      <div
        className={clsx(
          "mt-[20px] h-[90px] rounded-[12px] border flex flex-col items-stretch gap-[15px] pl-[13px] pr-[14px] pt-[20px] pb-[13px]",
          inputError ? "border-[#CE4314] bg-[#FFEFEF]" : "border-[#373A53] bg-[#FFF]"
        )}
      >
        <div className="flex justify-between items-center gap-[10px] w-full">
          <InputNumber
            value={amount}
            onNumberChange={handleAmountChange}
            placeholder="0"
            className={clsx(
              "flex-1 h-[26px] text-[20px] font-Montserrat !bg-[unset]",
              inputError ? "text-[#FF3F3F]" : "text-black"
            )}
          />
          <div className="flex items-center justify-end shrink-0 translate-x-[10px]">
            <LazyImage src="/images/icon-coin.svg" width={26} height={26} containerClassName="shrink-0 rounded-full overflow-hidden" />
            <LazyImage src="/images/icon-coin.svg" width={26} height={26} containerClassName="shrink-0 rounded-full overflow-hidden translate-x-[-10px]" />
          </div>
        </div>
        <div className="flex justify-between items-center gap-[10px] w-full text-[#3D405A] font-Montserrat text-[14px] font-normal leading-normal">
          <div className="">
            $0.00
          </div>
          <div className="flex items-center gap-[2px]">
            <div>balance:</div>
            <button
              type="button"
              className="underline underline-offset-2 cursor-pointer disabled:opacity-30 disabled:!cursor-not-allowed"
              onClick={handleBalance}
            >
              {numberFormatter(balance, 2, true)}
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-[15px] items-center gap-[4px] text-[#000] text-right font-Montserrat text-[14px] font-semibold leading-normal">
        <button
          type="button"
          className="underline underline-offset-2"
        >
          Mint LP tokens
        </button>
        <div>first</div>
      </div>
      <button
        type="button"
        disabled={true}
        className="w-full mt-[18px] disabled:opacity-30 disabled:!cursor-not-allowed h-[50px] rounded-[10px] border border-[#000] opacity-30 bg-[#FFDC50] text-[#000] text-center font-Montserrat text-[16px] font-semibold leading-normal"
        onClick={() => {}}
      >
        {inputErrorMessage || actionType.button}
      </button>
    </div>
  );
};

export default Action;
