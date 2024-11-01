import Big from 'big.js';
import { memo, useEffect, useMemo } from 'react';

import Loading from '@/components/circle-loading';
import useTokenBalance from '@/hooks/use-token-balance';
import { balanceFormated, valueFormated } from '@/utils/balance';

import {
  StyledBalance,
  StyledDesc,
  StyledEmptyToken,
  StyledIcon,
  StyledInput,
  StyledInputInner,
  StyledInputTokenBox,
  StyledSymbol,
  StyledToken
} from './styles';

const Input = ({
  value,
  token,
  setValue,
  prices,
  disabled,
  onLoad,
  onSelectToken
}: any) => {
  const { tokenBalance: balance, isLoading } = useTokenBalance(
    token?.isNative ? 'native' : token?.address,
    token?.decimals
  );

  const isError = useMemo(() => {
    if (!value || !token || value === 'NaN') return false;

    if (!balance) return false;

    return new Big(value || 0).gt(balance);
  }, [value, balance]);

  useEffect(() => {
    onLoad(balance);
  }, [balance]);

  return (
    <StyledInput $error={isError}>
      <StyledInputTokenBox>
        <StyledInputInner
          placeholder='0'
          value={value}
          onChange={(ev) => {
            if (isNaN(Number(ev.target.value))) return;
            setValue(ev.target.value);
          }}
          disabled={disabled}
        />
        {token ? (
          <StyledToken>
            <StyledIcon
              src={token?.icon || '/assets/tokens/default_icon.png'}
            />
            <StyledSymbol>{token.symbol}</StyledSymbol>
          </StyledToken>
        ) : (
          <StyledEmptyToken onClick={onSelectToken}>
            Select token
          </StyledEmptyToken>
        )}
      </StyledInputTokenBox>
      <StyledDesc>
        <div>
          $
          {!isNaN(Number(value))
            ? valueFormated(value, prices[token?.priceKey || token?.symbol])
            : '-'}
        </div>
        <div className='flex items-center gap-[4px]'>
          <div>Balance: </div>
          {isLoading ? (
            <Loading size={16} />
          ) : (
            <StyledBalance
              onClick={() => {
                if (isNaN(Number(balance))) return;
                setValue(balanceFormated(new Big(balance).toFixed(18), 18));
              }}
              className='cursor-pointer'
            >
              {!balance ? '-' : balanceFormated(balance, 4)}
            </StyledBalance>
          )}
        </div>
      </StyledDesc>
    </StyledInput>
  );
};

export default memo(Input);
