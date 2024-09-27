import React, { useState } from "react";
// import { Switch } from '@/components/ui/switch';

interface TokenInfo {
  symbol: string;
  name: string;
  icon: string;
  apr: string;
  balance: string;
  walletBalance: string;
}

interface TabPanelProps {
  totalBalance: string;
  totalRate: string;
  rateName: string;
  tokens: TokenInfo[];
  showRateSwitch?: boolean;
  onDeposit: (symbol: string) => void;
  onWithdraw: (symbol: string) => void;
}

const TabPanel: React.FC<TabPanelProps> = ({
  totalBalance,
  totalRate,
  rateName,
  tokens,
  onDeposit,
  onWithdraw,
  showRateSwitch = true
}) => {
  const [isAlternateRate, setIsAlternateRate] = useState(false);

  return (
    <div className="h-[490px]">
      <div className="flex mb-10 items-center">
        <div className="w-[150px]">
        <div className="font-Montserrat text-sm font-medium leading-[17px] text-left text-[#3D405A] mb-3">Your balance</div>
        <p className="font-Montserrat text-[26px] font-semibold leading-[23.4px] text-left text-black">${totalBalance}</p>
        </div>
        <div className="w-[150px] ml-[142px]">
        <div className="font-Montserrat text-sm font-medium leading-[17px] text-left text-[#3D405A] mb-3">Your balance</div>
          <p className="font-Montserrat text-[26px] font-semibold leading-[23.4px] text-left text-black">{totalRate}%</p>
        </div>
        {showRateSwitch && (
          <div className="ml-auto">
            <div className="w-[150px] h-[40px] bg-gray-200 rounded-full flex items-center justify-between p-1">
              <button
                className={`w-1/2 h-[34px] rounded-full transition-all ${
                  isAlternateRate ? "bg-yellow-400 text-black" : "text-gray-600"
                }`}
                onClick={() => setIsAlternateRate(true)}
              >
                APY
              </button>
              <button
                className={`w-1/2 h-[34px] rounded-full transition-all ${
                  !isAlternateRate
                    ? "bg-yellow-400 text-black"
                    : "text-gray-600"
                }`}
                onClick={() => setIsAlternateRate(false)}
              >
                APR
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-lg p-4">
        <div className="grid grid-cols-5 gap-4 font-bold mb-2">
          <div>Token</div>
          <div>{rateName}</div>
          <div>Balance</div>
          <div>In Wallet</div>
          <div></div>
        </div>
        {tokens.map((token) => (
          <div
            key={token.symbol}
            className="grid grid-cols-5 gap-4 items-center py-2"
          >
            <div className="flex items-center space-x-2">
              <img src={token.icon} alt={token.symbol} className="w-8 h-8" />
              <div>
                <div className="font-bold">{token.symbol}</div>
                <div className="text-sm text-gray-500">{token.name}</div>
              </div>
            </div>
            <div>{token.apr}%</div>
            <div>{token.balance}</div>
            <div>{token.walletBalance}</div>
            <div className="flex space-x-2">
              <button
                className="bg-yellow-400 text-black font-bold py-1 px-3 rounded"
                onClick={() => onDeposit(token.symbol)}
              >
                +
              </button>
              <button
                className="bg-yellow-400 text-black font-bold py-1 px-3 rounded"
                onClick={() => onWithdraw(token.symbol)}
              >
                -
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabPanel;
