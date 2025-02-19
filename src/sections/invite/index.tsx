

const InviteViews = () => {
    return (
        <div className="flex min-h-screen justify-center items-center relative">
            <div className="absolute left-0 bottom-0 z-0 w-[603px] h-[748px] bg-[url(/images/invite/cloud-left.png)] bg-no-repeat bg-center bg-contain">
                <div className="w-full h-full relative">
                    <img src="/images/invite/fllower-left.png" className="absolute bottom-0 left-0 w-[310px] h-[202px]" alt="" />
                </div>
            </div>
            <div className="bg-[url(/images/invite-bera.png)] absolute left-1/2 -translate-x-1/2 bottom-0 z-10 bg-no-repeat bg-center bg-contain w-[993px] h-[817px]"></div>
            <div className="absolute right-0 bottom-0 z-0 w-[663px] h-[765px] bg-[url(/images/invite/cloud-right.png)] bg-no-repeat bg-center bg-contain">
                <div className="w-full h-full relative">
                    <img src="/images/invite/fllower-right.png" className="absolute bottom-0 right-0 w-[270px] h-[294px]" alt="" />
                </div>
            </div>
        </div>
    )
}

export default InviteViews