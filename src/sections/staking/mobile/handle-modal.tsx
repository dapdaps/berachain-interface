import { useEffect, useMemo, useState } from 'react';
import Modal from '@/components/modal';
import Input from '@/sections/pools/components/deposit-amounts/input';
import { StyledInputRange } from '@/sections/pools/components/remove-percent';
import {
  StyledHeaderAction,
  StyledHeaderActions
} from '@/sections/pools/components/select-price-range/styles';
import { usePriceStore } from '@/stores//usePriceStore';
import Button from '@/sections/pools/components/button/remove-button';
import Big from 'big.js';
import useInfrared from '../hooks/use-infrared';
import IncreaseLiquidityModal from '@/sections/pools/increase-liquidity-modal';
import UserInfo from './user-info';

export default function HandleModal({
  show,
  onClose,
  data,
  type,
  onSuccess
}: any) {
  const pool = data?.initialData?.pool;
  const [value, setValue] = useState('');
  const [percent, setPercent] = useState(0);
  const prices = usePriceStore((store) => store.price);
  const [balance, setBalance] = useState('');
  const [showMint, setShowMint] = useState(false);
  const { loading, onHandle } = useInfrared({
    amount: value,
    decimals: 18,
    vaultAddress: data.vaultAddress,
    tokens: data.tokens,
    type,
    onSuccess() {
      onClose();
      onSuccess();
    }
  });

  const token = useMemo(() => {
    return type
      ? {
          address: data.vaultAddress,
          decimals: 18,
          icons: data.images
        }
      : {
          address: pool.lp_token_address,
          decimals: 18,
          symbol: pool.name,
          icons: data.images
        };
  }, [pool, type]);

  useEffect(() => {
    if (!show) {
      setValue('');
      setPercent(0);
    }
  }, [show]);

  return (
    <>
      <Modal open={show} onClose={onClose}>
        <div className='bg-[#FFFDEB] px-[15px] py-[20px] rounded-t-[20px]'>
          <div className='text-[18px] font-bold'>
            {type ? 'Unstake' : 'Stake'} {pool?.name || 'iBGT'}
          </div>
          <UserInfo data={data} className='justify-between mt-[16px]' />
          <Input
            value={value}
            setValue={setValue}
            token={token}
            prices={prices}
            onLoad={(val: string) => {
              setBalance(val);
            }}
          />
          <StyledHeaderActions className='mt-[14px]'>
            {[
              { label: '10%', value: 0.1 },
              { label: '20%', value: 0.2 },
              { label: '50%', value: 0.5 },
              { label: 'Full range', value: 1 }
            ].map((item, i) => (
              <StyledHeaderAction
                key={i}
                className={`${
                  item.value === percent ? 'bg-[#FFDC50]' : 'bg-transparent'
                } cursor-pointer`}
                onClick={() => {
                  if (!balance) return;
                  setValue(Big(balance).mul(item.value).toString());
                  setPercent(item.value);
                }}
              >
                {item.label}
              </StyledHeaderAction>
            ))}
          </StyledHeaderActions>
          <div className='mt-[30px]'>
            <StyledInputRange>
              <input
                type='range'
                value={percent * 100}
                onChange={(ev: any) => {
                  setPercent(ev.target.value);
                }}
              />
            </StyledInputRange>
          </div>
          <div className='mt-[30px]'>
            <Button
              text={type ? 'Unstake' : 'Stake'}
              errorTips=''
              loading={loading}
              onClick={onHandle}
              value={value}
              token={token}
              spender={type ? '' : data.vaultAddress}
            />
          </div>
          {!!balance && Big(balance).eq(0) && (
            <div className='mt-[16px] text-center text-[#FD4C67] text-[14px] font-medium'>
              You don’t have any {pool?.name} LP yet
            </div>
          )}
          {['BEX'].includes(pool?.protocol) && type === 0 && (
            <div
              onClick={() => {
                setShowMint(true);
              }}
              className='flex items-center justify-center gap-[8px] mt-[16px] text-center text-[18px] font-semibold'
            >
              <div>Mint {pool?.name} LP</div>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='8'
                height='14'
                viewBox='0 0 8 14'
                fill='none'
              >
                <path
                  d='M1 13L6 7L1 1'
                  stroke='black'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
              </svg>
            </div>
          )}
        </div>
      </Modal>
      <IncreaseLiquidityModal
        open={showMint}
        onClose={() => {
          setShowMint(false);
        }}
        token0={{ ...pool.underlying_tokens[0], icon: data.images[0] }}
        token1={{ ...pool.underlying_tokens[1], icon: data.images[1] }}
        dex={pool?.protocol}
      />
    </>
  );
}
