import Modal from "../modal";
import Button from "./button";
import { useState } from "react";


const listData = [
    {
        label: "Yield Farmer",
        desc: "Show me the highest APY",
        value: "yield_farmer",
        selected: false,
    },
    {
        label: "DeFi Curious",
        desc: "Help me explore DeFi",
        value: "defi_curious",
        selected: false,
    },
    {
        label: "Cross-chain Explorer",
        desc: "I want to bridge and swap",
        value: "cross_chain_explorer",
        selected: false,
    },
    {
        label: "Berachain Baller",
        desc: "Here for the vibes",
        value: "berachain_baller",
        selected: true,
    },
    {
        label: "First Timer",
        desc: "I’m new, help me start",
        value: "first_timer",
        selected: false,
    },
]
export default function Guide({ onClose, show }: { onClose?: () => void, show: boolean }) {
    const [step, setStep] = useState(1);
    const [selected, setSelected] = useState<number>(2);

    return (
        <Modal open={show}>
            {
                step === 1 && <div className="w-[680px] relative bg-[#FFFDEB] rounded-[20px] pb-[40px]">
                    <img src="/images/guide/box-bg.png" className="absolute left-0 top-[-68px] w-full h-[438px]" />
                    <div className="text-[36px] relative pt-[20px] pb-[300px] text-[#FDD54C] font-CherryBomb text-center" style={{ WebkitTextStroke: "2px #000000" }}>Lootbox Season</div>
                    <div className="relative px-[26px] font-Montserrat mt-[20px]">
                        <div className="text-[24px] text-black font-[900]">Beratown Lootbox Season Starts!</div>
                        <div className="text-[16px] text-black font-[500]">
                            Beratown just got a glow-up! Now it makes DeFi effortlessly rewarding.
                            And guess what? <br />MeBera left you a free lootbox just for showing up. No gas, no catch, just vibes, just connect your wallet.
                        </div>
                        <div className="flex justify-center mt-[30px]">
                            <Button onClick={() => setStep(2)}>Get Lootbox</Button>
                        </div>
                    </div>
                    <div className="absolute right-[20px] top-[20px]">
                        <CloseIcon onClick={onClose} />
                    </div>
                </div>
            }

            {
                step === 2 && <div className="w-[680px] relative bg-[#FFFDEB] rounded-[20px] pb-[40px]">
                    <div className="text-[36px] relative pt-[20px] text-[#FDD54C] font-CherryBomb text-center leading-[1]" style={{ WebkitTextStroke: "2px #000000" }}>What brings you to<br /> beratown today?</div>
                    <div className="absolute right-[100px] top-[50px]">
                        <img src="/images/guide/title-arrow.png" className="w-[66px]" />
                    </div>
                    <div className="flex flex-col gap-[10px] mt-[62px] px-[26px]">
                        {listData.map((item, idx) => (
                            <div
                                onClick={() => setSelected(idx)}
                                key={item.value}
                                className="flex items-center justify-between px-[20px] py-[10px] rounded-[12px] bg-[#F5F2E2]"
                            >
                                <label className="flex items-center cursor-pointer w-full">
                                    <span className="mr-[16px] flex items-center">
                                        <span
                                            className={`w-[26px] h-[26px] rounded-full border border-black flex items-center justify-center transition-colors duration-150 ${item.selected ? 'bg-[#FFFDEB]' : 'bg-white'}`}
                                        >
                                            {idx === selected && (
                                                <span className="w-[16px] h-[16px] rounded-full bg-[#FFDC50] border border-black block"></span>
                                            )}
                                        </span>
                                    </span>
                                    <span className="font-CherryBomb text-[20px] text-black">{item.label}</span>
                                </label>
                                <span className="text-[16px] text-black font-Montserrat whitespace-nowrap">{item.desc}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center mt-[40px]">
                        <Button onClick={() => setStep(3)}>Open Lootbox</Button>
                    </div>
                    <div className="absolute right-[20px] top-[20px]">
                        <CloseIcon onClick={onClose} />
                    </div>
                </div>
            }

            {
                step === 3 && <div className="w-[680px] relative bg-[#FFFDEB] rounded-[20px] pb-[40px]">
                    <img src="/images/guide/open-box-bg.png" className="absolute left-0 top-0 w-full h-[370px]" />
                    <img src="/images/guide/star.svg" className="absolute left-[50%] top-[80px] translate-x-[-50%] w-[24px]" />
                    <img src="/images/guide/star.svg" className="absolute left-[30%] top-[100px] translate-x-[-50%] w-[24px]" />
                    <img src="/images/guide/star.svg" className="absolute left-[60%] top-[160px] translate-x-[-50%] w-[24px]" />
                    <div className="text-[36px] relative pt-[20px] pb-[300px] text-[#FDD54C] font-CherryBomb text-center" style={{ WebkitTextStroke: "2px #000000" }}>Lootbox Season</div>

                    <div className="font-Montserrat text-[24px] text-black font-[900] text-center mt-[20px]">You’ve got 100 Gems</div>
                    <div className="text-[20px] text-black font-[500] text-center mt-[10px]">Want more lootbox? Complete daily missions</div>

                    <div className="flex justify-center mt-[40px]">
                        <Button showBox={false} onClick={() => onClose?.()}>Check daily missions</Button>
                    </div>
                    <div className="absolute right-[20px] top-[20px]">
                        <CloseIcon onClick={onClose} />
                    </div>
                </div>
            }

        </Modal>
    )
}

const CloseIcon = ({ onClick }: { onClick?: () => void }) => {
    return (
        <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={onClick} className="cursor-pointer">
            <g filter="url(#filter0_d_38699_4686)">
                <circle cx="15" cy="15" r="13" fill="#E9E3B5" />
                <circle cx="15" cy="15" r="14" stroke="black" stroke-width="2" stroke-linejoin="round" />
            </g>
            <path d="M19.78 18.3356C17.9376 16.4934 17.9376 13.5064 19.7799 11.6642C20.0307 11.4133 20.0735 11.0494 19.8756 10.8516L19.1482 10.1242C18.9503 9.92632 18.5869 9.96974 18.3356 10.2204C16.4935 12.0627 13.5066 12.0627 11.6643 10.2205C11.4135 9.96941 11.0496 9.92632 10.8517 10.1245L10.1243 10.8519C9.92648 11.0495 9.96931 11.4134 10.2205 11.6642C12.0628 13.5065 12.0628 16.4936 10.2205 18.336C9.96973 18.5866 9.92631 18.9503 10.1243 19.1482L10.8517 19.8756C11.0496 20.0735 11.4135 20.0306 11.6643 19.7799C13.5064 17.9377 16.4936 17.9372 18.3357 19.7794C18.587 20.0307 18.9504 20.0735 19.1483 19.8756L19.8757 19.1482C20.0735 18.9503 20.0307 18.5866 19.78 18.3356Z" fill="black" />
            <defs>
                <filter id="filter0_d_38699_4686" x="0" y="0" width="33" height="33" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dx="3" dy="3" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_38699_4686" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_38699_4686" result="shape" />
                </filter>
            </defs>
        </svg>

    )
}