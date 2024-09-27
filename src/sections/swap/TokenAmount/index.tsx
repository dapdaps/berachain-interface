"use client"

export default function TokenAmout() {
    return <div className="border border-[#000] rounded-[12px] p-[14px] bg-white">
        <div className="flex items-center justify-between gap-[10px]">
            <div className="border flex items-center justify-between border-[#000] rounded-[8px] bg-[#FFFDEB] w-[176px] h-[46px] px-[7px]">
                <div className="flex items-center gap-[10px]">
                    <div className="relative">
                        <img className="w-[26px] h-[26px]" src="https://s3.amazonaws.com/dapdap.main/avatar/0x86cdcd7fa9f3b24d68cbdd9170c3662036bdc2ef1727332750443" />
                    </div>
                    <div>
                        <div className="text-[16px] font-[600]">ETH</div>
                    </div>
                </div>
                <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L6 5L11 1" stroke="black" stroke-width="2" stroke-linecap="round" />
                </svg>
            </div>
            <div className="flex-1">
                <input className="w-[100%] h-[100%] text-[26px] text-right"/>
            </div>
        </div>

        <div className="flex items-center justify-between text-[#3D405A] mt-[10px] font-medium text-[12px]">
            <div>balance: 0</div>
            <div>$2637.88</div>
        </div>
    </div>
}