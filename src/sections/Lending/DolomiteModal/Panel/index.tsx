import React, { useState } from "react";
import Popover, { PopoverPlacement } from '@/components/popover';
import ActionPanel from '@/sections/Lending/components/action-panel';
import Button from '@/components/button';
import { Token } from '@/types';
// import { Switch } from '@/components/ui/switch';

interface TokenInfo extends Token {
  APR: string;
  APY: string;
  balance: string;
  walletBalance: string;
}

interface TabPanelProps {
  totalBalance: string;
  totalRate: string;
  rateName: string;
  tokens: TokenInfo[];
  showRateSwitch?: boolean;
  rateKey: 'APY' | 'APR',
  totalRateLabel: string;
  totalBalanceLabel: string;
  onDeposit: (symbol: string) => void;
  onWithdraw: (symbol: string) => void;
  setRateKey: (rateKey: 'APY' | 'APR') => void;
}

const TabPanel: React.FC<TabPanelProps> = ({
  totalBalance,
  totalRate,
  rateName,
  tokens,
  onDeposit,
  onWithdraw,
  showRateSwitch = true,
  rateKey,
  setRateKey,
  totalRateLabel,
  totalBalanceLabel,
}) => {
  const [isAlternateRate, setIsAlternateRate] = useState(false);

  return (
    <div className="h-[490px]">
      <div className="flex mb-10 items-center">
        <div className="w-[150px]">
        <div className="font-Montserrat text-sm font-medium leading-[17px] text-left text-[#3D405A] mb-3">{totalBalanceLabel}</div>
        <p className="font-Montserrat text-[26px] font-semibold leading-[23.4px] text-left text-black">{totalBalance}</p>
        </div>
        <div className="w-[150px] ml-[142px]">
        <div className="font-Montserrat text-sm font-medium leading-[17px] text-left text-[#3D405A] mb-3">{totalRateLabel} {rateKey}</div>
          <p className="font-Montserrat text-[26px] font-semibold leading-[23.4px] text-left text-black">{totalRate}</p>
        </div>
        {showRateSwitch && (
          <div className="ml-auto">
            <div className="w-[150px] h-[40px] bg-[#FFF] rounded-[12px] border border-[#373A53] flex items-center justify-between p-[4px]">
              <button
                className={`w-1/2 h-[32px] rounded-[10px] transition-all text-black font-[14px] ${
                  rateKey === 'APY' ? "bg-[#FFDC50] border border-[#000]" : ""
                }`}
                onClick={() => setRateKey('APY')}
              >
                APY
              </button>
              <button
                className={`w-1/2 h-[32px] rounded-[10px] transition-all text-black font-[14px] ${
                  rateKey === 'APR'
                    ? "bg-[#FFDC50] border border-[#000]"
                    : ""
                }`}
                onClick={() => setRateKey('APR')}
              >
                APR
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-lg p-4">
        <div className="grid grid-cols-[3fr_2fr_2fr_2fr_1fr] gap-4 font-bold mb-2 ">
          <div className="font-[500] text-[#3D405A]">Token</div>
          <div className="font-[500] text-[#3D405A]">{rateName}</div>
          <div className="font-[500] text-[#3D405A]">Balance</div>
          <div className="font-[500] text-[#3D405A]">In Wallet</div>
          <div className="font-[500] text-[#3D405A]"></div>
        </div>
        {tokens.map((token) => (
          <div
            key={token.symbol}
            className="grid grid-cols-[3fr_2fr_2fr_2fr_1fr] gap-4 items-center py-[10px]"
          >
            <div className="flex items-center space-x-[12px]">
              <img src={token.icon} alt={token.symbol} className="w-[30px] h-[30px]" />
              <div>
                <div className="font-[600] text-[16px]">{token.symbol}</div>
                <div className="text-[10px] text-black">{token.name}</div>
              </div>
            </div>
            <div className="font-[600] text-[16px]">{token[rateKey]}</div>
            <div className="font-[600] text-[16px]">{token.balance}</div>
            <div className="font-[600] text-[16px]">{token.walletBalance}</div>
            <div className="flex space-x-[10px]">
              <Popover
                placement={PopoverPlacement.BottomRight}
                content={(
                  <ActionPanel
                    title="Deposit"
                    actionText="Deposit"
                    placeholder="0.00"
                    token={token}
                  />
                )}
              >
                <Button
                  style={{ width: 32 }}
                  onClick={() => onDeposit(token.symbol)}
                >
                  +
                </Button>
              </Popover>
              <Popover
                placement={PopoverPlacement.BottomRight}
                content={(
                  <ActionPanel
                    title="Withdraw"
                    actionText="Withdraw"
                    placeholder="0.00"
                    token={token}
                    isSkipApproved={true}
                  />
                )}
              >
                <Button
                  style={{ width: 32 }}
                  onClick={() => onWithdraw(token.symbol)}
                >
                  -
                </Button>
              </Popover>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabPanel;
