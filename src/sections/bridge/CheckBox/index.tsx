'use client';

import clsx from "clsx";

interface Props {
  checked: boolean;
  onChange: (isChecked: boolean) => void;
  className?: string;
}

export default function CheckBox({ checked, onChange, className }: Props) {
  if (checked) {
    return (
      <div
        onClick={() => {
          onChange(!checked);
        }}
        className={clsx('w-[20px] h-[20px] cursor-pointer flex items-center justify-center', className)}
      >
        <svg
          width='22'
          height='22'
          viewBox='0 0 22 22'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <circle cx='11' cy='11' r='10.5' fill='#BC9549' stroke='#373A53' />
          <path
            d='M8 10.5L10.3333 13L15 8'
            stroke='black'
            stroke-width='2'
            strokeLinecap='round'
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      onClick={() => {
        onChange(!checked);
      }}
      className='bg-white border border-[#000] rounded-[20px] w-[20px] h-[20px] cursor-pointer'
    ></div>
  );
}
