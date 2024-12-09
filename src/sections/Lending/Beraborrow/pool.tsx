import InputNumber from '@/components/input-number';
import { useMemo, useState } from 'react';
import AmountSelector from '@/sections/Lending/components/amount-selector';
import LendingButton from '@/sections/Lending/components/button';
import useIsMobile from '@/hooks/use-isMobile';
import { numberFormatter } from '@/utils/number-formatter';
import { useHandler } from '@/sections/Lending/hooks/use-handler';
import BeraborrowConfig from '@/configs/lending/beraborrow';
import { useProvider } from '@/hooks/use-provider';
import dynamic from 'next/dynamic';
import { useAccount } from 'wagmi';

const { basic, networks }: any = BeraborrowConfig;
const BeraborrowHandler = dynamic(() => import('@/sections/Lending/handlers/beraborrow'));

const Pool = (props: any) => {
  const { className, title, token, actionText, CHAIN_ID, onSuccess, addAction } = props;
  const networkConfig = networks[CHAIN_ID];

  const isMobile = useIsMobile();
  const { address, chainId } = useAccount();
  const { provider } = useProvider();

  const balance = useMemo(() => {
    if (actionText === 'Deposit') {
      return {
        value: token.walletBalance,
        shown: numberFormatter(token.walletBalance, 2, true)
      };
    }
    return {
      value: token.balance,
      shown: numberFormatter(token.balance, 2, true)
    };
  }, [token, actionText]);

  const {
    amount,
    disabled,
    loading,
    txData,
    isMax,
    setLoading,
    setTxData,
    setAmount,
    handleAmount,
    handleBalance
  } = useHandler({ balance: balance.value });

  return (
    <div className="">
      <div className={`w-[302px] h-min-[160px] bg-[#FFFDEB] shadow-shadow1 border border-black rounded-[20px] p-5 ${className}`}>
        <h2 className="font-Montserrat text-base font-semibold leading-[14.4px] text-left mb-[18px]">
          {title}
        </h2>
        <div className="">
          <div className='mt-[17px]'>
            <InputNumber
              value={amount}
              placeholder="0.00"
              className='w-full h-[40px] md:h-[56px] md:text-[20px] outline-[#FFDC50] leading-[38px] rounded-[12px] border border-[#373A53] bg-white text-[16px] font-[600] px-[10px]'
              onChange={handleAmount}
            />
          </div>
          {isMobile && (
            <AmountSelector
              token={token}
              setAmount={(val: any) => handleAmount({ target: { value: val } })}
              balance={balance}
            >
              <Balance balance={balance} handleBalance={handleBalance} />
            </AmountSelector>
          )}
          <div className='flex justify-between items-center mt-[13px]'>
            {!isMobile && (
              <Balance balance={balance} handleBalance={handleBalance} />
            )}
            <LendingButton
              type='primary'
              disabled={disabled}
              loading={loading}
              style={
                isMobile
                  ? {
                    width: '100%',
                    fontSize: 18,
                    fontWeight: 600,
                    height: 46,
                    lineHeight: '44px',
                    marginTop: 37,
                    color: '#000'
                  }
                  : { fontSize: 14 }
              }
              amount={amount}
              token={token}
              chain={{ chainId: CHAIN_ID }}
              spender={networkConfig.spenderAddress}
              onSuccess={() => {
                onSuccess?.();
                setAmount('');
              }}
              isSkipApproved={true}
              isApproveMax={true}
              provider={provider}
              unsignedTx={txData?.unsignedTx}
              gas={txData?.gas}
              config={{ ...basic, ...networkConfig }}
              onApprovedSuccess={() => {
                setLoading(true);
              }}
              addAction={addAction}
            >
              {actionText}
            </LendingButton>
          </div>
        </div>
      </div>
      <BeraborrowHandler
        config={{
          ...basic,
          ...networkConfig,
        }}
        market={token}
        actionType="Earn"
        actionText={actionText}
        provider={provider}
        update={loading}
        chainId={chainId}
        account={address}
        amount={amount}
        onLoad={(txData: any) => {
          console.log('%chandler DATA onLoad: %o', 'background: #6439FF; color:#fff;', txData);
          setTxData(txData);
          setLoading(false);
        }}
      />
    </div>
  );
};

export default Pool;

const Balance = (props: any) => {
  const { handleBalance, balance } = props;

  return (
    <div className='text-[14px] font-[400] text-black'>
      Balance:&nbsp;
      <a
        href='javascript: void(0);'
        className='underline decoration-solid whitespace-nowrap'
        onClick={handleBalance}
      >
        {balance.shown}
      </a>
    </div>
  );
};
