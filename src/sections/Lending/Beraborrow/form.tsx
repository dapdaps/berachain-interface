import Modal from '@/components/modal';
import Info from '@/sections/Lending/Beraborrow/info';
import CurrencyInput from '@/sections/Lending/components/input';
import Health from '@/sections/Lending/Beraborrow/health';
import Popover, { PopoverPlacement, PopoverTrigger } from '@/components/popover';
import Card from '@/components/card';
import InputNumber from '@/components/input-number';
import Big from 'big.js';
import { numberFormatter, numberRemoveEndZero } from '@/utils/number-formatter';
import dynamic from 'next/dynamic';
import LendingButton from '@/sections/Lending/components/button';
import { DEFAULT_CHAIN_ID } from '@/configs';
import ClosePositionModal from '@/sections/Lending/Beraborrow/close';
import useIsMobile from '@/hooks/use-isMobile';
import { ActionText, CollateralAction, useBeraborrow } from '../hooks/use-beraborrow';

const BeraborrowHandler = dynamic(() => import('@/sections/Lending/handlers/beraborrow'));

export const Form = (props: any) => {
  const {
    type,
    market,
    riskyRatio,
    borrowingFee,
    liquidationReserve,
    minimumDebt,
    basic,
    network,
    onSuccess,
    isMobile,
    onClose,
  } = props;

  const {
    handleClosePosition,
    loading,
    amount,
    borrowAmount,
    totalAmount,
    totalBorrowAmount,
    liquidationPriceNew,
    handleAmount,
    collateralBalance,
    previewAmount,
    borrowTokenLabel,
    borrowBalance,
    handleBorrowAmount,
    borrowLimit,
    ratioRisk,
    ratio,
    handleRatio,
    buttonValid,
    inputLoading,
    toastLoadingMsg,
    provider,
    txData,
    getTxData,
    reloadList,
    addAction,
    actionText,
    chainId,
    address,
    totalCollAmount,
    ratioValue,
    setTxData,
    setLoading,
    setInputLoading,
    closePosition,
    setClosePosition,
  } = useBeraborrow(props);

  return (
    <div
      className="px-[12px] py-[20px] flex justify-between items-stretch gap-4"
      style={isMobile ? { flexDirection: 'column', maxHeight: '80dvh', overflow: 'auto' } : {}}
    >
      <Info
        {...props}
        onClose={handleClosePosition}
        loading={loading}
        style={isMobile ? { width: '100%', order: 2 } : {}}
        newValue={((amount && Big(amount).gt(0)) || (borrowAmount && Big(borrowAmount).gt(0))) ? {
          balanceUsdShown: numberFormatter(Big(totalAmount).times(market.price || 1), 2, true, { prefix: '$' }),
          balanceShown: numberFormatter(totalAmount, 2, true),
          borrowedShown: numberFormatter(totalBorrowAmount, 2, true),
          liquidationPriceShown: numberFormatter(liquidationPriceNew, 2, true, { prefix: '$', round: Big.roundDown }),
          liquidationPrice: liquidationPriceNew,
        } : {}}
      />
      <div
        className="w-[450px] shrink-0 flex flex-col items-stretch gap-[10px]"
        style={isMobile ? { width: '100%', order: 1 } : {}}
      >
        <div className="text-black text-[16px] font-[600]">
          {CollateralAction[type]} Collateral
        </div>
        <CurrencyInput
          className=""
          token={{
            ...(type === ActionText.Repay ? { ...market.collToken, price: market.price } : market),
            balance: collateralBalance,
          }}
          amount={amount}
          onAmount={handleAmount}
          onBalance={() => {
            handleAmount(collateralBalance);
          }}
          tokens={[]}
          tokenSelectorStyle={{
            width: isMobile ? "auto" : 176,
          }}
          renderValue={(_amount: string) => {
            return numberFormatter(Big(previewAmount || 0).times(market.price || 1).toFixed(2, Big.roundDown), 2, true, { prefix: '$' });
          }}
        />
        <div className="text-black text-[16px] font-[600]">
          {borrowTokenLabel}
        </div>
        <CurrencyInput
          className=""
          balanceText={type !== ActionText.Repay ? 'Limit' : void 0}
          token={{
            ...market?.borrowToken,
            balance: borrowBalance,
          }}
          amount={borrowAmount}
          onAmount={handleBorrowAmount}
          onBalance={() => {
            if (type === ActionText.Repay) {
              let _maxRepay = Big(totalBorrowAmount || 0).minus(minimumDebt).minus(liquidationReserve);
              handleBorrowAmount(numberRemoveEndZero(_maxRepay.toFixed(8)));
              return;
            }
            handleBorrowAmount(borrowLimit);
          }}
          tokens={[]}
        />
        <div className="text-black text-[16px] font-[600] flex justify-between items-center">
          <div className="flex items-center gap-[5px]">
            <div>Updated Ratio</div>
            <Popover
              trigger={PopoverTrigger.Hover}
              placement={PopoverPlacement.Top}
              contentStyle={{ zIndex: 200 }}
              content={(
                <Card className="w-[300px] text-[14px]">
                  The ratio of your bHONEY's value to your NECT debt. It's vital to maintain this ratio above the minimum ratio of {market.MCR}% to avoid liquidations
                </Card>
              )}
            >
              <img src="/images/icon-tips.svg" alt="" className="w-[18px] h-[18px] cursor-pointer" />
            </Popover>
          </div>
          <Health risk={ratioRisk} />
        </div>
        <div className="w-full h-[72px] relative">
          <InputNumber
            className="w-full h-full border border-[#373A53] bg-white rounded-[12px] text-[26px] font-[700] pl-[20px] pr-[40px]"
            placeholder="0"
            value={ratio}
            onNumberChange={handleRatio}
          />
          <div className="absolute right-[20px] top-0 h-full flex items-center text-[26px] font-[700] text-black">%</div>
        </div>
        <div className="w-full mt-[10px]">
          <LendingButton
            type="primary"
            disabled={!buttonValid.valid || loading}
            invalidText={buttonValid.valid ? void 0 : buttonValid.text}
            loading={loading || inputLoading}
            style={{ height: 60, width: '100%' }}
            amount={buttonValid.actionAmounts[0] || ''}
            token={market}
            toastLoadingMsg={toastLoadingMsg}
            chain={{ chainId: DEFAULT_CHAIN_ID }}
            isSkipApproved={type !== ActionText.Borrow || (market.status === 'open' && Big(amount || 0).lte(0))}
            isSkipAmountEmptyCheck={market.status === 'open' && (Big(amount || 0).gt(0) || Big(borrowAmount || 0).gt(0))}
            spender={market.approveSpender || network[market.vault]}
            provider={provider}
            unsignedTx={txData?.unsignedTx}
            gas={txData?.gas}
            config={{ ...basic, ...network }}
            onApprovedSuccess={() => {
              getTxData();
            }}
            onSuccess={() => {
              reloadList();
            }}
            addAction={addAction}
            addActionText={buttonValid.actions[0]}
            addActionToken={buttonValid.actionTokens[0]}
          >
            {buttonValid.text}
          </LendingButton>
        </div>
      </div>

      <BeraborrowHandler
        config={{
          ...basic,
          ...network,
        }}
        market={market}
        actionText={actionText}
        provider={provider}
        update={loading}
        chainId={chainId}
        account={address}
        amount={amount}
        borrowAmount={borrowAmount}
        totalAmount={totalAmount}
        totalCollAmount={totalCollAmount}
        totalBorrowAmount={totalBorrowAmount}
        ratio={ratioValue}
        onLoad={(txData: any) => {
          console.log('%chandler DATA onLoad: %o', 'background: #6439FF; color:#fff;', txData);
          setTxData(txData);
          setLoading(false);
          setInputLoading(false);
        }}
      />

      <ClosePositionModal
        {...props}
        visible={closePosition}
        onClose={() => {
          setClosePosition(false);
        }}
      />
    </div>
  );
};

const BorrowModal = (props: any) => {
  const { visible, onClose, type } = props;

  const isMobile = useIsMobile();

  return (
    <Modal
      open={visible}
      onClose={onClose}
      isMaskClose={isMobile}
    >
      <div
        className="bg-[#FFFDEB] rounded-[20px] border border-black shadow-shadow1"
        style={{ width: isMobile ? '100%' : 900 }}
      >
        <div className="text-black font-[700] text-[18px] px-[12px] pt-[20px]">
          {type === ActionText.Repay ? 'Manage' : type}
        </div>
        <Form {...props} isMobile={isMobile} />
      </div>
    </Modal>
  );
};

export default BorrowModal;
