import { useState } from "react"
import HatHover from "./HatHover"
import Welcome from "./Welcome"
import ClothHover from "./ClothHover"
import KeyHover from "./KeyHover"
import NeckHover from "./NeckHover"

export default function Cave() {
    const [hatShow, setHatShow] = useState(false)

    return <div className=" relative w-[100vw] h-[100vh]">
        <div className=" text-[60px] text-center text-[#fff] font-CherryBomb">Bear Cave</div>

        <div  className="flex items-end px-[30px] absolute w-[583px] left-[50%] top-[270px] translate-x-[-50%] ">
            <div className="flex-1">
                <img className="w-[102px]" src="/images/cave/hat/hat-1-1.png" />
            </div>
            <div className="flex-1">
                <img className="w-[106px]" src="/images/cave/hat/hat-2.png" />
            </div>
            <div className="flex-1">
                <img className="w-[103px]" src="/images/cave/hat/hat-3-3.png" />
            </div>
            <div className="flex-1" >
                <img className="w-[107px]" src="/images/cave/hat/hat-4.png" />
            </div>

        </div>

        <div className="absolute w-[583px] left-[50%] translate-x-[-50%] top-[270px] h-[398px] bg-[url('/images/cave/sheet.png')] bg-contain bg-no-repeat bg-bottom">
            <div className="flex items-end px-[30px] pt-[120px]">
                <div className="flex-1">
                    <img className="w-[102px]" src="/images/cave/clothing/cloth-1.png" />
                </div>
                <div className="flex-1">
                    <img className="w-[102px] ml-[20px] mt-[10px]" src="/images/cave/clothing/cloth-2-2.png" />
                </div>
                <div className="flex-1">
                    <img className="w-[102px]" src="/images/cave/clothing/cloth-3.png" />
                </div>
                <div className="flex-1">
                    <img className="w-[102px]" src="/images/cave/clothing/cloth-4-4.png" />
                </div>
            </div>
        </div>

        <div style={{ left: 'calc(50% - 170px - 290px)' }} className="w-[349px] h-[230px] translate-x-[-50%] absolute top-[500px] bg-[url('/images/cave/box.png')] bg-contain bg-no-repeat bg-bottom">
            <div className="absolute left-[67px] top-[58px]">
                <img src="/images/cave/key/key-1-1.png" className="h-[102px] ml-[-12px]"/>
                {/* <img src="/images/cave/key/key-1.png" className="h-[78px]"/> */}
            </div>
            <div className="absolute left-[137px] top-[54px]">
                <img src="/images/cave/key/key-2.png" className="h-[78px]"/>
            </div>
            <div className="absolute left-[204px] top-[46px]">
                <img src="/images/cave/key/key-2.png" className="h-[78px]"/>
            </div>
            <div className="absolute left-[272px] top-[38px]">
                <img src="/images/cave/key/key-3.png" className="h-[78px]"/>
            </div>
        </div>

        <div style={{ left: 'calc(57% + 120px + 290px)' }} className=" absolute w-[186px] h-[224px] top-[150px] translate-x-[-50%] bg-[url('/images/cave/window.png')] bg-contain bg-no-repeat bg-bottom"></div>

        <div style={{ left: 'calc(57% + 120px + 214px)' }} className="w-[159px] h-[214px] translate-x-[-50%] absolute top-[530px] bg-[url('/images/cave/box-mini.png')] bg-contain bg-no-repeat bg-bottom">
            <img src="/images/cave/neck/neck.png" className="w-[71px] absolute left-[15px] top-[35px]"/>
        </div>
        <div style={{ left: 'calc(57% + 120px + 348px)' }} className="w-[159px] h-[214px] translate-x-[-50%] absolute top-[540px] bg-[url('/images/cave/box-mini.png')] bg-contain bg-no-repeat bg-bottom">
            <img src="/images/cave/neck/neck-4.png" className="w-[71px] absolute left-[10px] top-[29px]"/>
        </div>
        <div style={{ left: 'calc(57% + 120px + 214px)' }} className="w-[159px] h-[214px] translate-x-[-50%] absolute top-[350px] bg-[url('/images/cave/box-mini.png')] bg-contain bg-no-repeat bg-bottom">
            <img src="/images/cave/neck/neck.png" className="w-[71px] absolute left-[15px] top-[35px]"/>
        </div>
        <div style={{ left: 'calc(57% + 120px + 348px)' }} className="w-[159px] h-[214px] translate-x-[-50%] absolute top-[370px] bg-[url('/images/cave/box-mini.png')] bg-contain bg-no-repeat bg-bottom">
            <img src="/images/cave/neck/neck-2.png" className="w-[71px] absolute left-[14px] top-[32px]"/>
        </div>

        <div className=" absolute w-[776px] h-[388px] bottom-[0px] right-[-150px] bg-[url('/images/cave/stone.png')] bg-contain bg-no-repeat bg-bottom"></div>
    
        <HatHover />
        <ClothHover />
        <KeyHover />
        <NeckHover />

        <Welcome />
    </div>
}
