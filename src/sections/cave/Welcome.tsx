import { useState } from "react";

export default function Welcome() {
    const [show, setShow] = useState(true)

    if (!show) {
        return null
    }

    return <div className=" absolute w-[1000px] bottom-[90px] left-[50%] translate-x-[-50%] ">
        <svg onClick={() => {
            setShow(false)
        }} className=" cursor-pointer absolute right-[10px] top-[50px]" width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_d_24372_359)">
                <circle cx="15" cy="15" r="13" fill="#E9E3B5" />
                <circle cx="15" cy="15" r="14" stroke="black" stroke-width="2" stroke-linejoin="round" />
            </g>
            <path d="M16.444 15L19.7799 11.6642C20.0307 11.4133 20.0735 11.0494 19.8756 10.8516L19.1482 10.1242C18.9503 9.92632 18.5869 9.96974 18.3356 10.2204L15.0001 13.5561L11.6643 10.2205C11.4135 9.96941 11.0496 9.92632 10.8517 10.1245L10.1243 10.8519C9.92648 11.0495 9.96931 11.4134 10.2205 11.6642L13.5563 15L10.2205 18.336C9.96973 18.5866 9.92631 18.9503 10.1243 19.1482L10.8517 19.8756C11.0496 20.0735 11.4135 20.0306 11.6643 19.7799L15.0003 16.4439L18.3357 19.7794C18.587 20.0307 18.9504 20.0735 19.1483 19.8756L19.8757 19.1482C20.0735 18.9503 20.0307 18.5866 19.78 18.3356L16.444 15Z" fill="black" />
            <defs>
                <filter id="filter0_d_24372_359" x="0" y="0" width="33" height="33" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dx="3" dy="3" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_24372_359" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_24372_359" result="shape" />
                </filter>
            </defs>
        </svg>

        <img src="/images/cave/tip-bera.png" className="w-[200px] h-[104px] mb-[-15px] ml-[20px]" />
        <div className="bg-[#FFFDEB] border border-[#000000] rounded-[25px] px-[35px] py-[25px] shadow-[10px_10px_0px_0px_#00000040]">
            <div className="flex gap-[10px] items-center">
                {/* <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M7.10016 1C7.86996 -0.333334 9.79446 -0.333333 10.5643 1L17.3935 12.8286C18.1633 14.1619 17.201 15.8286 15.6614 15.8286H2.00298C0.463382 15.8286 -0.498867 14.1619 0.270933 12.8286L7.10016 1ZM7.91793 6.22857C7.91793 5.72363 8.32727 5.31429 8.83221 5.31429C9.33716 5.31429 9.7465 5.72363 9.7465 6.22857V9.88572C9.7465 10.3907 9.33716 10.8 8.83221 10.8C8.32727 10.8 7.91793 10.3907 7.91793 9.88572V6.22857ZM8.83221 11.7143C8.32727 11.7143 7.91793 12.1236 7.91793 12.6286C7.91793 13.1335 8.32727 13.5429 8.83221 13.5429C9.33716 13.5429 9.7465 13.1335 9.7465 12.6286C9.7465 12.1236 9.33716 11.7143 8.83221 11.7143Z" fill="#FF547D" />
                </svg> */}

                <div className="">Notice: The Bear Cave isn’t live just yet—but it’s getting ready to launch soon!</div>
            </div>

            <div className="flex items-center gap-[20px]">
                <div className="text-[32px] font-CherryBomb">Welcome to the Bear Cave!</div>
                <svg width="38" height="36" viewBox="0 0 38 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.5271 8.82533C14.2338 6.05283 18.1883 11.1056 20.1496 15.1425L17.6558 17.2208C17.6558 17.2208 14.72 17.7804 12.7295 17.4757C6.717 16.5556 5.06716 10.5063 8.5271 8.82533Z" fill="white" stroke="black" stroke-linecap="round" />
                    <path d="M32.083 17.6966C30.7381 14.9284 28.1114 13.9235 26.9662 13.7671C21.7759 16.2887 15.7451 17.0802 13.1745 16.1906C10.6038 15.3011 4.52399 20.3933 8.33091 26.0284C12.1378 31.6634 21.1841 30.4762 28.1044 27.114C33.6408 24.4243 32.8989 21.5768 32.9234 19.4265L35.0984 17.3008L32.083 17.6966Z" fill="#FEEF48" stroke="black" stroke-linecap="round" />
                    <circle cx="14.1603" cy="22.4307" r="1.5" transform="rotate(-11.1329 14.1603 22.4307)" fill="black" />
                    <circle cx="7.29167" cy="23.7822" r="1.5" transform="rotate(-11.1329 7.29167 23.7822)" fill="black" />
                    <path d="M32.0834 17.6976C30.7385 14.9295 27.8315 13.3474 25.2364 14.6082C25.2364 14.6082 27.5261 14.9197 29.4882 18.9584C32.46 25.0752 28.1049 27.1151 28.1049 27.1151C28.1049 27.1151 34.5803 25.0378 32.9239 19.4275L35.0988 17.3018L32.0834 17.6976Z" fill="black" />
                    <path d="M22.6426 15.8679C24.1918 18.3229 27.3786 22.9762 25.9553 27.0892" stroke="black" stroke-linecap="round" />
                    <path d="M16.5684 16.68C18.1176 19.1351 20.3269 26.6156 16.7347 29.43" stroke="black" stroke-linecap="round" />
                    <path d="M20.0337 4.50793C13.825 5.81357 16.1953 14.2138 18.1565 18.2507L21.3317 17.5748C21.3317 17.5748 23.5861 15.6128 24.5769 13.8598C27.5698 8.56448 27.7946 2.87589 20.0337 4.50793Z" fill="white" stroke="black" stroke-linecap="round" />
                    <path d="M13.872 19.0596C13.8883 17.626 13.2339 14.665 10.4853 14.2896" stroke="black" stroke-linecap="round" />
                    <path d="M8.40421 19.5769C7.95593 18.6542 6.6461 16.8384 4.99305 16.9572" stroke="black" stroke-linecap="round" />
                </svg>
            </div>

            <div className="mt-[10px] font-Montserrat font-medium text-[16px] ">
                Welcome to the Bear Cave! Ready to gear up your bear?<br />
                In Bear Cave, unlock clothes, hats, necklaces, and even a car by reaching key milestones and leveling up your bear’s style! As you explore and complete challenges, you might find yourself in the running for a potential Berachain airdrop. Stay active and keep exploring for a chance at exciting rewards!
            </div>
        </div>
    </div>
}