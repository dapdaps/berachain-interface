import { bera } from "@/configs/tokens/bera";
import LazyImage from "@/components/layz-image";
import IconSwap from '@public/images/chat/swap.svg'
import { numberFormatter } from "@/utils/number-formatter";

/**
 * 
 * response data: 
 * data: {"type":"Action",
 * "text":"
 * [{\"address\": \"0x0000000000000000000000000000000000000000\", \"symbol\": \"BERA\", \"decimals\": 18, \"price\": \"3.17\", \"volume_24\": \"86283940.604083\"}, 
 * {\"address\": \"0x6969696969696969696969696969696969696969\", \"symbol\": \"WBERA\", \"decimals\": 18, \"price\": \"3.2\", \"volume_24\": \"9951329.51\"}, 
 * {\"address\": \"0xfcbd14dc51f0a4d49d5e53c2e0950e0bc26d0dce\", \"symbol\": \"HONEY\", \"decimals\": 18, \"price\": \"0.998694\", \"volume_24\": \"4339312.29\"}, {\"address\": \"0x0555e30da8f98308edb960aa94c0db47230d2b9c\", \"symbol\": \"WBTC\", \"decimals\": 8, \"price\": \"110291\", \"volume_24\": \"9322301.91\"}, {\"address\": \"0xb2f776e9c1c926c4b2e54182fac058da9af0b6a5\", \"symbol\": \"HENLO\", \"decimals\": 18, \"price\": \"0.000073214903683972\", \"volume_24\": \"66615.99\"}, {\"address\": \"0xac03caba51e17c86c921e1f6cbfbdc91f8bb2e6b\", \"symbol\": \"iBGT\", \"decimals\": 18, \"price\": \"4.55\", \"volume_24\": \"1709490.04\"}]","executionType":"LAMBDA","function":"getHotTokens"}

 * @returns 
 */
const HotTokensCard = ({
    parsedContent
}: any) => {
    return (
        <div className="mt-[10px] w-full flex flex-col gap-[8px]">
            {parsedContent.map((token: any) => (
                <div key={token.symbol} className="flex items-center justify-between h-[48px] border border-[#D6D1CC] px-2.5 rounded-[10px]">
                    <div className="flex items-center gap-2">
                        <LazyImage src={bera?.[token.symbol.toLowerCase()]?.icon} alt={token.symbol} width={26} height={26} className="rounded-full shrink-0" />
                        <div className="text-[#392C1D] text-[14px] font-[700] font-Montserrat leading-[1] min-w-[80px]">{token.symbol}</div>
                        <div className="font-Montserrat font-[500] text-[12px] text-[#392C1D] leading-[1]">Volume: {numberFormatter(token.volume_24 || 0, 2, true)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="font-Montserrat font-[700] text-[14px] text-[#392C1D] leading-[1]">Price: {numberFormatter(token.price || 0, 3, true)}</div>
                        <IconSwap className="cursor-pointer" />        
                    </div>
                </div>
            ))}
        </div>
    )
}

export default HotTokensCard;