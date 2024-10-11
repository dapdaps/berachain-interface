import { numberFormatter } from '@/utils/number-formatter';
import SwitchTabs from '@/components/switch-tabs';
import { useEffect, useMemo, useState } from 'react';
import Empty from '@/components/empty';
import LendingButton from '@/sections/Lending/components/button';
import TokenSelector from '@/sections/Lending/components/token-selector';
import Big from 'big.js';
import DolomiteConfig from '@/configs/lending/dolomite';
import { useAccount } from 'wagmi';
import { useProvider } from '@/hooks/use-provider';
import dynamic from 'next/dynamic';
import { useHandler } from '@/sections/Lending/hooks/use-handler';

const DolomiteHandler = dynamic(() => import('@/sections/Lending/handlers/dolomite'));

const { basic, networks }: any = DolomiteConfig;

const Tabs = [
  { value: 'Add Collateral', label: 'Add' },
  { value: 'Remove Collateral', label: 'Remove' },
  { value: 'Borrow', label: 'Borrow' },
  { value: 'Repay', label: 'Repay' },
];

const Position = (props: Props) => {
  const { position, CHAIN_ID, onSuccess } = props;

  const networkConfig = networks[CHAIN_ID];

  const { address, chainId } = useAccount();
  const { provider } = useProvider();

  const [currentTab, setCurrentTab] = useState(Tabs[0].value);
  const [tokens, setTokens] = useState<any>([]);
  const [tokenSelectVisible, setTokenSelectVisible] = useState<any>(false);
  const [tokenSelected, setTokenSelected] = useState<any>();

  const {
    amount,
    disabled,
    loading,
    txData,
    isMax,
    setAmount,
    setLoading,
    setTxData,
    handleAmount,
    handleBalance,
  } = useHandler({ balance: tokenSelected?.balance });

  const isClosePosition = useMemo(() => {
    if (currentTab !== Tabs[1].value) return false;
    if (Big(position.totalBorrowedUsdValue).gt(0)) return false;
    if (!amount) return false;
    return Big(amount).times(tokenSelected.price).gte(position.totalBorrowedUsdValue);
  }, [currentTab, position, amount, tokenSelected]);

  const isRepayAll = useMemo(() => {
    if (currentTab !== Tabs[3].value) return false;
    if (!amount) return false;
    return Big(amount).gte(tokenSelected.balance);
  }, [currentTab, position, amount, tokenSelected]);

  const handleCurrentTab = (tab: string) => {
    if (tab === currentTab) return;
    // Add Collateral
    if (tab === Tabs[0].value) {
      setTokens(position.addCollateralTokens);
      setTokenSelected(position.addCollateralTokens[0]);
    }
    // Remove Collateral
    if (tab === Tabs[1].value) {
      setTokens(position.removeCollateralTokens);
      setTokenSelected(position.removeCollateralTokens[0]);
    }
    // Borrow
    if (tab === Tabs[2].value) {
      setTokens(position.borrowTokens);
      setTokenSelected(position.borrowTokens[0]);
    }
    // Repay
    if (tab === Tabs[3].value) {
      setTokens(position.repayTokens);
      setTokenSelected(position.repayTokens[0]);
    }
    setAmount('');
    setCurrentTab(tab);
  };

  useEffect(() => {
    const _tokens = position.addCollateralTokens;
    setTokens(_tokens);
    setTokenSelected(_tokens[0]);
  }, []);

  return (
    <div className="mb-[24px]">
      <div className="bg-[#FFDC50] rounded-[10px] p-[16px_19px]">
        <div className="text-[26px] font-[600]">Your Position</div>
        <div className="flex items-center gap-[64px] mt-[17px]">
          <Summary label="Collateral" value={position.totalCollateralUsd} prefix="$" />
          <Summary label="Borrowing" value={position.totalBorrowedUsd} prefix="$" />
          <Summary label="Health" value={position.healthFactor} />
          {/*<Summary label="Net interest" value="0" unit="%" />*/}
        </div>
      </div>
      <div className="flex justify-between items-stretch gap-[30px] mt-[24px]">
        <div className="bg-[rgba(0,_0,_0,_0.06)] rounded-[10px] p-[20px_24px] flex-1">
          <div className="collateral">
            <div className="text-[18px] font-[700] text-black">Collateral</div>
            <div className="flex gap-[10px] mt-[20px] flex-wrap">
              {
                position.removeCollateralTokens.length > 0 ? position.removeCollateralTokens.map((token: any, idx: number) => (
                  <TokenItem
                    key={idx}
                    symbol={token.symbol}
                    name={token.name}
                    icon={token.icon}
                    value={numberFormatter(token.currentPositionCollateralUsd, 2, true, { prefix: '$' })}
                    amount={numberFormatter(token.currentPositionCollateralValue, 4, true)}
                  />
                )) : (
                  <div className="w-full flex justify-center items-center">
                    <Empty size={50} desc="No collateral" />
                  </div>
                )
              }
            </div>
          </div>
          <div className="borrowing mt-[20px]">
            <div className="text-[18px] font-[700] text-black">Borrowing</div>
            <div className="flex gap-[10px] mt-[20px] flex-wrap">
              {
                position.repayTokens.length > 0 ? position.repayTokens.map((token: any, idx: number) => (
                  <TokenItem
                    key={idx}
                    symbol={token.symbol}
                    name={token.name}
                    icon={token.icon}
                    value={numberFormatter(token.currentTokenBorrowUsd, 2, true, { prefix: '$' })}
                    amount={numberFormatter(token.currentTokenBorrow, 4, true)}
                  />
                )) : (
                  <div className="w-full flex justify-center items-center">
                    <Empty size={50} desc="No borrowing" />
                  </div>
                )
              }
            </div>
          </div>
        </div>
        <div className="bg-[rgba(0,_0,_0,_0.06)] rounded-[10px] p-[20px_24px] flex-1">
          <SwitchTabs
            tabs={Tabs.map((tab) => {
              const obj = { ...tab, disabled: false };
              // add
              if (tab.value === Tabs[0].value) {
                if (!position.addCollateralTokens.length) {
                  obj.disabled = true;
                }
              }
              // remove
              if (tab.value === Tabs[1].value) {
                if (!position.removeCollateralTokens.length) {
                  obj.disabled = true;
                }
              }
              // borrow
              if (tab.value === Tabs[2].value) {
                if (!position.borrowTokens.length) {
                  obj.disabled = true;
                }
              }
              // repay
              if (tab.value === Tabs[3].value) {
                if (!position.repayTokens.length) {
                  obj.disabled = true;
                }
              }
              return obj;
            })}
            current={currentTab}
            onChange={handleCurrentTab}
          />
          <div className="mt-[17px]">
            <div className="relative w-full h-[72px] leading-[70px]">
              <div
                onClick={() => {
                  setTokenSelectVisible(true);
                }}
                className="absolute right-[14px] top-[50%] translate-y-[-50%] w-[176px] h-[46px] flex justify-between items-center rounded-[8px] border border-[#373A53] bg-[#FFFDEB] p-[10px_14px_10px_7px]"
              >
                <div className="flex items-center gap-[8px]">
                  <img src={tokenSelected?.icon} alt="" className="w-[26px] h-[26px] rounded-full border-0" />
                  <div className="leading-none">
                    <div className="text-[16px] font-[600] text-black">{tokenSelected?.symbol}</div>
                    <div className="text-[12px] text-[#3D405A] font-[500] mt-[3px]">{tokenSelected?.name}</div>
                  </div>
                </div>
                <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L6 5L11 1" stroke="black" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <input
                type="text"
                className="w-full h-full border border-[#373A53] bg-white rounded-[12px] text-[26px] font-[700] pl-[20px] pr-[200px]"
                placeholder="0"
                value={amount}
                onChange={handleAmount}
              />
            </div>
            <div className="flex justify-end items-center py-[12px]">
              <div className="text-[#3D405A] text-[12px] font-[500]">
                balance:&nbsp;
                <span
                  className="underline"
                  onClick={handleBalance}
                >
                  {numberFormatter(tokenSelected?.balance, 4, true)}
                </span>
              </div>
            </div>
            <LendingButton
              type="primary"
              disabled={disabled}
              loading={loading}
              style={{ height: 60, marginTop: 12, width: '100%' }}
              amount={amount}
              token={tokenSelected}
              chain={{ chainId: CHAIN_ID }}
              spender={networkConfig.spenderAddress}
              isSkipApproved={true}
              provider={provider}
              unsignedTx={txData?.unsignedTx}
              gas={txData?.gas}
              config={{ ...basic, ...networkConfig }}
              onApprovedSuccess={() => {
                setLoading(true);
              }}
              onSuccess={() => {
                onSuccess?.();
              }}
            >
              {currentTab}
            </LendingButton>
          </div>
        </div>
      </div>
      <TokenSelector
        visible={tokenSelectVisible}
        selected={tokenSelected}
        tokens={tokens}
        onClose={() => {
          setTokenSelectVisible(false);
        }}
        onSelect={(token: any) => {
          setTokenSelected(token);
          setAmount('');
        }}
      />
      <DolomiteHandler
        data={{
          config: {
            ...basic,
            ...networkConfig,
          },
          ...tokenSelected,
          position,
          actionText: currentTab,
          isClosePosition,
          isRepayAll,
        }}
        provider={provider}
        update={loading}
        chainId={chainId}
        account={address}
        amount={isMax ? tokenSelected?.balance : amount}
        onLoad={(txData: any) => {
          console.log('%chandler DATA onLoad: %o', 'background: #6439FF; color:#fff;', txData);
          setTxData(txData);
          setLoading(false);
        }}
      />
    </div>
  );
};

export default Position;

interface Props {
  position: any;
  CHAIN_ID: number;
  onSuccess?(): void;
}

const Summary = (props: SummaryProps) => {
  const { label, value, prefix, unit } = props;

  const isNum = /^\d+[.]?\d*$/.test(value);

  return (
    <div className="flex flex-col items-start gap-[12px]">
      <div className="text-[#3D405A] text-[14px] font-[500]">{label}</div>
      <div className="text-black text-[20px] font-[600]">
        {
          isNum ?
            numberFormatter(value, 2, true, { prefix, isZeroPrecision: true }) :
            value
        }
        {unit}
      </div>
    </div>
  );
};

interface SummaryProps {
  label: string;
  value: string;
  prefix?: string;
  unit?: string;
}

const TokenItem = (props: TokenItemProps) => {
  const { symbol, name, amount, value, icon } = props;

  return (
    <div className="flex justify-between items-center gap-[10px] w-[100%]">
      <div className="flex items-center gap-[10px]">
        <img src={icon} alt="" className="" width={32} height={32} />
        <div className="">
          <div className="text-[16px] font-[600] text-black">{symbol}</div>
          <div className="text-[10px] font-[400] text-black mt-[2px]">{name}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-[16px] font-[600] text-black">{amount}</div>
        <div className="text-[10px] font-[400] text-black mt-[2px]">{value}</div>
      </div>
    </div>
  );
};

interface TokenItemProps {
  symbol: string;
  name: string;
  amount: string;
  value: string;
  icon: string;
}
