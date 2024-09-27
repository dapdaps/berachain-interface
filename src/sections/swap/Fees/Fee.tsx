
interface Props {
    name: string;
    value: string;
}

export default function Route({ name, value }: Props) {
    return <div className="flex items-center justify-between py-[5px]">
        <div className="flex items-center gap-[10px]">
            <div className="text-[16px]">{name}</div>
        </div>

        <div className="flex items-center gap-2">
            <div className="text-right">
                <div className="text-[16px]">~2640.16</div>
            </div>
        </div>
    </div>
}