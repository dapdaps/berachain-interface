import { Props } from './index';
import LendingButton from '@/sections/Lending/components/button';
import { useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useProvider } from '@/hooks/use-provider';
import { useAccount } from 'wagmi';
import DolomiteConfig from '@/configs/lending/dolomite';
import { numberFormatter } from '@/utils/number-formatter';
import { useHandler } from '@/sections/Lending/hooks/use-handler';
import { motion } from 'framer-motion';
import Big from 'big.js';

const DolomiteHandler = dynamic(() => import('@/sections/Lending/handlers/dolomite'));

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
    addAction,
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

  const sliderRef = useRef(null);
  const [selected, setSelected] = useState<any>();

  const [dragValue, setDragValue] = useState<any>(0);
  const [dragStart, setDragStart] = useState<any>(0);
  const [dragPercent, setDragPercent] = useState<any>(0);

  const sliderWidth = useMemo(() => {
    if (!sliderRef.current) return 0;
    return parseFloat(getComputedStyle(sliderRef.current).width);
  }, [sliderRef.current]);

  const setPercentAmount = (_percent: number) => {
    const _amount = Big(balance.value).times(Big(_percent).div(100)).toFixed(token.decimals);
    setAmount(_amount.replace(/[.]?0+$/, ''));
  };

  const handleSlider = (event: any, info: any) => {
    if (!balance.value || Big(balance.value).lte(0)) return;
    const newValue = Math.max(0, Math.min(sliderWidth - 22, dragStart + info.offset.x));
    setDragValue(newValue);
    const _percent = Big(newValue).div(sliderWidth - 22).times(100).toNumber();
    setDragPercent(Math.max(0, Math.min(100, _percent)));
    setPercentAmount(_percent);
  };

  const handleDragStart = (event: any, info: any) => {
    setSelected(void 0);
    setDragStart(dragValue);
  };

  const handleDragEnd = (event: any, info: any) => {
    if (!balance.value || Big(balance.value).lte(0)) return;
    const val = Math.max(0, Math.min(sliderWidth - 22, dragStart + info.offset.x));
    setDragValue(val);
    const _percent = Big(val).div(sliderWidth - 22).times(100).toNumber();
    setDragPercent(Math.max(0, Math.min(100, _percent)));
    setPercentAmount(_percent);
  };

  const handleSelected = (_selected: any) => {
    if (!balance.value || Big(balance.value).lte(0)) return;
    setSelected(_selected.value);
    const val = Big(sliderWidth).minus(22).times(_selected.value).toNumber();
    setDragValue(val);
    const _percent = Big(val).div(sliderWidth - 22).times(100).toNumber();
    setDragPercent(Math.max(0, Math.min(100, _percent)));
    setPercentAmount(_percent);
  };

  return (
    <>
      <div className="mt-[17px]">
        <input
          value={amount}
          type="text"
          placeholder={placeholder}
          disabled={inputDisabled}
          className="w-full h-[40px] md:h-[56px] md:text-[20px] outline-[#FFDC50] leading-[38px] rounded-[12px] border border-[#373A53] bg-white text-[16px] font-[600] px-[10px]"
          onChange={handleAmount}
        />
      </div>
      {
        isMobile && (
          <>
            <div className="flex justify-end items-center mt-[5px]">
              <Balance balance={balance} handleBalance={handleBalance} />
            </div>
            <div className="mt-[14px] flex justify-between items-center gap-[8px]">
              {
                BalancePercentList.map((percent) => (
                  <motion.div
                    className="flex-1 border border-[#373A53] rounded-[8px] h-[32px] leading-[30px] text-center text-black text-[14px] font-[400]"
                    key={percent.value}
                    variants={{
                      active: {
                        background: '#FFDC50',
                      },
                    }}
                    animate={selected === percent.value ? 'active' : ''}
                    onClick={() => handleSelected(percent)}
                  >
                    {percent.label}
                  </motion.div>
                ))
              }
            </div>
            <div className="flex justify-between items-center gap-[15px] mt-[23px]">
              <div ref={sliderRef} className="relative h-[8px] rounded-[12px] bg-[#DFDCC4] flex-1">
                <motion.div
                  className="absolute left-0 top-[-8px] w-[22px] h-[22px] rounded-full bg-[#FFDC50] border border-black"
                  drag="x"
                  dragConstraints={sliderRef}
                  dragMomentum={false}
                  onDrag={handleSlider}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  style={{
                    x: dragValue,
                  }}
                />
              </div>
              <div className="text-black text-[14px] font-[400] w-[35px] shrink-0">
                {Big(dragPercent).toFixed(0)}%
              </div>
            </div>
          </>
        )
      }
      <div className="flex justify-between items-center mt-[13px]">
        {
          !isMobile && (
            <Balance balance={balance} handleBalance={handleBalance} />
          )
        }
        <LendingButton
          type="primary"
          disabled={disabled}
          loading={loading}
          style={isMobile ? {
            width: '100%',
            fontSize: 18,
            fontWeight: 600,
            height: 46,
            lineHeight: '44px',
            marginTop: 37,
            color: '#000',
          } : { fontSize: 14 }}
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
    </>
  );
};

export default ActionPanelForm;

const BalancePercentList = [
  { value: 0.25, label: '25%' },
  { value: 0.5, label: '50%' },
  { value: 0.75, label: '75%' },
  { value: 1, label: 'Max' },
];

const Balance = (props: any) => {
  const { handleBalance, balance } = props;

  return (
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
  );
};
