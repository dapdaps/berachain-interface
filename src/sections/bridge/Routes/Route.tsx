import CheckBox from "../CheckBox";

export default function Route({ name }: any) {
    return <div className="flex items-center justify-between py-[10px]">
        <div className="flex items-center gap-[10px]">
            <img className="w-[30px] h-[30px]" src="https://s3.amazonaws.com/dapdap.prod/images/stargate.png"/>
            <div className="text-[16px] font-[600]">{ name }</div>
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