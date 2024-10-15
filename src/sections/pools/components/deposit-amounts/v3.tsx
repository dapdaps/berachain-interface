import Big from 'big.js';
import { memo, useEffect, useState } from 'react';
import { usePriceStore } from '@/stores/usePriceStore';
import { getAnotherAmountOut } from '../../helpers';
import Input from './input';
import { StyledContainer, StyledSubtitle } from './styles';
import { sortTokens } from '../../utils';

const DepositAmounts = ({
  label,
  token0,
  token1,
  value0,
  value1,
  setValue0,
  setValue1,
  rangeType,
  upperPrice,
  lowerPrice,
  currentPrice,
  onError
}: any) => {
  const prices = usePriceStore((store) => store.price);
  const [balance0, setBalance0] = useState('');
  const [balance1, setBalance1] = useState('');
  const [_token0, _token1] = sortTokens(token0, token1);
  const reverse =
    _token0.address !== token0.address && _token1.address !== token1.address;

  const handleValue = (value: any, type: 0 | 1) => {
    if (type === 0) {
      setValue0(value);
      setValue1('');
    } else {
      setValue0('');
      setValue1(value);
    }
    if ([1, 2].includes(rangeType) || !Number(value)) return;

    const isReversed =
      token0.address.toLowerCase() > token1.address.toLowerCase();

    const isToken0 = (type === 0 && !isReversed) || (type === 1 && isReversed);

    const amountOut = new Big(value || 0).gt(0)
      ? getAnotherAmountOut({
          currentPrice: isReversed ? 1 / currentPrice : currentPrice,
          lowerPrice: isReversed ? 1 / upperPrice : lowerPrice,
          upperPrice: isReversed ? 1 / lowerPrice : upperPrice,
          amount: value,
          isToken0,
          isFullRange: rangeType === 3 || rangeType === 0
        })
      : '';

    if (type === 0) {
      const _amountOut = new Big(amountOut)
        .toFixed(token1.decimals)
        .replace(/\.?0+$/, '');
      setValue1(_amountOut);
    } else {
      const _amountOut = new Big(amountOut)
        .toFixed(token0.decimals)
        .replace(/\.?0+$/, '');
      setValue0(_amountOut);
    }
  };

  useEffect(() => {
    if (!upperPrice || !lowerPrice || !currentPrice) {
      setValue0('');
      setValue1('');
      return;
    }
    if (value0) {
      handleValue(value0, 0);
    }
  }, [upperPrice, lowerPrice, currentPrice]);

  useEffect(() => {
    if (rangeType === 1) {
      setValue1('');
    }
    if (rangeType === 2) {
      setValue0('');
    }
  }, [rangeType]);

  useEffect(() => {
    if (
      (rangeType === 1 && !(reverse ? value1 : value0)) ||
      (rangeType === 2 && !(!reverse ? value1 : value0)) ||
      ([0, 3].includes(rangeType) && (!value0 || !value1))
    ) {
      onError('Enter Amount');
      return;
    }
    if (
      (rangeType === 1 &&
        new Big((reverse ? balance1 : balance0) || 0).lt(
          reverse ? value1 : value0 || 0
        )) ||
      (rangeType === 2 &&
        new Big((!reverse ? balance1 : balance0) || 0).lt(
          !reverse ? value1 : value0 || 0
        )) ||
      ([0, 3].includes(rangeType) &&
        (new Big(balance0 || 0).lt(value0 || 0) ||
          new Big(balance1 || 0).lt(value1 || 0)))
    ) {
      onError('Insufficient Balance');
      return;
    }
    onError('');
  }, [rangeType, value0, value1, balance0, balance1]);

  return (
    <StyledContainer>
      <StyledSubtitle>{label}</StyledSubtitle>
      {[0, 3].includes(rangeType) && (
        <>
          <Input
            token={token0}
            value={value0}
            setValue={(val: any) => {
              handleValue(val, 0);
            }}
            prices={prices}
            disabled={!token0 || !token1}
            onLoad={(balance: string) => {
              setBalance0(balance);
            }}
          />
          <Input
            token={token1}
            value={value1}
            setValue={(val: any) => {
              handleValue(val, 1);
            }}
            prices={prices}
            disabled={!token0 || !token1}
            onLoad={(balance: string) => {
              setBalance1(balance);
            }}
          />
        </>
      )}
      {rangeType === 1 && (
        <Input
          token={_token0}
          value={reverse ? value1 : value0}
          setValue={(val: any) => {
            handleValue(val, reverse ? 1 : 0);
          }}
          prices={prices}
          disabled={!_token0}
          onLoad={(balance: string) => {
            reverse ? setBalance1(balance) : setBalance0(balance);
          }}
        />
      )}
      {rangeType === 2 && (
        <Input
          token={_token1}
          value={!reverse ? value1 : value0}
          setValue={(val: any) => {
            handleValue(val, !reverse ? 1 : 0);
          }}
          prices={prices}
          disabled={!_token0}
          onLoad={(balance: string) => {
            !reverse ? setBalance1(balance) : setBalance0(balance);
          }}
        />
      )}
    </StyledContainer>
  );
};

export default memo(DepositAmounts);
