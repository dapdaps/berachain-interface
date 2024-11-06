interface Props {
    checked?: boolean;
    onCheckChange?: (v: boolean) => void;
}

export default function CheckBox({
    checked,
    onCheckChange,
}: Props) {

    return <>
        {
            checked
                ? <div onClick={() => {
                    onCheckChange && onCheckChange(false)
                }} className="w-[24px] h-[24px] rounded-[24px] flex items-center justify-center border-[2px] border-[#4B371F] cursor-pointer backdrop-blur-[10px] bg-[#C7FF6E]">
                    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.3999 6L5.9999 9.6L13.5999 2" stroke="#4B371F" stroke-width="3" stroke-linecap="round" />
                    </svg>
                </div>
                : <div onClick={() => {
                    onCheckChange && onCheckChange(true)
                }} className="w-[24px] h-[24px] rounded-[24px] border-[2px] border-[#FFF5A9] cursor-pointer backdrop-blur-[10px] bg-[#0000004D]"></div>
        }
    </>
}