'use client';
import { formatThousandsSeparator, formatValueDecimal } from '@/utils/balance';
import Big from 'big.js';
import clsx from 'clsx';
import { memo } from 'react';
import CircleLoading from '@/components/circle-loading';
import { useIBGT } from '@/hooks/use-ibgt';
import Popover, { PopoverPlacement } from '@/components/popover';
import { useRouter } from 'next/navigation';
import IbgtHead from '@/sections/bgt/components/ibgt-head';
import Vaults from './vaults';
import PageBack from '@/components/back';
export default memo(function IbgtMain() {
  const router = useRouter();
  const {
    data: ibgtData,
    tokenData: data,
    tabs,
    tIndex,
    setTIndex,
    state,
    isInSufficient,
    isWithdrawInsufficient,
    handleMax,
    handleTokenChange,
    handleLPChange,
    handleApprove,
    handleDeposit,
    handleWithdraw,
    handleClaim,
    symbol,
    handleMintIBGT
  } = useIBGT();
  const {
    balances,
    inAmount,
    isLoading,
    isTokenApproved,
    isTokenApproving,
    lpBalance,
    lpAmount
  } = state;

  return (
    <>
      <div className='relative mb-[24px] flex items-center h-[120px] rounded-[20px] bg-[#FFDC50]'>
        <div className='relative h-full flex-1 flex flex-col gap-[12px] pt-[34px] pl-[30px]'>
          <div className='text-[#3D405A] font-Montserrat text-[14px] font-medium'>
            APY
          </div>
          <div className='text-black font-Montserrat text-[20px] font-semibold leading-[90%]'>
            {Big(data?.apy ?? 0).toFixed(2)}%
          </div>
          <div className='absolute right-0 top-[37px] bottom-[34px] w-[1px] bg-black/[0.15]' />
        </div>
        <div className='relative h-full flex-1 flex flex-col gap-[12px] pt-[34px] pl-[30px]'>
          <div className='text-[#3D405A] font-Montserrat text-[14px] font-medium'>
            % of iBGT staked
          </div>
          <Popover
            placement={PopoverPlacement.BottomLeft}
            content={
              <div className='relative pt-[19px] px-[19px] pb-[23px] w-[240px] h-[165px] rounded-[20px] border border-black bg-[#FFFDEB] shadow-[10px_10px_0px_0px_rgba(0,0,0,0.25)]'>
                <div className='flex flex-col gap-[13px]'>
                  <div className='text-[#3D405A] font-Montserrat text-[14px] font-medium'>
                    Staked
                  </div>
                  <div className='text-black font-Montserrat text-[20px] font-semibold leading-[90%]'>
                    {formatThousandsSeparator(
                      formatValueDecimal(
                        ibgtData?.staked,
                        '',
                        2,
                        false,
                        true
                      )
                    )}{' '}
                    iBGT
                  </div>
                </div>
                <div className='absolute top-[82px] left-[12px] right-[9px] h-[1px] bg-[rgba(0, 0, 0, 0.15)]' />
                <div className='pt-[12px] flex flex-col gap-[13px]'>
                  <div className='text-[#3D405A] font-Montserrat text-[14px] font-medium'>
                    Total iBGT
                  </div>
                  <div className='text-black font-Montserrat text-[20px] font-semibold leading-[90%]'>
                    {formatThousandsSeparator(
                      formatValueDecimal(
                        ibgtData?.total,
                        '',
                        2,
                        false,
                        true
                      )
                    )}{' '}
                    iBGT
                  </div>
                </div>
              </div>
            }
          >
            <div className='cursor-pointer text-black font-Montserrat text-[20px] font-semibold leading-[90%] underline'>
              {ibgtData?.total
                ? Big(ibgtData?.staked)
                  .div(ibgtData?.total)
                  .times(100)
                  .toFixed(2)
                : '-'}
              %
            </div>
          </Popover>
          <div className='absolute right-0 top-[37px] bottom-[34px] w-[1px] bg-black/[0.15]' />
        </div>
        <div className='relative h-full flex-1 flex flex-col gap-[12px] pt-[34px] pl-[30px]'>
          <div className='text-[#3D405A] font-Montserrat text-[14px] font-medium'>
            Tvl
          </div>
          <div className='text-black font-Montserrat text-[20px] font-semibold leading-[90%]'>
            {formatValueDecimal(data?.tvl, '$', 2, true)}
          </div>
          <div className='absolute right-0 top-[37px] bottom-[34px] w-[1px] bg-black/[0.15]' />
        </div>
      </div>

      <div className='flex items-center gap-[30px]'>
        <div className='flex-1 pr-[24px] pl-[13px] h-[300px] bg-black/[0.06]'>
          <div className='pt-[21px] pr-[2px] pb-[46px] pl-[17px]'>
            <div className='mb-[21px] text-black font-Montserrat text-[18px] font-bold leading-[90%]'>
              Your Position
            </div>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-[10px]'>
                <div className='flex items-center'>
                  <div className='w-[30px] h-[30px] rounded-full'>
                    <img src={`/images/dapps/infrared/ibgt.svg`} />
                  </div>
                </div>
                <div className='text-black font-Montserrat text-[16px] font-semibold leading-[100%]'>
                  {formatValueDecimal(data?.depositAmount ?? 0, '', 2, false, false)} iBGT
                </div>
              </div>
            </div>
          </div>
          <div className='w-full h-[1px] bg-black/[0.15]' />
          <div className='pt-[19px] pl-[17px]'>
            <div className='mb-[27px] text-black font-Montserrat text-[18px] font-bold leading-[90%]'>
              Rewards
            </div>

            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-[14px]'>
                <div className='w-[32px] h-[32px] rounded-full'>
                  <img
                    src={`/images/dapps/infrared/${data?.rewardSymbol?.toLocaleLowerCase() ?? 'honey'
                      }.svg`}
                  />
                </div>

                <div className='text-black font-Montserrat text-[20px] font-semibold leading-[90%]'>
                  {formatValueDecimal(data?.earned, '', 2)}{' '}
                  {data?.rewardSymbol}
                </div>
              </div>
              {Big(data?.earned ?? 0).gt(0) && (
                <div
                  className='cursor-pointer flex items-center justify-center w-[148px] h-[46px] rounded-[10px] border border-black bg-[#FFDC50] text-black font-Montserrat text-[18px] font-semibold leading-[90%]'
                  onClick={handleClaim}
                >
                  Claim
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='flex-1 pt-[24px] pb-[20px] px-[20px] h-[300px]'>
          <div className='mb-[17px] flex items-center h-[56px] rounded-[12px] border border-[#373A53] bg-white p-[5px]'>
            {tabs.map((tab, index) => (
              <div
                key={index}
                className={clsx([
                  'cursor-pointer flex items-center justify-center border border-transparent rounded-[10px] flex-1',
                  tIndex === index
                    ? 'h-full  !border-black bg-[#FFDC50]'
                    : ''
                ])}
                onClick={() => {
                  setTIndex(index);
                }}
              >
                <span className='text-black font-Montserrat text-[18px] font-semibold leading-[90%]'>
                  {tab}
                </span>
              </div>
            ))}
          </div>

          {tIndex === 0 ? (
            <div>
              <input
                value={inAmount}
                type='number'
                onChange={(e) => handleTokenChange(e.target.value)}
                className='w-full h-[72px] pl-[20px] bg-white border border-[#373A53] rounded-[12px] text-[26px] font-[700]'
                placeholder='0'
              />
              <div className='flex justify-between px-[10px] pt-[12px] pb-[24px]'>
                <span className='text-[#3D405A] font-Montserrat text-[12px] font-medium'>
                  {inAmount
                    ? '$' +
                    Big(inAmount)
                      .times(data?.initialData?.stake_token?.price ?? 0)
                      .toFixed(2)
                    : '-'}
                </span>
                <div
                  className='cursor-pointer text-[#3D405A] font-Montserrat text-[12px] font-medium'
                  onClick={handleMax}
                >
                  balance:{' '}
                  <span className='underline'>
                    {Big(balances[symbol] ?? 0).toFixed(6)}
                  </span>
                </div>
              </div>
              {isInSufficient && (
                <button className='w-full h-[60px] flex items-center justify-center rounded-[10px] bg-[#FFDC50] border border-black opacity-50'>
                  <span className='text-black font-Montserrat text-[18px] font-semibold leading-[90%]'>
                    InSufficient Balance
                  </span>
                </button>
              )}
              {!isInSufficient &&
                (isTokenApproved && !isTokenApproving ? (
                  <button
                    disabled={isLoading || Number(inAmount) <= 0}
                    className={clsx(
                      'w-full h-[60px] flex items-center justify-center rounded-[10px] bg-[#FFDC50] border border-black',
                      {
                        'opacity-50': isLoading || Number(inAmount) <= 0
                      }
                    )}
                    onClick={handleDeposit}
                  >
                    <span className='text-black font-Montserrat text-[18px] font-semibold leading-[90%]'>
                      {isLoading ? <CircleLoading size={14} /> : 'Stake'}
                    </span>
                  </button>
                ) : (
                  <button
                    disabled={isTokenApproved || isTokenApproving}
                    className={clsx(
                      'w-full h-[60px] flex items-center justify-center rounded-[10px] bg-[#FFDC50] border border-black',
                      {
                        'opacity-50': isTokenApproved || isTokenApproving
                      }
                    )}
                    onClick={() => handleApprove()}
                  >
                    {isTokenApproving ? (
                      <CircleLoading size={14} />
                    ) : (
                      <>
                        {isTokenApproved ? 'Approved' : 'Approve'} {symbol}
                      </>
                    )}
                  </button>
                ))}
            </div>
          ) : (
            <div>
              <input
                value={lpAmount}
                type='number'
                onChange={(e) => {
                  handleLPChange(e.target.value);
                }}
                className='w-full h-[72px] pl-[20px] bg-white border border-[#373A53] rounded-[12px] text-[26px] font-[700]'
                placeholder='0'
              />
              <div className='flex justify-between px-[10px] pt-[12px] pb-[24px]'>
                <span className='text-[#3D405A] font-Montserrat text-[12px] font-medium'>
                  {lpAmount
                    ? '$' +
                    Big(lpAmount)
                      .times(data?.initialData?.stake_token?.price ?? 0)
                      .toFixed(2)
                    : '-'}
                </span>
                <div
                  className='cursor-pointer text-[#3D405A] font-Montserrat text-[12px] font-medium'
                  onClick={() => {
                    handleLPChange(lpBalance);
                  }}
                >
                  balance: <span className='underline'>{lpBalance}</span>
                </div>
              </div>
              <button
                disabled={
                  isWithdrawInsufficient ||
                  isLoading ||
                  Number(lpAmount) <= 0
                }
                className={clsx(
                  'w-full h-[60px]  font-semibold font-Montserrat flex items-center justify-center rounded-[10px] bg-[#FFDC50] border border-black',
                  {
                    'opacity-50':
                      isWithdrawInsufficient ||
                      isLoading ||
                      Number(lpAmount) <= 0
                  }
                )}
                onClick={handleWithdraw}
              >
                {isLoading ? (
                  <CircleLoading size={14} />
                ) : (
                  <>
                    {isWithdrawInsufficient
                      ? 'InSufficient Balance'
                      : 'Withdraw'}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
      <Vaults />
    </>

  )
})
