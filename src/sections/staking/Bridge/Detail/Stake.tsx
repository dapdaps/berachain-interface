import Big from 'big.js';
import { balanceFormated } from '@/utils/balance';
import { StakePrompt } from '@/sections/staking/Bridge/Detail/StakePrompt';
import clsx from 'clsx';
import CircleLoading from '@/components/circle-loading';
import InputNumber from '@/components/input-number';

const Stake = (props: any) => {
  const {
    id,
    symbol,
    data,
    inAmount,
    handleTokenChange,
    balances,
    isBERPS,
    isInSufficient,
    isTokenApproved,
    isTokenApproving,
    isLoading,
    handleDeposit,
    handleApprove,
    handleMax,
  } = props;

  return (
    <div>
      <InputNumber
        value={inAmount}
        onChange={(e) => handleTokenChange(e.target.value, id)}
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
          className='text-[#3D405A] font-Montserrat text-[12px] font-medium cursor-pointer'
          onClick={handleMax}
        >
          balance:{' '}
          <span className='underline'>
                    {balanceFormated(balances[symbol] ?? 0, 6)}
                  </span>
        </div>
      </div>
      {
        isBERPS && (
          <StakePrompt />
        )
      }
      {isInSufficient && (
        <button className="w-full h-[60px] flex items-center justify-center rounded-[10px] bg-[#FFDC50] border border-black opacity-50">
                  <span className="text-black font-Montserrat text-[18px] font-semibold leading-[90%]">
                    InSufficient Balance
                  </span>
        </button>
      )}
      {!isInSufficient &&
        (isTokenApproved && !isTokenApproving ? (
          <button
            disabled={isLoading || Number(inAmount || 0) <= 0}
            className={clsx(
              'w-full h-[60px] flex items-center justify-center rounded-[10px] bg-[#FFDC50] border border-black',
              {
                'opacity-50': isLoading || Number(inAmount || 0) <= 0
              }
            )}
            onClick={handleDeposit}
          >
                    <span className='text-black font-Montserrat text-[18px] font-semibold leading-[90%]'>
                      {isLoading ? <CircleLoading size={14} /> : isBERPS ? 'Deposit' : 'Stake'}
                    </span>
          </button>
        ) : (
          <button
            disabled={isTokenApproved || isTokenApproving}
            className={clsx(
              'w-full h-[60px] flex items-center justify-center rounded-[10px] bg-[#FFDC50] border border-black text-[18px] font-semibold',
              {
                'opacity-50': isTokenApproved || isTokenApproving
              }
            )}
            onClick={() => handleApprove(true)}
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
  );
};

export default Stake;
