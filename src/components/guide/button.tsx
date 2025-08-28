import clsx from "clsx";

export default function Button({ children, className, showBox = true, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { showBox?: boolean }) {
    return (
        <button
            className={clsx(
                "relative w-[300px] h-[50px] bg-[#FFDC50] rounded-[10px] text-[16px] border-black border text-black font-[700] font-Montserrat whitespace-nowrap shadow-[6px_6px_0px_0px_#00000040]",
                className
            )}
            {...props}
        >
            {children}
            {showBox && <img src="/images/treasure-book/box.png" className="absolute left-[-50px] top-[-10px] w-[80px]" />}
        </button>
    )
}