import { useRef, useState } from "react";
import TipModal from "./TipModal";
import useTipModal from "./useTipModal";

const data = {
    tip: 'Liquidity/ Stake',
    title: 'How to Unlock Cars?',
    list: [{
        icon: '/images/cave/key/key-1-1.png',
        content: <div>Provide or stake over <strong>$5,000</strong> total</div>,
    }, {
        icon: '/images/cave/key/key-2-2.png',
        content: <div>Provide or stake over <strong>$10,000</strong> total</div>,
    }, {
        icon: '/images/cave/key/key-3-3.png',
        content: <div>Provide or stake over <strong>$50,000</strong> total</div>,
    }, {
        icon: '/images/cave/key/key-4-4.png',
        content: <div>Provide or stake  over <strong>$100,000</strong> total</div>,
    }]
}

export default function KeyHover() {
    const boxRef = useRef<any>(null)
    const {showTip, setTipShow} = useTipModal(boxRef)
    const [showSelf, setShowSelf] = useState(false)

    return <div ref={boxRef} 
    onMouseEnter={() => { setShowSelf(true) }} 
    onMouseLeave={() => { setShowSelf(false); setTipShow(false); }}  
    style={{ opacity: showSelf ? 1: 0, left: 'calc(50% - 170px - 290px)' }} 
    onClick={() => {
        setTipShow(true)
    }} className="absolute cursor-pointer w-[393px] h-[262px] left-[50%] top-[480px] translate-x-[-50%] bg-[#EBF4794D] border-[#EBF479] border-[3px] rounded-[20px]">
        {
            showTip && <TipModal data={data} style={{ left: '104%',  top: '-10%' }} iconWidth={53}/>
        }
    </div>

}