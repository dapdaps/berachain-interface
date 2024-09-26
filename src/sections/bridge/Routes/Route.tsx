import CheckBox from "../CheckBox";

export default function Route() {
    return <div className="flex items-center justify-between py-[10px]">
        <div className="flex items-center gap-[10px]">
            <img className="w-[30px] h-[30px]" src="https://s3.amazonaws.com/dapdap.main/avatar/0x86cdcd7fa9f3b24d68cbdd9170c3662036bdc2ef1727332750443"/>
            <div className="text-[16px] font-[600]">Stargate</div>
        </div>

        <div className="flex items-center gap-2">
            <div className="text-right">
                <div className="text-[16px] font-[600]">~2640.16</div>
                <div className="text-[12px] font-medium text-[#3D405A]">~3 min | Fee $0.13</div>
            </div>
            <CheckBox checked={true} onChange={() => {}}/>
        </div>
    </div>
}