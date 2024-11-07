import { useRef, useState } from "react";
import TipModal from "./TipModal";
import useTipModal from "./useTipModal";

const data = {
    tip: 'Bridge',
    title: 'How to Unlock Hats?',
    list: [{
        icon: '/images/cave/hat/hat-1-1.png',
        content: <div><strong>1+</strong> transaction, at least 1 transactions</div>,
    }, {
        icon: '/images/cave/hat/hat-2-2.png',
        content: <div><strong>10+</strong> transaction, at least 10 transactions</div>,
    }, {
        icon: '/images/cave/hat/hat-3-3.png',
        content: <div><strong>100+</strong> transaction, at least 100 transactions</div>
    }, {
        icon: '/images/cave/hat/hat-4-4.png',
        content: <div><strong>1000+</strong> transaction, at least 1000 transactions</div>,
    }]
}

export default function HatHover() {
    return <TipModal data={data} />

}