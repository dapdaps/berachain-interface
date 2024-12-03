import { useCallback, useEffect, useState } from "react"
import { useAccount, Config, useConnectorClient } from 'wagmi';
import HatHover from "./HatHover"
import Welcome from "./Welcome"
import ClothHover from "./ClothHover"
import KeyHover from "./KeyHover"
import NeckHover from "./NeckHover"
import useCollect from "./useCollect"
import Tips from "./Tip";
import Bear from "./Bear";
import CheckBox from "./CheckBox";
import { AnyKindOfDictionary } from "lodash";
import dapp from "@/configs/dapp";
import PageBack from "@/components/back";
import { useCaveWelcome } from "@/stores/useCaveWelcome";
import { useBearEqu } from "@/stores/useBearEqu";

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

const carsSize = [{
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

const stakeDapps = [{
    icon: '/images/dapps/infrared.svg',
    name: 'Infrared',
    link: '/staking/infrared'
}]

const lendDapps = [{
    icon: '/images/dapps/dolomite.svg',
    name: 'Dolomite',
    link: '/lending/dolomite'
}, {
    icon: '/images/dapps/bend.svg',
    name: 'Bend',
    link: '/lending/bend'
}]

const swapDapps = [{
    icon: '/images/dapps/kodiak.svg',
    name: 'Kodiak',
    link: '/dex/kodiak'
}, {
    icon: '/images/dapps/bex.png',
    name: 'Bex',
    link: '/dex/bex'
}, {
    icon: '/images/dapps/ooga-booga.svg',
    name: 'Ooga Booga',
    link: '/dex/ooga-booga'
}]

const bridgeDapps = [{
    icon: '/images/dapps/stargate.svg',
    name: 'Stargate',
    link: '/bridge'
}]


const hatTips = [{
    name: 'Baseball Cap',
    content: '$1+ transaction, at least 1 transactions.',
    img: '/images/cave/hat/hat-1-1.png',
    link: '/bridge',
    btnText: 'Bridge',
    dapps: bridgeDapps,
}, {
    name: 'Basic Helmet',
    content: '$10+ transaction, at least 10 transactions.',
    img: '/images/cave/hat/hat-2-2.png',
    link: '/bridge',
    btnText: 'Bridge',
    dapps: bridgeDapps,
}, {
    name: 'Flying Helmet',
    content: '$100+ transaction, at least 100 transactions.',
    img: '/images/cave/hat/hat-3-3.png',
    link: '/bridge',
    btnText: 'Bridge',
    dapps: bridgeDapps,
}, {
    name: 'Motor Helmet',
    content: '$1000+ transaction, at least 1000 transactions.',
    img: '/images/cave/hat/hat-4-4.png',
    link: '/bridge',
    btnText: 'Bridge',
    dapps: bridgeDapps,
}]



const clothTips = [{
    name: 'Hoodie',
    content: '$1+ transaction, at least 1 transactions.',
    img: '/images/cave/clothing/cloth-1-1.png',
    link: '/swap',
    btnText: 'Swap',
    dapps: swapDapps,
}, {
    name: 'Baseball Jacket',
    content: '$10+ transaction, at least 10 transactions.',
    img: '/images/cave/clothing/cloth-2-2.png',
    link: '/swap',
    btnText: 'Swap',
    dapps: swapDapps,
}, {
    name: 'Vintage Jacket',
    content: '$100+ transaction, at least 100 transactions.',
    img: '/images/cave/clothing/cloth-3-3.png',
    link: '/swap',
    btnText: 'Swap',
    dapps: swapDapps,
}, {
    name: 'Windcheater',
    content: '$1000+ transaction, at least 1000 transactions.',
    img: '/images/cave/clothing/cloth-4-4.png',
    link: '/swap',
    btnText: 'Swap',
    dapps: swapDapps,
}]

const carTips = [{
    name: 'Bicycle',
    content: 'Bicycle, Delegate 1 BGT.',
    img: '/images/cave/key/key-tip-1.png',
    link: '/swap',
    btnText: 'Delegate',
    dapps: stakeDapps,
}, {
    name: 'Scooter',
    content: 'Scooter, Delegate 100 BGT.',
    img: '/images/cave/key/key-tip-2.png',
    link: '/swap',
    btnText: 'Delegate',
    dapps: stakeDapps,
}, {
    name: 'Motobike',
    content: 'Motobike, Delegate 10,000 BGT.',
    img: '/images/cave/key/key-tip-3.png',
    link: '/swap',
    btnText: 'Delegate',
    dapps: stakeDapps,
}, {
    name: 'Lambo',
    content: 'Lambo, Delegate 1,000,000 BGT.',
    img: '/images/cave/key/key-tip-4.png',
    link: '/swap',
    btnText: 'Delegate',
    dapps: stakeDapps,
}]

const neckTips = [
    {
        name: 'Alloy Necklace',
        content: '$Lend and Borrow in total $50.',
        img: '/images/cave/neck/neck-tip-1.png',
        link: '/swap',
        btnText: 'Lending',
        dapps: lendDapps,
    },
    {
        name: 'Silver Necklace',
        content: '$Lend and Borrow in total $1000.',
        img: '/images/cave/neck/neck-tip-2.png',
        link: '/swap',
        btnText: 'Lending',
        dapps: lendDapps,
    },
    {
        name: 'Golden Necklace',
        content: '$Lend and Borrow in total $500,000.',
        img: '/images/cave/neck/neck-tip-3.png',
        link: '/swap',
        btnText: 'Lending',
        dapps: lendDapps,
    },
    {
        name: 'Diamond Necklace',
        content: '$Lend and Borrow in total $1,000,000.',
        img: '/images/cave/neck/neck-tip-4.png',
        link: '/swap',
        btnText: 'Lending',
        dapps: lendDapps,
    }
]

export default function Cave() {
    const { address: account } = useAccount()
    const [tipLocation, setTipLocation] = useState<{ x: number, y: number }>({ x: 0, y: 0 })
    const [tipMsg, setTipMsg] = useState<any>()
    const [tipShow, setTipShow] = useState<boolean>()
    const setEqu = useBearEqu((store: any) => store.set)

    const store: any = useCaveWelcome()
    
    const { cars, hats, clothes, necklaces, setCars, setClothes, setHats, setNecklaces } = useCollect({
        address: account as string
    })

    const tipClick = useCallback((e: any, item: any) => {
        if (e.target.classList.contains('cave-tip') || e.target.parentNode.classList.contains('cave-tip')) {
            e.nativeEvent.stopImmediatePropagation()
            let y = e.clientY - 30
            if (y + 220 > window.innerHeight) {
                y = y - 220
            }
    
            setTipLocation({
                x: e.clientX,
                y
            })
            setTipMsg(item)
            setTipShow(true)
        }
       
    }, [])

    const docClick = useCallback((e: any) => {
        if (!e.target.classList.contains('cave-tip') && !e.target.parentNode.classList.contains('cave-tip')) {
            setTipShow(false)
        }
    }, [])

    useEffect(() => {
        document.addEventListener('click', docClick, false)

        return () => {
            document.removeEventListener('click', docClick)
        }
    }, [])


    return <div className=" relative w-[100vw] h-[100vh] min-w-[1200px] min-h-[890px]">
        <PageBack isBlack={false} className="ml-[30px] text-white absolute top-[20px] left-[30px]"/>
        <div className=" text-[60px] text-center text-[#fff] font-CherryBomb">
            <div className="  inline-block relative">Bera Cave
                <img onClick={() => {
                    store.set({ welcomeShow: true })
                }} className="w-[58px] top-[38%] right-[-70px] cursor-pointer absolute" src="/images/cave/ruler.png"/>
            </div>
        </div>
        <div className=" flex gap-[65px] justify-center">
            <img src="/images/cave/bearphoto.png" className="w-[150px]" />
            <img src="/images/cave/youtube.png" className="w-[150px]" />
        </div>
        <div className="flex items-end px-[30px] absolute w-[583px] left-[50%] top-[270px] translate-x-[-50%]">
            {
                hats.map(item => {
                    return <div className="flex-1 relative cursor-pointer cave-tip" onClick={(e) => {
                        tipClick(e, hatTips[item.level - 1])
                    }}>
                        <img className="cursor-pointer" style={hatPositions[item.level - 1]} src={`/images/cave/hat/hat-${item.level}${item.pc_item ? '-' + item.level : ''}.png`} />
                        { item.pc_item && <div className=" absolute bottom-[15px] left-[50%] translate-x-[-50%]">
                            <CheckBox checked={item.checked} onCheckChange={(isChecked) => {
                                setEqu({
                                    hat: isChecked ? item.level : 0
                                })
                            }} />
                        </div>}

                        {  }
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
                <div className="flex px-[30px] pt-[120px]">
                    {
                        clothes.map(item => {
                            return <div className="flex-1 cave-tip relative" onClick={(e) => {
                                tipClick(e, clothTips[item.level - 1])
                            }}>
                                <img className="w-[102px] cursor-pointer" style={clothPositions[item.level - 1]} src={`/images/cave/clothing/cloth-${item.level}${item.pc_item ? '-' + item.level : ''}.png`} />
                                { item.pc_item && <div className=" absolute top-[10px] right-[50px]">
                                    <CheckBox checked={item.checked} onCheckChange={(isChecked) => {
                                        setEqu({
                                            cloth: isChecked ? item.level : 0
                                        })
                                    }} />
                                </div>
                                }
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
                    return <div className="absolute cave-tip" style={carPositions[item.level - 1]} onClick={(e) => {
                        tipClick(e, carTips[item.level - 1])
                    }}>
                        <img className="h-[78px] cursor-pointer" style={item.pc_item ? carsSize[item.level - 1] : {}} src={`/images/cave/key/key-${item.level}${item.pc_item ? '-' + item.level : ''}.png`} />
                        { item.pc_item && <div className=" absolute top-[-30px] left-[30%] translate-x-[-50%]">
                            <CheckBox checked={item.checked} onCheckChange={(isChecked) => {
                                setEqu({
                                    car: isChecked ? item.level : 0
                                })
                            }} />
                        </div>}
                    </div>
                })
            }
        </div>

        <div style={{ left: 'calc(57% + 120px + 290px)' }} className=" absolute w-[186px] h-[224px] top-[150px] translate-x-[-50%] bg-[url('/images/cave/window.png')] bg-contain bg-no-repeat bg-bottom"></div>

       
        <div style={{ left: 'calc(57% + 120px + 214px)' }} onClick={(e) => {
            tipClick(e, neckTips[0])
        }} className="cave-tip w-[159px] h-[214px] translate-x-[-50%] absolute top-[350px] bg-[url('/images/cave/box-mini.png')] bg-contain bg-no-repeat bg-bottom">
            <img src={`/images/cave/neck/neck-1${necklaces.length && necklaces[0].pc_item ? '-1' : ''}.png`} className="w-[71px] absolute left-[11px] top-[35px] cursor-pointer" />
            { !!necklaces.length && necklaces[0].pc_item && <div className=" absolute bottom-[30px] left-[50%] translate-x-[-50%]">
                <NeckLaceChecked item={necklaces.length && necklaces[0]} setEqu={setEqu}/>
            </div>}
        </div>
        <div style={{ left: 'calc(57% + 120px + 348px)' }} onClick={(e) => {
            tipClick(e, neckTips[1])
        }} className="cave-tip w-[159px] h-[214px] translate-x-[-50%] absolute top-[370px] bg-[url('/images/cave/box-mini.png')] bg-contain bg-no-repeat bg-bottom">
            <img src={`/images/cave/neck/neck-2${necklaces.length && necklaces[1].pc_item ? '-2' : ''}.png`} className="w-[71px] absolute left-[14px] top-[32px] cursor-pointer" />
            {!!necklaces.length && necklaces[1].pc_item && <div className=" absolute bottom-[30px] left-[50%] translate-x-[-50%]">
                <NeckLaceChecked item={necklaces.length && necklaces[1]} setEqu={setEqu}/>
            </div>
            }
        </div>

        <div style={{ left: 'calc(57% + 120px + 214px)' }} onClick={(e) => {
            tipClick(e, neckTips[2])
        }} className="cave-tip w-[159px] h-[214px] translate-x-[-50%] absolute top-[530px] bg-[url('/images/cave/box-mini.png')] bg-contain bg-no-repeat bg-bottom">
            <img src={`/images/cave/neck/neck-3${necklaces.length && necklaces[2].pc_item ? '-3' : ''}.png`} className="w-[71px] absolute left-[11px] top-[35px] cursor-pointer" />
            {!!necklaces.length && necklaces[2].pc_item && <div className=" absolute bottom-[30px] left-[50%] translate-x-[-50%]">
                <NeckLaceChecked item={necklaces.length && necklaces[2]} setEqu={setEqu}/>
            </div>
            }
        </div>
        <div style={{ left: 'calc(57% + 120px + 348px)' }} onClick={(e) => {
            tipClick(e, neckTips[3])
        }} className="cave-tip w-[159px] h-[214px] translate-x-[-50%] absolute top-[545px] bg-[url('/images/cave/box-mini.png')] bg-contain bg-no-repeat bg-bottom">
            <img src={`/images/cave/neck/neck-4${necklaces.length && necklaces[3].pc_item ? '-4' : ''}.png`} className="w-[71px] absolute left-[10px] top-[32px] cursor-pointer" />
            {
                !!necklaces.length && necklaces[3].pc_item && <div className=" absolute bottom-[30px] left-[50%] translate-x-[-50%]">
                <NeckLaceChecked item={necklaces.length && necklaces[3]} setEqu={setEqu}/>
            </div>
            }
        </div>
        <div className=" pointer-events-none absolute w-[358px] h-[593px] bottom-[0px] right-[2%] bg-[url('/images/cave/mirror.png')] bg-contain bg-no-repeat bg-bottom"></div>
        <div className=" pointer-events-none absolute w-[50%] h-[45%] bottom-[0px] right-[-150px] bg-[url('/images/cave/stone.png')] bg-contain bg-no-repeat bg-bottom"></div>

        {/* <HatHover />
        <ClothHover />
        <KeyHover />
        <NeckHover /> */}
        

        <Bear cars={cars} hats={hats} clothes={clothes} necklaces={necklaces} />
        <Welcome show={store.welcomeShow} onClose={() => { store.set({ welcomeShow: false }) }}/>
        {
            tipShow && <Tips msg={tipMsg} location={tipLocation} />
        }
    </div>
}


function NeckLaceChecked({item, setEqu}: any) {
    if (!item) {
        return
    }
    return <CheckBox checked={item.checked} onCheckChange={(isChecked) => {
        setEqu({
            necklace: isChecked ? item.level : 0
        })
    }} />
}