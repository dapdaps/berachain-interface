import clsx from 'clsx';
import { numberFormatter } from '@/utils/number-formatter';

const PriceRadio = (props: any) => {
  const { className, onChange, value } = props;

  return (
    <div className={clsx('font-Montserrat flex items-center gap-[8px]', className)}>
      {
        FDV_LIST.map((item: any, index: number) => (
          <button
            key={index}
            type="button"
            className={clsx('border border-[#373A53] rounded-[6px] h-[22px] flex justify-center items-center px-[8px] text-black text-[14px] font-[400] leading-[100%] transition-all duration-150 hover:bg-[#FFDC50]', value === item.value ? 'bg-[#FFDC50]' : '')}
            onClick={() => {
              if (value !== item.value) {
                onChange(item.value);
                return;
              }
              onChange(void 0);
            }}
          >
            {numberFormatter(item.value, 2, true, { isShort: true })}
          </button>
        ))
      }
    </div>
  );
};

export default PriceRadio;

// FIXME Test data
const FDV_LIST = [
  { value: '24692300' },
  { value: '62576300' },
  { value: '69008765' },
  { value: '132345340' },
];
