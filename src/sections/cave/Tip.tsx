import Link from "next/link";

interface Props {
    location: {x: number, y: number},
    msg: {
        img: string;
        name: string;
        content: string;
        link: string;
        btnText: string;
    }
}

export default function Tips({location, msg}: Props) {
    if (!msg) {
        return null
    }

    return <div style={{
        left: location.x,
        top: location.y,
    }} className=" absolute w-[166px] h-[217px] rounded-[13px] z-20 border-[3px] border-[#C7FF6E] bg-[#00000080] backdrop-blur-[10px]">
        <div className="flex items-center justify-center w-[75px] h-[75px] text-center m-auto mt-[5px]">
            <img src={msg?.img} className="max-w-[100%] max-h-[100%]"/>
        </div>
        <div className="text-[18px] text-[#F7F9EA] font-CherryBomb text-center " style={{ WebkitTextStroke: '1px #4B371F' }}>{ msg.name }</div>
        <div className="text-[#fff] text-[12px] px-[10px] mt-[5px]">{ msg.content }</div>
        <div className="bg-[#FFF5A9] text-[#F7F9EA] mt-[15px] font-CherryBomb border-[2px] border-[#4B371F] text-center mx-[10px] rounded-[31px] cursor-pointer h-[32px] " ><Link style={{ WebkitTextStroke: '1px #4B371F' }} href={ msg.link }>{ msg.btnText }</Link></div>
    </div>
}