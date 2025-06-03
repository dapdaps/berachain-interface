import { bera } from "@/configs/tokens/bera";
import LazyImage from "@/components/layz-image";
import IconSwap from "@public/images/chat/swap.svg";
import { numberFormatter } from "@/utils/number-formatter";
import useSwapStore from "../stores/useSwapStores";

const HotTokensCard = ({ parsedContent }: any) => {
  const { openSwapModal, setDefaultOutputCurrency } = useSwapStore();

  const handleTokenSwap = (token: any) => {
    setDefaultOutputCurrency(token);
    openSwapModal();
  };

  return (
    <div className="mt-[10px] w-full flex flex-col gap-[8px]">
      {parsedContent.map((token: any) => (
        <div
          key={token.symbol}
          className="flex items-center justify-between h-[48px] border border-[#D6D1CC] px-2.5 rounded-[10px]"
        >
          <div className="flex items-center gap-2">
            <LazyImage
              src={bera?.[token.symbol.toLowerCase()]?.icon}
              alt={token.symbol}
              width={26}
              height={26}
              className="rounded-full shrink-0"
            />
            <div className="text-[#392C1D] text-[14px] font-[700] font-Montserrat leading-[1] min-w-[80px]">
              {token.symbol}
            </div>
            <div className="font-Montserrat font-[500] text-[12px] text-[#392C1D] leading-[1]">
              Volume: {numberFormatter(token.volume_24 || 0, 2, true)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="font-Montserrat font-[700] text-[14px] text-[#392C1D] leading-[1]">
              Price: {numberFormatter(token.price || 0, 3, true)}
            </div>
                <button
                  type="button"
                  className="px-[9px] h-[22px] shrink-0 rounded-[6px] border border-black bg-[#FFF5A9] shadow-[2px_2px_0px_0px_#000] text-[#392C1D] font-montserrat text-[14px] font-medium leading-[100%]"
                  onClick={() => handleTokenSwap(token)}
                >
                  Swap
                </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HotTokensCard;