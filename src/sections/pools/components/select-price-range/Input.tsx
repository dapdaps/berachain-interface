import { memo, useEffect, useState } from 'react';
import { formatPrice } from '@/utils/balance';
import { StyledInputButton, StyledInputInner, StyledInputLeft } from './styles';

const Input = ({
  label,
  value,
  setValue,
  onButtonClick,
  desc,
  disabled,
  rangeType
}: any) => {
  const [price, setPrice] = useState('');
  useEffect(() => {
    setPrice(['0', '∞'].includes(value) ? value : formatPrice(value));
  }, [value]);
  return (
    <div className='mt-[10px] h-[100px] rounded-[12px] border border-[#373a53] bg-white p-[14px] flex items-center md:p-[8px] md:h-[80px]'>
      <StyledInputButton
        disabled={Number(value) === 0 || rangeType === 3}
        onClick={() => {
          onButtonClick('minus');
        }}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='14'
          height='2'
          viewBox='0 0 14 2'
          fill='none'
        >
          <path
            d='M1 1H13'
            stroke='#000'
            strokeWidth='2'
            strokeLinecap='round'
          />
        </svg>
      </StyledInputButton>
      <StyledInputLeft>
        <div className='text-[#979abe] text-[14px] md:text-[12px] font-normal text-center'>
          {label}
        </div>
        <StyledInputInner
          placeholder='0'
          value={price || ''}
          onChange={(ev) => {
            if (isNaN(Number(ev.target.value))) return;
            setPrice(ev.target.value);
          }}
          onBlur={() => {
            setValue(price);
          }}
          disabled={disabled}
        />
        <div className='text-[#8e8e8e] text-[14px] md:text-[10px] font-normal mt-[3px] text-center md:h-[16px] h-[20px]'>
          <div className='absolute'>{desc}</div>
        </div>
      </StyledInputLeft>
      <StyledInputButton
        disabled={value === '∞' || rangeType === 3}
        onClick={() => {
          onButtonClick('add');
        }}
      >
        <svg
          width='14'
          height='14'
          viewBox='0 0 14 14'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M7 1L7 13'
            stroke='#000'
            strokeWidth='2'
            strokeLinecap='round'
          />
          <path
            d='M1 7H13'
            stroke='#000'
            strokeWidth='2'
            strokeLinecap='round'
          />
        </svg>
      </StyledInputButton>
    </div>
  );
};

export default memo(Input);
