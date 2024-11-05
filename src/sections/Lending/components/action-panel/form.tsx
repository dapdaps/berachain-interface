import { Props } from './index';
import LendingButton from '@/sections/Lending/components/button';
import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useProvider } from '@/hooks/use-provider';
import { useAccount } from 'wagmi';
import DolomiteConfig from '@/configs/lending/dolomite';
import { numberFormatter } from '@/utils/number-formatter';
import { useHandler } from '@/sections/Lending/hooks/use-handler';
import AmountSelector from '@/sections/Lending/components/amount-selector';

const DolomiteHandler = dynamic(
  () => import('@/sections/Lending/handlers/dolomite')
);

const { basic, networks }: any = DolomiteConfig;

const ActionPanelForm = (props: Props) => {
  const {
    isMobile,
    token,
    isSkipApproved,
    actionText,
    placeholder,
    inputDisabled,
    CHAIN_ID,
    onSuccess,
    addAction
  } = props;

  const networkConfig = networks[CHAIN_ID];
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

  const { address, chainId } = useAccount();
  const { provider } = useProvider();

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
    <>
      <div className='mt-[17px]'>
        <input
          value={amount}
          type='text'
          placeholder={placeholder}
          disabled={inputDisabled}
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
          isSkipApproved={isSkipApproved}
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
      <DolomiteHandler
        data={{
          config: {
            ...basic,
            ...networkConfig
          },
          ...token,
          actionText
        }}
        provider={provider}
        update={loading}
        chainId={chainId}
        account={address}
        amount={isMax ? balance.value : amount}
        onLoad={(txData: any) => {
          console.log(
            '%chandler DATA onLoad: %o',
            'background: #6439FF; color:#fff;',
            txData
          );
          setTxData(txData);
          setLoading(false);
        }}
      />
    </>
  );
};

export default ActionPanelForm;

const BalancePercentList = [
  { value: 0.25, label: '25%' },
  { value: 0.5, label: '50%' },
  { value: 0.75, label: '75%' },
  { value: 1, label: 'Max' }
];

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
