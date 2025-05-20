import useSwapStore from "../stores/useSwapStores";
import SwapCard from "./SwapCard";


const McBeraLayout = () => {
    const { isSwapModalOpen, closeSwapModal, defaultInputCurrency } = useSwapStore();

    return (
        <>
            <SwapCard 
                defaultInputCurrency={defaultInputCurrency}
                show={isSwapModalOpen}
                setShow={(show) => {
                    if (!show) closeSwapModal();
                }}
            />
        </>
    )
}

export default McBeraLayout;