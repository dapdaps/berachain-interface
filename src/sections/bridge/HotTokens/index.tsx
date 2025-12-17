import React from 'react';
import { usePriceStore } from '@/stores/usePriceStore';
import { balanceFormated } from '@/utils/balance';
import { bera } from '@/configs/tokens/bera';

const HOT_TOKENS: any = [
    bera.ibgt,
    bera.ibera,
    {
        "chainId": 80094,
        "address": "0xb2F776e9c1C926C4b2e54182Fac058dA9Af0B6A5",
        "symbol": "HENLO",
        "name": "henlo",
        "decimals": 18,
        "icon": "https://static.kodiak.finance/tokens/henlo.png",
    },
    {
        "chainId": 80094,
        "address": "0x0F81001eF0A83ecCE5ccebf63EB302c70a39a654",
        "symbol": "DOLO",
        "name": "Dolomite",
        "decimals": 18,
        "icon": "https://static.kodiak.finance/tokens/dolo.png",
    },
    bera.honey,
];

interface HotTokenItemProps {
    token: {
        symbol: string;
        name: string;
        icon: string;
    };
    realTimePrice: string | undefined;
    onClick: (token: any) => void;
}

const HotTokenItem: React.FC<HotTokenItemProps> = ({ token, realTimePrice, onClick }) => {
    const displayPrice = realTimePrice

    return (
        <div onClick={() => {
            onClick(token);
        }} className="cursor-pointer flex items-center justify-between h-[48px] gap-[10px] px-[10px] hover:bg-[rgba(151,154,190,0.05)] rounded-[8px] transition-colors duration-200">
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

const HotTokens= ({ onTokenClick }: { onTokenClick: (token: any) => void }) => {
    const prices = usePriceStore((store) => store.price);


    return (
        <div className="absolute left-[50%] translate-x-[250px] top-[37px] bg-[#FFFDEB] rounded-r-[10px] border border-black p-[16px] max-w-[200px] shadow-shadow1">
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

            <div className="space-y-[4px]">
                {HOT_TOKENS.map((token: any) => {
                    const realTimePrice = prices[token.symbol] ? `$${balanceFormated(Number(prices[token.symbol]), 2)}` : undefined;

                    return (
                        <HotTokenItem
                            key={token.symbol}
                            token={token}
                            realTimePrice={realTimePrice}
                            onClick={onTokenClick}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default HotTokens;
