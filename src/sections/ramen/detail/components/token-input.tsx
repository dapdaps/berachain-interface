import clsx from 'clsx';
import InputNumber from '@/components/input-number';
import { numberFormatter } from '@/utils/number-formatter';

const TokenInput = (props: any) => {
  const { className, label, onChange, value, token, balance } = props;

  const onBalance = () => {
    onChange(balance);
  };

  return (
    <div className={clsx('font-Montserrat', className)}>
      <div className="text-black text-[16px] font-[600]">
        {label}
      </div>
      <div className="relative w-full h-[72px] leading-[70px] mt-[10px]">
        <div className="absolute right-[14px] top-[50%] translate-y-[-50%] w-[176px] md:w-[120px] h-[46px] flex justify-between items-center rounded-[8px] border border-[#373A53] bg-[#FFFDEB] p-[10px_14px_10px_7px]">
          <div className="flex items-center gap-[8px]">
            <div className="flex items-center shrink-0">
              <img src={token.icon} alt="" className="w-[26px] h-[26px] rounded-full border-0 shrink-0" />
            </div>
            <div className="leading-none whitespace-nowrap">
              <div className="text-[16px] font-[600] text-black">
                {token.symbol}
              </div>
              <div className="text-[12px] text-[#3D405A] font-[500] mt-[3px]">
                {token.name}
              </div>
            </div>
          </div>
        </div>
        <InputNumber
          className="w-full h-full border border-[#373A53] bg-white rounded-[12px] text-[26px] font-[700] pl-[20px] pr-[200px]"
          placeholder="0"
          value={value}
          onNumberChange={onChange}
        />
      </div>
      <div className="flex items-center py-[12px] justify-between text-[#3D405A] text-[12px] font-[500]">
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
    </div>
  );
};

export default TokenInput;
