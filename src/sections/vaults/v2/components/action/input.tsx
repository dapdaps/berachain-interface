import clsx from 'clsx';
import InputNumber from '@/components/input-number';
import LazyImage from '@/components/layz-image';
import { ACTION_TYPE } from '@/sections/vaults/v2/config';
import Loading from '@/components/loading';
import Big from 'big.js';
import { numberFormatter } from '@/utils/number-formatter';

const ActionInput = (props: any) => {
  const { className, inputError, value, onChange, record, actionType, balanceLoading, balance } = props;

  const handleBalance = () => {
    onChange(balance);
  };

  return (
    <div
      className={clsx(
        "mt-[20px] h-[90px] rounded-[12px] border flex flex-col items-stretch gap-[15px] pl-[13px] pr-[14px] pt-[20px] pb-[13px]",
        inputError
          ? "border-[#CE4314] bg-[#FFEFEF]"
          : "border-[#373A53] bg-[#FFF]",
        className
      )}
    >
      <div className="flex justify-between items-center gap-[10px] w-full">
        <InputNumber
          value={value}
          onNumberChange={onChange}
          placeholder="0"
          className={clsx(
            "flex-1 h-[26px] text-[20px] font-Montserrat !bg-[unset]",
            inputError ? "text-[#FF3F3F]" : "text-black"
          )}
        />
        <div
          className={clsx(
            "flex items-center justify-end shrink-0",
            record.tokens.length > 1 && "translate-x-[10px]"
          )}
        >
          {record.tokens.map((token: any, idx: number) => (
            <LazyImage
              src={token.icon || "/assets/tokens/default_icon.png"}
              width={26}
              height={26}
              key={idx}
              containerClassName={clsx(
                "shrink-0 rounded-full overflow-hidden",
                idx !== 0 && "translate-x-[-10px]"
              )}
              fallbackSrc="/assets/tokens/default_icon.png"
            />
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center gap-[10px] w-full text-[#3D405A] font-Montserrat text-[14px] font-normal leading-normal">
        <div className=""></div>
        <div className="flex items-center gap-[2px]">
          <div>balance:</div>
          {actionType.value === ACTION_TYPE.DEPOSIT && balanceLoading ? (
            <Loading size={14} />
          ) : (
            <button
              type="button"
              disabled={
                Big(balance || 0).lte(0) ||
                (actionType.value === ACTION_TYPE.DEPOSIT && balanceLoading)
              }
              className="underline underline-offset-2 cursor-pointer disabled:opacity-30 disabled:!cursor-not-allowed"
              onClick={handleBalance}
            >
              {numberFormatter(balance, 6, true)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActionInput;
