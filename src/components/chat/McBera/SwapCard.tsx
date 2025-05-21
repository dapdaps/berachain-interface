import { bera } from "@/configs/tokens/bera";
import SwapModal from "@/sections/swap/SwapModal";

const SwapCard = ({
    defaultInputCurrency,
    defaultOutputCurrency,
    show,
    setShow
}: {
    defaultInputCurrency: any;
    defaultOutputCurrency: any;
    show: boolean;
    setShow: (show: boolean) => void;
}) => {
    return (
        <SwapModal
          defaultInputCurrency={bera[defaultInputCurrency?.symbol?.toLowerCase()] || defaultInputCurrency}
          defaultOutputCurrency={bera[defaultOutputCurrency?.symbol?.toLowerCase()] || defaultOutputCurrency}
        //   outputCurrencyReadonly={true}
          show={!!show}
          onClose={() => {
            setShow(false);
          }}
          from="marketplace"
        />
    )
}
    
export default SwapCard;