import MenuButton from "@/components/mobile/menuButton"

const Cave = () => {
    return (
        <>
            <div className="relative mt-10" style={{
                backgroundImage: `url('/images/mobile/cave/header.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                height: '30.384vw',
                width: '100vw'
            }}>
                <MenuButton className="my-0 mx-auto" contentClassName="text-2xl">Bear Cave</MenuButton>
                <div className="absolute top-[13.22vw] bg-[#9C948F] h-[120vh] w-full z-[-1]">
                    <div className="absolute bottom-[24.615vw]" style={{
                        backgroundImage: `url('/images/mobile/cave/bottom.png')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        height: '82.05vw',
                        width: '100vw'
                    }} />
                    <div className="mt-[7.692vw] flex flex-col justify-center items-center">
                        <div className="w-full flex flex-col items-center justify-center mt-[20.512vw] relative">
                            <img src="/images/mobile/cave/backStripe.png" className="w-[96.417vw] h-[12.37vw]" alt="" />
                            <div className="absolute flex items-center w-[96.417vw] -top-[17.435vw]">
                                <div className="flex-1">
                                    <img className="w-[24.358vw] h-[19.23vw]" src="/images/mobile/cave/hat/hat-1.png" />
                                </div>
                                <div className="flex-1">
                                    <img className="w-[24.358vw] h-[19.23vw]" src="/images/mobile/cave/hat/hat-2.png" />
                                </div>
                                <div className="flex-1">
                                    <img className="w-[24.358vw] h-[19.23vw]" src="/images/mobile/cave/hat/hat-3.png" />
                                </div>
                                <div className="flex-1" >
                                    <img className="w-[24.358vw] h-[19.23vw]" src="/images/mobile/cave/hat/hat-4.png" />
                                </div>
                            </div>
                            <div className="absolute flex items-center w-[96.417vw] top-[9.23vw]">
                                <div className="flex-1">
                                    <img className="w-[24.358vw] h-[42.051vw]" src="/images/mobile/cave/jacket/jacket-1.png" />
                                </div>
                                <div className="flex-1">
                                    <img className="w-[24.358vw] h-[42.051vw]" src="/images/mobile/cave/jacket/jacket-2.png" />
                                </div>
                                <div className="flex-1">
                                    <img className="w-[24.358vw] h-[42.051vw]" src="/images/mobile/cave/jacket/jacket-3.png" />
                                </div>
                                <div className="flex-1" >
                                    <img className="w-[24.358vw] h-[42.051vw]" src="/images/mobile/cave/jacket/jacket-4.png" />
                                </div>
                            </div>
                            <img src="/images/mobile/cave/backStripe.png" className="w-[96.417vw] h-[12.37vw] absolute top-[51.282vw]" alt="" />
                            <div className="absolute top-[67vw]" style={{
                                backgroundImage: `url('/images/mobile/cave/cupboard-1.png')`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                height: '46.923vw',
                                width: '98.461vw'
                            }}>
                            <div className="flex items-center w-[96.417vw] top-[9.23vw]">
                                <div className="flex-1">
                                    <img className="w-[24.358vw] h-[42.051vw]" src="/images/mobile/cave/jewelry/jewelry-1.png" />
                                </div>
                                <div className="flex-1">
                                    <img className="w-[24.358vw] h-[42.051vw]" src="/images/mobile/cave/jewelry/jewelry-2.png" />
                                </div>
                                <div className="flex-1">
                                    <img className="w-[24.358vw] h-[42.051vw]" src="/images/mobile/cave/jewelry/jewelry-3.png" />
                                </div>
                                <div className="flex-1" >
                                    <img className="w-[24.358vw] h-[42.051vw]" src="/images/mobile/cave/jewelry/jewelry-4.png" />
                                </div>
                            </div>
                            </div>
                            <div className="absolute top-[117.43vw]" style={{
                                backgroundImage: `url('/images/mobile/cave/cupboard-2.png')`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                height: '38.974vw',
                                width: '98.461vw'
                            }}>
                            <div className="flex items-center w-[96.417vw] top-[9.23vw]">
                                <div className="flex-1">
                                    <img className="w-[24.358vw] h-[42.051vw]" src="/images/mobile/cave/key/key-1.png" />
                                </div>
                                <div className="flex-1">
                                    <img className="w-[24.358vw] h-[42.051vw]" src="/images/mobile/cave/key/key-2.png" />
                                </div>
                                <div className="flex-1">
                                    <img className="w-[24.358vw] h-[42.051vw]" src="/images/mobile/cave/key/key-3.png" />
                                </div>
                                <div className="flex-1" >
                                    <img className="w-[24.358vw] h-[42.051vw]" src="/images/mobile/cave/key/key-4.png" />
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Cave

