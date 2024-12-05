import Modal from '@/components/modal';
import { Item } from '@/sections/Lending/Beraborrow/info';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { ActionText } from '@/sections/Lending/Beraborrow/form';
import { useAccount } from 'wagmi';
import { useProvider } from '@/hooks/use-provider';
import useAddAction from '@/hooks/use-add-action';
import LendingButton from '@/sections/Lending/components/button';
import { DEFAULT_CHAIN_ID } from '@/configs';
import Big from 'big.js';
import { numberFormatter } from '@/utils/number-formatter';

const BeraborrowHandler = dynamic(() => import('@/sections/Lending/handlers/beraborrow'));

export const ClosePosition = (props: any) => {
  const {
    onClose,
    market,
    borrowToken,
    basic,
    network,
    onSuccess,
    liquidationReserve,
  } = props;

  const balance = market?.borrowToken?.walletBalance || 0;

  const { address, chainId } = useAccount();
  const { provider } = useProvider();
  const { addAction } = useAddAction("lending");

  const [loading, setLoading] = useState(false);
  const [txData, setTxData] = useState<any>();
  const buttonValid = useMemo(() => {
    const result = {
      valid: true,
      text: 'Confirm',
    };
    if (Big(market?.borrowed || 0).gt(balance)) {
      result.valid = false;
      result.text = `Insufficient ${market?.borrowToken?.symbol} Balance`;
      return result;
    }
    return result;
  }, [market]);

  useEffect(() => {
    setLoading(true);
  }, []);

  return (
    <div className="px-[12px] py-[20px] flex flex-col items-stretch gap-[5px]">
      <Item
        label="Amount to Repay"
        value={`${numberFormatter(Big(market?.borrowed).minus(liquidationReserve), 5, true)} ${borrowToken?.symbol}`}
      />
      <Item
        label="Amount to Receive"
        value={`${numberFormatter(market?.balance, 5, true)} ${market?.collToken?.symbol}`}
      />
      <div className="text-[14px] text-[#3D405A] font-[500] text-center">
        Please Note you will receive {market?.collToken?.symbol}
      </div>
      <LendingButton
        type="primary"
        disabled={loading || !buttonValid.valid}
        loading={loading}
        style={{ height: 60, width: '100%', marginTop: 10 }}
        invalidText={buttonValid.valid ? void 0 : buttonValid.text}
        amount={market?.balance || ''}
        token={market}
        chain={{ chainId: DEFAULT_CHAIN_ID }}
        spender={network.spenderAddress}
        provider={provider}
        unsignedTx={txData?.unsignedTx}
        gas={txData?.gas}
        config={{ ...basic, ...network }}
        isSkipApproved={true}
        onSuccess={() => {
          onClose?.();
          onSuccess?.();
        }}
        addAction={addAction}
        addActionText="Close"
      >
        Confirm
      </LendingButton>
      <BeraborrowHandler
        config={{
          ...basic,
          ...network,
        }}
        market={market}
        actionText={ActionText.Close}
        provider={provider}
        update={loading}
        chainId={chainId}
        account={address}
        amount={market?.balance}
        borrowAmount={market?.borrowed}
        onLoad={(txData: any) => {
          console.log('%chandler DATA onLoad: %o', 'background: #6439FF; color:#fff;', txData);
          setTxData(txData);
          setLoading(false);
        }}
      />
    </div>
  );
};

export const ClosePositionModal = (props: any) => {
  const { visible, onClose } = props;

  return (
    <Modal
      open={visible}
      onClose={onClose}
      isMaskClose={false}
    >
      <div className="bg-[#FFFDEB] rounded-[20px] border border-black shadow-shadow1 w-[400px]">
        <div className="text-black font-[700] text-[18px] px-[12px] pt-[20px]">
          Close Position
        </div>
        <ClosePosition {...props} />
      </div>
    </Modal>
  );
};

export default ClosePositionModal;
