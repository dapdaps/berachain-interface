import { useCallback, useState } from "react"
import { useAccount, Config, useConnectorClient } from 'wagmi';
import HatHover from "./HatHover"
import Welcome from "./Welcome"
import ClothHover from "./ClothHover"
import KeyHover from "./KeyHover"
import NeckHover from "./NeckHover"
import useCollect from "./useCollect"
import Tips from "./Tip";

const hatPositions = [{
    width: 102,

}, {
    width: 106
}, {
    width: 103
}, {
    width: 107
}]

const carPositions = [
    { left: 70, top: 60 },
    { left: 137, top: 54 },
    { left: 204, top: 46 },
    { left: 272, top: 38 },
]

const clothPositions = [{}, {
    marginLeft: 20,
}, {}, {}]

const carsSize= [{
    height: 102,
    marginLeft: -14
}, {
    height: 102,
    marginLeft: -21
}, {
    height: 102,
    marginLeft: -16
}, {
    height: 102,
    marginLeft: -13
}]

const hatTips = [{
    name: 'Baseball Cap',
    content: 'Bridge $100+ per transaction, complete at least 1 transaction.',
    img: '/images/cave/hat/hat-1-1.png',
    link: '/bridge',
    btnText: 'Bridge',
}, {
    name: 'Basic Helmet',
    content: 'Bridge $100+ per transaction, complete at least 10 transactions.',
    img: '/images/cave/hat/hat-2-2.png',
    link: '/bridge',
    btnText: 'Bridge',
}, {
    name: 'Flying Helmet',
    content: 'Bridge $100+ per transaction, complete at least 100 transactions.',
    img: '/images/cave/hat/hat-3-3.png',
    link: '/bridge',
    btnText: 'Bridge',
}, {
    name: 'Motor Helmet',
    content: 'Bridge $100+ per transaction, complete at least 1000 transactions.',
    img: '/images/cave/hat/hat-4-4.png',
    link: '/bridge',
    btnText: 'Bridge',
}]

const clothTips = [{
    name: 'Hoodie',
    content: 'Swap $100+ per transaction, complete at least 1 transaction.',
    img: '/images/cave/clothing/cloth-1-1.png',
    link: '/swap',
    btnText: 'Swap',
}, {
    name: 'Baseball Jacket',
    content: 'Bridge $100+ per transaction, complete at least 10 transactions.',
    img: '/images/cave/clothing/cloth-2-2.png',
    link: '/swap',
    btnText: 'Swap',
}, {
    name: 'Vintage Jacket',
    content: 'Bridge $100+ per transaction, complete at least 100 transactions.',
    img: '/images/cave/clothing/cloth-3-3.png',
    link: '/swap',
    btnText: 'Swap',
}, {
    name: 'Windcheater',
    content: 'Bridge $100+ per transaction, complete at least 1000 transactions.',
    img: '/images/cave/clothing/cloth-4-4.png',
    link: '/swap',
    btnText: 'Swap',
}]

const carTips = [{
    name: 'Bicycle',
    content: 'Swap $100+ per transaction, complete at least 1 transaction.',
    img: '/images/cave/key/key-1-1.png',
    link: '/swap',
    btnText: 'Swap',
}, {
    name: 'Vehicle',
    content: 'Bridge $100+ per transaction, complete at least 10 transactions.',
    img: '/images/cave/key/key-2-2.png',
    link: '/swap',
    btnText: 'Swap',
}, {
    name: 'Motocycle',
    content: 'Bridge $100+ per transaction, complete at least 100 transactions.',
    img: '/images/cave/key/key-3-3.png',
    link: '/swap',
    btnText: 'Swap',
}, {
    name: 'Race Car',
    content: 'Bridge $100+ per transaction, complete at least 1000 transactions.',
    img: '/images/cave/key/key-4-4.png',
    link: '/swap',
    btnText: 'Swap',
}]

export default function Cave() {
    const { address: account } = useAccount()
    const [tipLocation, setTipLocation] = useState<{x: number, y: number}>({x: 0, y: 0})
    const [tipMsg, setTipMsg] = useState<any>()

    const { cars, hats, clothes, necklaces } = useCollect({
        address: account as string
    })

    const tipClick = useCallback((e: any, item: any) => {
        setTipLocation({
            x: e.clientX,
            y: e.clientY - 30
        })

        setTipMsg(item)
    }, [])

    return <div className=" relative w-[100vw] h-[100vh]">
        <div className=" text-[60px] text-center text-[#fff] font-CherryBomb">Bear Cave</div>

        <div className="flex items-end px-[30px] absolute w-[583px] left-[50%] top-[270px] translate-x-[-50%] ">
            {
                hats.map(item => {
                    return <div className="flex-1 cursor-pointer" onClick={(e) => {
                        tipClick(e, hatTips[item.level - 1])
                    }}>
                        <img className="cursor-pointer" style={hatPositions[item.level - 1]} src={`/images/cave/hat/hat-${item.level}${item.pc_item ? '-' + item.level : ''}.png`} />
                    </div>
                })
            }  
            {/* <div className="flex-1">
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
            </div> */}

        </div>

        <div className="absolute w-[583px] left-[50%] translate-x-[-50%] top-[355px] h-[398px] overflow-hidden">
            <div className="absolute w-[583px] top-[-80px] h-[398px] bg-[url('/images/cave/sheet.png')] bg-contain bg-no-repeat bg-bottom">
                <div className="flex items-end px-[30px] pt-[120px]">
                    {
                        clothes.map(item => {
                            return <div className="flex-1" onClick={(e) => {
                                tipClick(e, clothTips[item.level - 1])
                            }}>
                                <img className="w-[102px] cursor-pointer" style={clothPositions[item.level - 1]} src={`/images/cave/clothing/cloth-${item.level}${item.pc_item ? '-' + item.level  : ''}.png`} />
                            </div>
                        })
                    }

                    {/* <div className="flex-1">
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
                    </div> */}
                </div>
            </div>
        </div>

        <div style={{ left: 'calc(50% - 170px - 290px)' }} className="w-[349px] h-[230px] translate-x-[-50%] absolute top-[500px] bg-[url('/images/cave/box.png')] bg-contain bg-no-repeat bg-bottom">
            {/* <div className="absolute left-[67px] top-[58px]">
                <img src="/images/cave/key/key-1-1.png" className="h-[102px] ml-[-12px]"/>
            </div>
            <div className="absolute left-[137px] top-[54px]">
                <img src="/images/cave/key/key-2.png" className="h-[78px]"/>
            </div>
            <div className="absolute left-[204px] top-[46px]">
                <img src="/images/cave/key/key-2.png" className="h-[78px]"/>
            </div>
            <div className="absolute left-[272px] top-[38px]">
                <img src="/images/cave/key/key-3.png" className="h-[78px]"/>
            </div> */}

            {
                cars.map(item => {
                    return <div className="absolute" style={carPositions[item.level - 1]} onClick={(e) => {
                        setTipLocation({
                            x: e.clientX,
                            y: e.clientY - 30
                        })

                        setTipMsg(carTips[item.level - 1])
                    }}>
                        <img className="h-[78px] cursor-pointer" style={item.pc_item ? carsSize[item.level - 1] : {}} src={`/images/cave/key/key-${item.level}${item.pc_item ? '-' + item.level : ''}.png`} />
                    </div>
                })
            }
        </div>

        <div style={{ left: 'calc(57% + 120px + 290px)' }} className=" absolute w-[186px] h-[224px] top-[150px] translate-x-[-50%] bg-[url('/images/cave/window.png')] bg-contain bg-no-repeat bg-bottom"></div>

        <div style={{ left: 'calc(57% + 120px + 214px)' }} className="w-[159px] h-[214px] translate-x-[-50%] absolute top-[530px] bg-[url('/images/cave/box-mini.png')] bg-contain bg-no-repeat bg-bottom">
            <img src={`/images/cave/neck/neck-3${necklaces.length && necklaces[2].pc_item ? '-3' : ''}.png`} className="w-[71px] absolute left-[11px] top-[35px]" />
        </div>
        <div style={{ left: 'calc(57% + 120px + 348px)' }} className="w-[159px] h-[214px] translate-x-[-50%] absolute top-[545px] bg-[url('/images/cave/box-mini.png')] bg-contain bg-no-repeat bg-bottom">
            <img src={`/images/cave/neck/neck-4${necklaces.length && necklaces[3].pc_item ? '-4' : ''}.png`} className="w-[71px] absolute left-[10px] top-[32px]" />
        </div>
        <div style={{ left: 'calc(57% + 120px + 214px)' }} className="w-[159px] h-[214px] translate-x-[-50%] absolute top-[350px] bg-[url('/images/cave/box-mini.png')] bg-contain bg-no-repeat bg-bottom">
            <img src={`/images/cave/neck/neck-1${necklaces.length && necklaces[0].pc_item ? '-1' : ''}.png`} className="w-[71px] absolute left-[11px] top-[35px]" />
        </div>
        <div style={{ left: 'calc(57% + 120px + 348px)' }} className="w-[159px] h-[214px] translate-x-[-50%] absolute top-[370px] bg-[url('/images/cave/box-mini.png')] bg-contain bg-no-repeat bg-bottom">
            <img src={`/images/cave/neck/neck-2${necklaces.length && necklaces[1].pc_item ? '-2' : ''}.png`} className="w-[71px] absolute left-[14px] top-[32px]" />
        </div>

        <div className=" absolute w-[976px] h-[488px] bottom-[0px] right-[-150px] bg-[url('/images/cave/stone.png')] bg-contain bg-no-repeat bg-bottom"></div>

        {/* <HatHover />
        <ClothHover />
        <KeyHover />
        <NeckHover /> */}

        <Welcome />
        <Tips msg={tipMsg} location={tipLocation}/>;
    </div>
}
