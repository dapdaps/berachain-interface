import clsx from 'clsx';
import InputNumber from '@/components/input-number';
import { numberFormatter } from '@/utils/number-formatter';

const TokenInput = (props: any) => {
  const { className, label, onChange, value, token, balance, suffix, errorMsg } = props;

  const onBalance = () => {
    onChange(balance);
  };

  return (
    <div className={clsx('font-Montserrat border border-[#373A53] bg-white rounded-[12px] p-[17px_16px_11px_13px]', className)}>
      <div className="text-black text-[14px] font-[500]">
        {label}
      </div>
      <div className="relative w-full mt-[10px] flex justify-between items-center gap-[10px]">
        <InputNumber
          className="w-full h-full text-[18px] font-[600] flex-1"
          placeholder="0"
          value={value}
          onNumberChange={onChange}
        />
        <div className="flex justify-between items-center shrink-0">
          <div className="flex items-center gap-[8px]">
            <div className="flex items-center shrink-0">
              <img src={token.icon} alt="" className="w-[26px] h-[26px] rounded-full border-0 shrink-0" />
            </div>
            <div className="leading-none whitespace-nowrap">
              <div className="text-[14px] font-[600] text-black">
                {token.symbol}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center py-[5px] justify-between text-[#8D8D8D] text-[12px] font-[500]">
        <div className="">
          {numberFormatter(0, 2, true, { prefix: '$' })}
        </div>
        {
          !!balance && (
            <div className="">
              Balance:&nbsp;
              <span
                className="underline decoration-solid cursor-pointer"
                onClick={onBalance}
              >
                {numberFormatter(balance, 4, true)} {token.symbol}
              </span>
            </div>
          )
        }
      </div>
      {
        errorMsg && (
          <div className="flex items-start gap-[3px] mt-[10px] text-[#CE494D] text-[12px] font-[500] leading-[100%] font-Montserrat">
            <img src="/images/ramen/icon-error.svg" alt="" className="w-[11px] h-[10px] shrink-0 translate-y-[2px]" />
            <div className="flex-1">
              {errorMsg}
            </div>
          </div>
        )
      }
      {
        suffix && (
          <div className="mt-[10px] border-t border-t-[rgba(0,_0,_0,_0.10)] pt-[12px] pb-[2px]">
            {suffix}
          </div>
        )
      }
    </div>
  );
};

export default TokenInput;
