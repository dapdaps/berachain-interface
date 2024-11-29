import { numberFormatter } from '@/utils/number-formatter';
import TokenSelector from '@/sections/Lending/components/token-selector';
import { forwardRef, useImperativeHandle, useState } from 'react';
import InputNumber from '@/components/input-number';
import Big from 'big.js';

const CurrencyInput = forwardRef<any, any>((props, ref) => {
  const { amount, onAmount, onBalance, tokens, token, onToken, className, balanceText = 'Balance', tokenSelectorStyle } = props;
  const isTokenSelectable = typeof onToken === 'function';

  const [tokenSelectVisible, setTokenSelectVisible] = useState(false);

  const refs = {
    setTokenSelectVisible,
  };
  useImperativeHandle(ref, () => refs);

  return (
    <div className={`${className}`}>
      <div className="relative w-full h-[72px] leading-[70px]">
        <div
          onClick={() => {
            if (!isTokenSelectable) return;
            setTokenSelectVisible(true);
          }}
          className={`${isTokenSelectable ? 'cursor-pointer' : ''} absolute right-[14px] top-[50%] translate-y-[-50%] w-[176px] md:w-[120px] h-[46px] flex justify-between items-center rounded-[8px] border border-[#373A53] bg-[#FFFDEB] p-[10px_14px_10px_7px]`}
          style={tokenSelectorStyle}
        >
          <div className="flex items-center gap-[8px]">
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
            <div className="leading-none whitespace-nowrap">
              <div className="text-[16px] font-[600] text-black">{token?.symbol}</div>
              <div className="text-[12px] text-[#3D405A] font-[500] mt-[3px]">{token?.name}</div>
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
        <InputNumber
          className="w-full h-full border border-[#373A53] bg-white rounded-[12px] text-[26px] font-[700] pl-[20px] pr-[200px]"
          placeholder="0"
          value={amount}
          onNumberChange={onAmount}
        />
      </div>
      <div
        className="flex items-center py-[12px]"
        style={{ justifyContent: token?.price ? 'space-between' : 'flex-end' }}
      >
        {
          !!token?.price && (
            <div className="text-[#3D405A] text-[12px] font-[500]">
              {numberFormatter(Big(amount || 0).times(token?.price || 0), 2, true, { prefix: '$' })}
            </div>
          )
        }
        <div className="text-[#3D405A] text-[12px] font-[500]">
          {balanceText}:&nbsp;
          <span
            className="underline cursor-pointer"
            onClick={onBalance}
          >
            {numberFormatter(token?.balance, 4, true)}
          </span>
        </div>
      </div>
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
