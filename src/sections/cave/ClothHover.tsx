import { useRef, useState } from "react";
import TipModal from "./TipModal";
import useTipModal from "./useTipModal";

const data = {
    tip: 'Swap',
    title: 'How to Unlock Clothes?',
    list: [{
        icon: '/images/cave/clothing/cloth-1-1.png',
        content: <div><strong>5</strong> transaction, at least $1+ for each</div>,
    }, {
        icon: '/images/cave/clothing/cloth-2-2.png',
        content: <div><strong>10</strong> transaction, at least $10+ for each</div>,
    }, {
        icon: '/images/cave/clothing/cloth-3-3.png',
        content: <div><strong>50</strong> transaction, at least $100+ for each</div>,
    }, {
        icon: '/images/cave/clothing/cloth-4-4.png',
        content: <div><strong>200</strong> transaction, at least $100+ for each</div>,
    }],
}

export default function ClothHover() {
 
    return  <TipModal note={
                <div className="flex items-start gap-[10px]">
                    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="13" cy="13" r="13" fill="#FFB7BF" />
                        <path d="M11.1023 7.94C11.489 7.31333 12.1357 7 13.0423 7C13.909 7 14.5357 7.3 14.9223 7.9C15.3223 8.5 15.5223 9.22667 15.5223 10.08C15.5223 10.7867 15.4557 11.5733 15.3223 12.44C15.189 13.2933 15.0023 14.06 14.7623 14.74C14.6423 15.0733 14.4357 15.3667 14.1423 15.62C13.8623 15.86 13.4957 15.98 13.0423 15.98C12.589 15.98 12.2157 15.86 11.9223 15.62C11.629 15.3667 11.4223 15.0733 11.3023 14.74C11.0623 14.0733 10.8757 13.3267 10.7423 12.5C10.609 11.66 10.5423 10.9 10.5423 10.22C10.5423 9.31333 10.729 8.55333 11.1023 7.94ZM14.4823 20.28C14.069 20.6933 13.5823 20.9 13.0223 20.9C12.4623 20.9 11.9757 20.6933 11.5623 20.28C11.149 19.8667 10.9423 19.38 10.9423 18.82C10.9423 18.26 11.149 17.7733 11.5623 17.36C11.9757 16.9467 12.4623 16.74 13.0223 16.74C13.5823 16.74 14.069 16.9467 14.4823 17.36C14.8957 17.7733 15.1023 18.26 15.1023 18.82C15.1023 19.38 14.8957 19.8667 14.4823 20.28Z" fill="black" />
                    </svg>
                    <div className="text-[14px] font-medium text-[#3D405A]">
                        Wrap and stablecoin transactions are not included.
                    </div>
                </div>
            } data={data} />
}