import { useRef, useState } from "react";
import TipModal from "./TipModal";
import useTipModal from "./useTipModal";

const data = {
    tip: 'Bridge',
    title: 'How to Unlock Hats?',
    list: [{
        icon: '/images/cave/hat/hat-1-1.png',
        content: <div><strong>5</strong> transactions, at least $1+ for each</div>,
    }, {
        icon: '/images/cave/hat/hat-2-2.png',
        content: <div><strong>10</strong> transactions, at least $10+ for each</div>,
    }, {
        icon: '/images/cave/hat/hat-3-3.png',
        content: <div><strong>50</strong> transactions, at least $100+ for each</div>
    }, {
        icon: '/images/cave/hat/hat-4-4.png',
        content: <div><strong>200</strong> transactions, at least $100+ for each</div>,
    }]
}

export default function HatHover() {
    return <TipModal data={data} />

}