import LendingButton from '@/sections/Lending/components/button';
import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useProvider } from '@/hooks/use-provider';
import { useAccount } from 'wagmi';
import DolomiteConfig from '@/configs/lending/dolomite';
import { numberFormatter } from '@/utils/number-formatter';
import { useHandler } from '@/sections/Lending/hooks/use-handler';

const DolomiteHandler = dynamic(() => import('@/sections/Lending/handlers/dolomite'));

const { basic, networks }: any = DolomiteConfig;

const ActionPanel = (props: Props) => {
  const {
    token,
    isSkipApproved,
    title,
    style,
    className,
    actionText,
    placeholder,
    inputDisabled,
    CHAIN_ID,
    onSuccess,
  } = props;

  const networkConfig = networks[CHAIN_ID];
  const balance = useMemo(() => {
    if (actionText === 'Deposit') {
      return {
        value: token.walletBalance,
        shown: numberFormatter(token.walletBalance, 2, true),
      };
    }
    return {
      value: token.balance,
      shown: numberFormatter(token.balance, 2, true),
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
    handleBalance,
  } = useHandler({ balance: balance.value });

  return (
    <div style={style} className={`w-[302px] h-[159px] border border-black rounded-[20px] bg-[#FFFDEB] shadow-shadow1 p-[23px_20px_20px] ${className}`}>
      <div className="text-[16px] font-[600] leading-[90%]">{title}</div>
      <div className="mt-[17px]">
        <input
          value={amount}
          type="text"
          placeholder={placeholder}
          disabled={inputDisabled}
          className="w-full h-[40px] outline-[#FFDC50] leading-[38px] rounded-[12px] border border-[#373A53] bg-white text-[16px] font-[600] px-[10px]"
          onChange={handleAmount}
        />
      </div>
      <div className="flex justify-between items-center mt-[13px]">
        <div className="text-[14px] font-[400] text-black">
          Balance:&nbsp;
          <a
            href="javascript: void(0);"
            className="underline decoration-solid whitespace-nowrap"
            onClick={handleBalance}
          >
            {balance.shown}
          </a>
        </div>
        <LendingButton
          type="primary"
          disabled={disabled}
          loading={loading}
          style={{ fontSize: 14 }}
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
        >
          {actionText}
        </LendingButton>
      </div>
      <DolomiteHandler
        data={{
          config: {
            ...basic,
            ...networkConfig,
          },
          ...token,
          actionText,
        }}
        provider={provider}
        update={loading}
        chainId={chainId}
        account={address}
        amount={isMax ? balance.value : amount}
        onLoad={(txData: any) => {
          console.log('%chandler DATA onLoad: %o', 'background: #6439FF; color:#fff;', txData);
          setTxData(txData);
          setLoading(false);
        }}
      />
    </div>
  );
};

export default ActionPanel;

interface Props {
  title: string;
  actionText: string;
  placeholder?: string;
  inputDisabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
  token: any;
  isSkipApproved?: boolean;
  CHAIN_ID: number;
  onSuccess?(): void;
}
