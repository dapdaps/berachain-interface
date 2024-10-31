import MenuButton from "@/components/mobile/menuButton"

const Cave = () => {
    return (
        <>
            <div className="relative mt-10" style={{
                backgroundImage: `url('/images/mobile/cave/header.png')`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                height: '30.384vw',
                width: '100vw'
            }}>
                <MenuButton className="my-0 mx-auto" contentClassName="text-2xl">Bear Cave</MenuButton>
                <div className="absolute bg-[#9C948F] h-screen w-full z-[-1]">bg</div>
            </div>
        </>
    )
}

export default Cave

