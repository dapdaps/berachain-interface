import { useState } from "react"
import type { AirDropRound, AirDropHistoryData } from "./useAirdrop"
import { formatDate } from "date-fns"
import { useCountDown } from "ahooks"
import AirDropHistory from "./AirDropHistory";

interface AirDropTimeProps {
    airDropRound: AirDropRound;
    airDropHistory: AirDropHistoryData[];   
}

export default function AirDropTime({ airDropRound, airDropHistory }: AirDropTimeProps) {
    const [show, setShow] = useState(false)

    const [timeLeft, { days, hours, minutes, seconds }] = useCountDown({
        targetDate: airDropRound?.endTime,
    });

    return (
        <>
        <div className="relative flex items-center m-auto w-[570px] h-[118px] font-CherryBomb mt-[30px]">
            {/* Left side */}
            <div className="absolute top-[0px] left-[0px] w-[217px] h-[118px] bg-[url('/images/cave/cave-airdrop-bg.png')] bg-no-repeat bg-center" style={{ backgroundSize: '100% 100%' }}>
                <div className="text-[22px] font-bold text-[#FFF5A9] text-center mt-[5px]" style={{ WebkitTextStroke: '1px #000' }}>Airdrop Round {airDropRound?.round}</div>
                <div className="flex items-center justify-center">
                    <div className="w-[30px] h-[30px] text-center">
                        <img src="/images/cave/bera-token.png" alt="bera" className="w-full h-full" />
                    </div>
                    <span className="ml-2 text-[24px] font-bold text-[#FFE08F]" style={{ WebkitTextStroke: '1px #000' }}>{ airDropRound?.amount }</span>
                    <div className="ml-1 text-[16px] text-[#000000] pt-[2px]">$BERA</div>
                </div>

                {/* Center date range */}
                <div className="mx-4 text-[14px] text-[#000] mt-[5px] text-center">
                    { airDropRound?.startTime && formatDate(airDropRound?.startTime, 'yyyy/MM/dd') } - { airDropRound?.endTime && formatDate(airDropRound?.endTime, 'yyyy/MM/dd') }
                </div>
            </div>


            {/* Timer boxes */}
            <div className="flex items-center gap-2 pl-[227px] w-[100%] h-[82px] bg-[url('/images/cave/time-bg.png')] bg-no-repeat bg-center" style={{ backgroundSize: '100% 100%' }}>
                <div className=" px-3 py-1 rounded text-white w-[66px] h-[60px] text-center">
                    <div className="font-bold">{days}</div>
                    <div className="ml-1 text-sm">Days</div>
                </div>

                <div className=" px-3 py-1 rounded text-white w-[66px] h-[60px] ml-[10px] text-center">
                    <div className="font-bold">{hours}</div>
                    <div className="ml-1 text-sm">Hrs</div>
                </div>

                <div className=" px-3 py-1 rounded text-white w-[66px] h-[60px] ml-[10px] text-center">
                    <div className="font-bold">{minutes}</div>
                    <div className="ml-1 text-sm">Mins</div>
                </div>

                <div className=" px-3 py-1 rounded text-white w-[66px] h-[60px] ml-[10px] text-center">
                    <div className="font-bold">{seconds}</div>
                    <div className="ml-1 text-sm">Sec</div>
                </div>
            </div>

            {/* History button */}
            <div onClick={() => setShow(true)} className="absolute top-[0px] cursor-pointer right-[-35px] w-[82px] h-[45px] bg-[url('/images/cave/history-icon.png')] bg-no-repeat bg-center" style={{ backgroundSize: '100% 100%' }}   >
            </div>
        </div>

        <AirDropHistory  show={show} onClose={() => setShow(false)} airDropHistory={airDropHistory} />   
        </>
    )
}