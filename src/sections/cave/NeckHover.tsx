import { useRef, useState } from "react";
import TipModal from "./TipModal";
import useTipModal from "./useTipModal";

const data = {
    tip: 'Lending',
    title: 'How to Unlock Necklaces?',
    list: [{
        icon: '/images/cave/neck/neck-1-1.png',
        content: <div>Lend and Borrow in total <strong>$50</strong></div>,
    }, {
        icon: '/images/cave/neck/neck-2-2.png',
        content: <div>Lend and Borrow in total <strong>$1000</strong></div>,
    }, {
        icon: '/images/cave/neck/neck-3-3.png',
        content: <div>Lend and Borrow in total <strong>$500,000</strong></div>,
    }, {
        icon: '/images/cave/neck/neck-4-4.png',
        content: <div>Lend and Borrow in total <strong>$1,000,000 </strong></div>,
    }]
}

export default function NeckHover() { 
    return <TipModal data={data} iconWidth={52}/>

}