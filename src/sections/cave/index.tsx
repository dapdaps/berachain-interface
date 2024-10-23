export default function Cave() {
    return <div className=" relative">
        <div className=" text-[60px] text-center text-[#fff] font-CherryBomb">Bear Cave</div>

        <div className="flex items-end px-[30px] absolute w-[583px] left-[50%] top-[270px] translate-x-[-50%] ">
            <div className="flex-1">
                <img className="w-[102px]" src="/images/cave/hat/hat-1-1.png" />
            </div>
            <div className="flex-1">
                <img className="w-[106px]" src="/images/cave/hat/hat-2.png" />
            </div>
            <div className="flex-1">
                <img className="w-[103px]" src="/images/cave/hat/hat-3-3.png" />
            </div>
            <div className="flex-1">
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

        <div style={{ left: 'calc(50% - 170px - 290px)' }} className="w-[279px] h-[230px] translate-x-[-50%] absolute top-[500px] bg-[url('/images/cave/box.png')] bg-contain bg-no-repeat bg-bottom">
            <div className="absolute left-[74px] top-[68px]">
                <img src="/images/cave/key/key-1-1.png" className="h-[102px] ml-[-12px]"/>
                {/* <img src="/images/cave/key/key-1.png" className="h-[78px]"/> */}
            </div>
            <div className="absolute left-[150px] top-[58px]">
                <img src="/images/cave/key/key-2.png" className="h-[78px]"/>
            </div>
            <div className="absolute left-[219px] top-[50px]">
                <img src="/images/cave/key/key-3.png" className="h-[78px]"/>
            </div>
        </div>


        <div style={{ left: 'calc(57% + 170px + 214px)' }} className="w-[159px] h-[214px] translate-x-[-50%] absolute top-[420px] bg-[url('/images/cave/box-mini.png')] bg-contain bg-no-repeat bg-bottom">
            <img src="/images/cave/neck/neck.png" className="w-[71px] absolute left-[40px] top-[60px]"/>
        </div>
        <div style={{ left: 'calc(57% + 170px + 348px)' }} className="w-[159px] h-[214px] translate-x-[-50%] absolute top-[440px] bg-[url('/images/cave/box-mini.png')] bg-contain bg-no-repeat bg-bottom">
            <img src="/images/cave/neck/neck-2.png" className="w-[71px] absolute left-[40px] top-[60px]"/>
        </div>

    </div>
}
