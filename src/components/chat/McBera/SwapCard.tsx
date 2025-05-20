import SwapModal from "@/sections/swap/SwapModal";

const SwapCard = ({
    defaultInputCurrency,
    show,
    setShow
}: {
    defaultInputCurrency: any;
    show: boolean;
    setShow: (show: boolean) => void;
}) => {
    return (
        <SwapModal
          defaultInputCurrency={defaultInputCurrency}
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