export default function GetMore() {
    return <div>
        <div className="text-[36px] font-CherryBomb text-[#FDD54C] mt-[160px] text-center" style={{
            WebkitTextStroke: "2px #000000",
        }} >How To Get More?</div>

        <div className="flex items-center justify-between pl-[60px] pr-[40px] gap-[30px] font-Montserrat">
            <img src="/images/treasure-book/step-1.png" className="h-[164px]" />
            <div className="flex-1">
                <div className="text-[18px] font-bold">Complete one daily</div>
                <div className="text-[24px] font-bold cursor-pointer underline">check-in</div>
                <RewardItem />
            </div>
        </div>

        <div className="flex items-center justify-between pl-[60px] pr-[10px] gap-[30px] font-Montserrat mt-[30px]">
            <div className="flex-1">
                <div className="text-[18px] font-bold text-right">
                    <span className="text-[24px] font-bold underline cursor-pointer mr-[10px]">Swap</span>
                    atleast $100 valued assets
                </div>
                <RewardItem gemAmount={100} />
            </div>
            <img src="/images/treasure-book/step-2.png" className="h-[164px]" />
        </div>


        <div className="flex items-center justify-between pl-[60px] pr-[20px] gap-[30px] font-Montserrat mt-[30px]">
            <img src="/images/treasure-book/step-3.png" className="h-[164px]" />
            <div className="flex-1">
                <div className="text-[24px] font-bold cursor-pointer underline">Join Vaults </div>
                <div className="text-[18px] font-bold">atleast $100 valued</div>
                <RewardItem gemAmount={100} />
            </div>
        </div>
    </div>;
}

function RewardItem({ gemAmount }: { gemAmount?: number }) {
    return <div className="flex items-center justify-between mt-[10px] bg-[#FFFFFF33] rounded-[10px] p-[10px] border border-dashed border-[#8B6A45] border-dashed">
        <div className="flex items-center gap-[5px]">
            <div className="text-[18px] font-bold">1</div>
            <img src="/images/treasure-book/box.png" className="w-[30px]" alt="item" />
            {
                gemAmount && <>
                    <div className="text-[18px] font-bold"> + {gemAmount}</div>
                    <img src="/images/treasure-book/gem.png" className="w-[30px]" alt="item" />
                </>
            }

        </div>
        <div className="cursor-pointer">
            <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.415 0.21582C12.6709 -0.122817 13.1998 -0.0504184 13.3545 0.344727L15.5801 6.03613C15.7275 6.41323 15.4252 6.81357 15.0225 6.77441L8.94043 6.18652C8.51794 6.14562 8.30368 5.65705 8.55957 5.31836L9.41113 4.18945C8.98618 4.09236 8.54959 4.04102 8.11035 4.04102C4.95844 4.04102 2.39459 6.55521 2.39453 9.64551C2.39453 12.7366 4.9584 15.251 8.11035 15.251C10.7164 15.251 12.9919 13.5248 13.6436 11.0537C13.8134 10.4148 14.4697 10.0337 15.1074 10.2012C15.7463 10.3703 16.1282 11.0249 15.96 11.6641C15.0292 15.1851 11.8015 17.6455 8.11035 17.6455C3.63832 17.6455 0 14.0567 0 9.64551C6.12127e-05 5.23513 3.63835 1.64648 8.11035 1.64648C9.08129 1.64649 10.0454 1.82081 10.9502 2.15332L12.415 0.21582Z" fill="#D39924" />
            </svg>
        </div>
    </div>;
}