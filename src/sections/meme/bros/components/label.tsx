import clsx from "clsx";

export default function Label({ className, children }: any) {
  return (
    <div className={clsx("relative", className)}>
      <div className="relative w-full h-full z-[2] flex flex-col justify-center rounded-[5px] border border-black bg-[#FFCC00]">
        <div className="w-[4px] h-[4px] rounded-full bg-black absolute left-[8px] top-[8px]" />
        <div className="w-[4px] h-[4px] rounded-full bg-black absolute right-[8px] top-[8px]" />
        <div className="w-[4px] h-[4px] rounded-full bg-black absolute right-[8px] bottom-[8px]" />
        <div className="w-[4px] h-[4px] rounded-full bg-black absolute left-[8px] bottom-[8px]" />
        {children}
      </div>
      <div className="w-full h-full bg-[#A68400] rounded-[5px] border border-black absolute right-[-4px] bottom-[-4px]" />
    </div>
  );
}
