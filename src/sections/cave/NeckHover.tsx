import { useRef, useState } from "react";
import TipModal from "./TipModal";
import useTipModal from "./useTipModal";

const data = {
    tip: 'Lending',
    title: 'How to Unlock Necklaces?',
    list: [{
        icon: '/images/cave/neck/neck-1.png',
        content: <div>Lend and Borrow over <strong>$5,000</strong> total</div>,
    }, {
        icon: '/images/cave/neck/neck-2.png',
        content: <div>Lend and Borrow over <strong>$10,000</strong> total</div>,
    }, {
        icon: '/images/cave/neck/neck-3.png',
        content: <div>Lend and Borrow over <strong>$50,000</strong> total</div>,
    }, {
        icon: '/images/cave/neck/neck-4.png',
        content: <div>Lend and Borrow over <strong>$100,000</strong> total</div>,
    }]
}

export default function NeckHover() { 
    const boxRef = useRef<any>(null)
    const {showTip, setTipShow} = useTipModal(boxRef)
    const [showSelf, setShowSelf] = useState(false)

    return <div ref={boxRef} 
    onMouseEnter={() => { setShowSelf(true) }} 
    onMouseLeave={() => { setShowSelf(false); setTipShow(false); }}  
    style={{ opacity: showSelf ? 1: 0, left: 'calc(57% + 120px + 270px)'  }}
    data-bp="1013-003"
    onClick={() => {
        setTipShow(true)
    }} className="absolute cursor-pointer w-[308px] h-[434px] left-[50%] top-[340px] translate-x-[-50%] bg-[#EBF4794D] border-[#EBF479] border-[3px] rounded-[20px]">
        {
            showTip && <TipModal data={data} style={{ right: '104%',  top: '10%' }} iconWidth={52}/>
        }
    </div>

}