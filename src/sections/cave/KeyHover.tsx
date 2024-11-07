import { useRef, useState } from "react";
import TipModal from "./TipModal";
import useTipModal from "./useTipModal";

const data = {
    tip: 'Delegate',
    title: 'How to Unlock Cars?',
    list: [{
        icon: '/images/cave/key/key-1-1.png',
        content: <div>Bicycle: Delegate <strong>1 BGT</strong></div>,
    }, {
        icon: '/images/cave/key/key-2-2.png',
        content: <div>Scooter: Delegate <strong>100 BGT</strong></div>,
    }, {
        icon: '/images/cave/key/key-3-3.png',
        content: <div>Motobike: Delegate <strong>10,000 BGT</strong></div>,
    }, {
        icon: '/images/cave/key/key-4-4.png',
        content: <div>Lambo: Delegate <strong>1,000,000 BGT</strong></div>,
    }]
}

export default function KeyHover() {
    return <TipModal data={data} iconWidth={53}/>
}