import { useRef, useState } from "react";
import TipModal from "./TipModal";
import useTipModal from "./useTipModal";

const data = {
    tip: 'Bridge',
    title: 'How to Unlock Hats?',
    list: [{
        icon: '/images/cave/hat/hat-1-1.png',
        content: '$100+ per transaction, complete at least 1 transaction',
    }, {
        icon: '/images/cave/hat/hat-2-2.png',
        content: '$100+ per transaction, complete at least 10 transaction',
    }, {
        icon: '/images/cave/hat/hat-3-3.png',
        content: '$100+ per transaction, complete at least 100 transaction',
    }, {
        icon: '/images/cave/hat/hat-4-4.png',
        content: '$100+ per transaction, complete at least 1000 transaction',
    }]
}

export default function HatHover() {
    const boxRef = useRef<any>(null)
    const {showTip, setTipShow} = useTipModal(boxRef)
    const [showSelf, setShowSelf] = useState(false)

    return <div ref={boxRef} 
    onMouseEnter={() => { setShowSelf(true) }} 
    onMouseLeave={() => { setShowSelf(false); setTipShow(false); }}  
    style={{ opacity: showSelf ? 1: 0 }}
    data-bp="1004-001"
    onClick={() => {
        setTipShow(true)
    }} className="absolute cursor-pointer w-[563px] h-[100px] left-[50%] top-[270px] translate-x-[-50%] bg-[#EBF4794D] border-[#EBF479] border-[3px] rounded-[20px]">
        {
            showTip && <TipModal data={data} style={{ left: '50%', transform: 'translateX(-50%)', top: '80%' }}/>
        }
    </div>

}