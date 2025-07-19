import { numberFormatter } from '@/utils/number-formatter';
import TokenSelector from '@/sections/Lending/components/token-selector';
import { forwardRef, useImperativeHandle, useState } from 'react';
import InputNumber from '@/components/input-number';
import Big from 'big.js';
import clsx from 'clsx';

const CurrencyInput = forwardRef<any, any>((props, ref) => {
  const {
    amount,
    onAmount,
    onBalance,
    tokens,
    token,
    onToken,
    className,
    balanceText = 'Balance',
    tokenSelectorStyle,
    renderValue,
    contentClassName,
    inputContainerClassName,
    inputClassName,
    isInsideFooter,
    footerClassName,
  } = props;
  const isTokenSelectable = typeof onToken === 'function';

  const [tokenSelectVisible, setTokenSelectVisible] = useState(false);

  const refs = {
    setTokenSelectVisible,
  };
  useImperativeHandle(ref, () => refs);

  return (
    <div className={`${className}`}>
      <div className={clsx("relative w-full border border-[#373A53] bg-white rounded-[12px] overflow-hidden pl-[20px] md:pl-[10px] pr-[10px]", contentClassName)}>
        <div className={clsx("w-full h-[72px] leading-[70px] flex justify-between items-center gap-[10px]", inputContainerClassName)}>
          <InputNumber
            className={clsx("h-full text-[26px] font-[700] flex-1 w-0", inputClassName)}
            placeholder="0"
            value={amount}
            onNumberChange={onAmount}
          />
          <div
            onClick={() => {
              if (!isTokenSelectable) return;
              setTokenSelectVisible(true);
            }}
            className={`${isTokenSelectable ? 'cursor-pointer' : ''} shrink-0 w-[176px] md:w-[120px] h-[46px] flex justify-between items-center rounded-[8px] border border-[#373A53] bg-[#FFFDEB] p-[10px_14px_10px_7px]`}
            style={tokenSelectorStyle}
          >
            <div className="flex items-center gap-[8px] w-full">
              {
                !!token?.underlyingTokens ? (
                  <div className="flex items-center shrink-0">
                    {
                      token?.underlyingTokens.map((t: any, idx: number) => (
                        <img
                          key={idx}
                          src={t?.icon}
                          alt=""
                          className="w-[26px] h-[26px] rounded-full border-0 shrink-0"
                          style={{ marginLeft: idx > 0 ? -15 : 0 }}
                        />
                      ))
                    }
                  </div>
                ) : (
                  <img src={token?.icon} alt="" className="w-[26px] h-[26px] rounded-full border-0 shrink-0" />
                )
              }
              <div className="leading-none whitespace-nowrap flex-1 w-0">
                <div
                  className="text-[16px] font-[600] text-black w-full whitespace-nowrap overflow-hidden overflow-ellipsis"
                  title={token?.symbol}
                >
                  {token?.symbol}
                </div>
                <div
                  className="text-[12px] text-[#3D405A] font-[500] mt-[3px] w-full whitespace-nowrap overflow-hidden overflow-ellipsis"
                  title={token?.name}
                >
                  {token?.name}
                </div>
              </div>
            </div>
            {
              isTokenSelectable && (
                <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L6 5L11 1" stroke="black" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )
            }
          </div>
        </div>
        {
          isInsideFooter && (
            <InputFooter {...props} className={footerClassName} />
          )
        }
      </div>
      {
        !isInsideFooter && (
          <InputFooter {...props} className={footerClassName} />
        )
      }
      <TokenSelector
        visible={tokenSelectVisible}
        selected={token}
        tokens={tokens}
        onClose={() => {
          setTokenSelectVisible(false);
        }}
        onSelect={(token: any) => {
          onToken(token);
          onAmount('');
        }}
      />
    </div>
  );
});

export default CurrencyInput;

const InputFooter = (props: any) => {
  const {
    amount,
    onAmount,
    onBalance,
    tokens,
    token,
    onToken,
    className,
    balanceText = 'Balance',
    tokenSelectorStyle,
    renderValue,
  } = props;

  return (
    <div
      className={clsx("flex items-center py-[12px] text-[#3D405A] text-[12px] font-[500]", className)}
      style={{ justifyContent: token?.price ? 'space-between' : 'flex-end' }}
    >
      {
        typeof renderValue === 'function' && (
          <div className="">
            {renderValue(amount || '0')}
          </div>
        )
      }
      {
        !!token?.price && typeof renderValue !== 'function' && (
          <div className="">
            {numberFormatter(Big(amount || 0).times(token?.price || 0), 2, true, { prefix: '$' })}
          </div>
        )
      }
      <div className="">
        {balanceText}:&nbsp;
        <span
          className="underline cursor-pointer"
          onClick={onBalance}
        >
          {numberFormatter(token?.balance, 4, true)}
        </span>
      </div>
    </div>
  );
};
