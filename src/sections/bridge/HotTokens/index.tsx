import React from 'react';
import { usePriceStore } from '@/stores/usePriceStore';
import { balanceFormated } from '@/utils/balance';

// HOT TOKEN 数据
const HOT_TOKENS = [
    {
        symbol: 'BERA',
        name: 'BERA',
        icon: '/images/tokens/bera.png',
        priceKey: 'BERA',
        price: '$1.92'
    },
    {
        symbol: 'WETH',
        name: 'WETH',
        icon: '/images/tokens/weth.png',
        priceKey: 'WETH',
        price: '$4357.89'
    },
    {
        symbol: 'USDT',
        name: 'USDT',
        icon: '/images/tokens/usdt.png',
        priceKey: 'USDT',
        price: '$0.98'
    },
    {
        symbol: 'HONEY',
        name: 'HONEY',
        icon: '/images/tokens/honey.png',
        priceKey: 'HONEY',
        price: '$1.00'
    },
    {
        symbol: 'BTC',
        name: 'BTC',
        icon: '/images/tokens/btc.png',
        priceKey: 'BTC',
        price: '$134,605.23'
    }
];

interface HotTokenItemProps {
    token: {
        symbol: string;
        name: string;
        icon: string;
        priceKey: string;
        price: string;
    };
    realTimePrice?: string;
}

const HotTokenItem: React.FC<HotTokenItemProps> = ({ token, realTimePrice }) => {
    const displayPrice = realTimePrice || token.price;

    return (
        <div className="flex items-center justify-between h-[48px] gap-[10px] px-[10px] hover:bg-[rgba(151,154,190,0.05)] rounded-[8px] transition-colors duration-200">
            <div className="flex items-center gap-[10px]">
                <div className="relative w-[26px] h-[26px]">
                    <img
                        src={token.icon}
                        alt={token.symbol}
                        className="w-full h-full rounded-full"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/tokens/default_icon.png';
                        }}
                    />
                </div>
                <div className=" text-[14px] font-[400] font-Montserrat">
                    {token.symbol}
                </div>
            </div>
            <div className=" text-[12px] font-[400] font-Montserrat">
                {displayPrice}
            </div>
        </div>
    );
};

const HotTokens: React.FC = () => {
    const prices = usePriceStore((store) => store.price);

    return (
        <div className="absolute  left-[50%] translate-x-[250px] top-[177px] bg-[#FFFDEB] rounded-r-[10px] border border-black p-[16px] max-w-[200px] shadow-shadow1">
            {/* Header */}
            <div className="flex items-center justify-between mb-[16px]">
                <div className="flex items-center gap-[8px] pl-[10px]">
                    <div className="w-[20px] h-[20px] flex items-center justify-center">
                        🔥
                    </div>
                    <h3 className="text-[#F7F9EA] text-[14px] font-[700] font-CherryBomb [-webkit-text-stroke-width:2px] [-webkit-text-stroke-color:#000]">
                        HOT TOKEN
                    </h3>
                </div>
            </div>

            {/* Token List */}
            <div className="space-y-[4px]">
                {HOT_TOKENS.map((token) => {
                    const realTimePrice = prices[token.priceKey] ? `$${balanceFormated(Number(prices[token.priceKey]), 2)}` : undefined;

                    return (
                        <HotTokenItem
                            key={token.symbol}
                            token={token}
                            realTimePrice={realTimePrice}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default HotTokens;
