import useSwapStore from "../stores/useSwapStores";
import SwapCard from "./SwapCard";


const McBeraLayout = () => {
    const { isSwapModalOpen, closeSwapModal, defaultInputCurrency, defaultOutputCurrency } = useSwapStore();
    return (
        <>
            <SwapCard 
                defaultInputCurrency={defaultInputCurrency}
                defaultOutputCurrency={defaultOutputCurrency}
                show={isSwapModalOpen}
                setShow={(show) => {
                    if (!show) closeSwapModal();
                }}
            />
        </>
    )
}

export default McBeraLayout;