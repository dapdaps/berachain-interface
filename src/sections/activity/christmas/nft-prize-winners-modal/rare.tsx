import clsx from "clsx";
import { numberFormatter } from '@/utils/number-formatter';

export default function Rare({ rare }: any) {
  return (
    <div className="w-[150px] h-[154px] md:w-full rounded-[10px] bg-black/5 flex flex-col items-center relative shrink-0">
      <img
        src={rare.logo}
        className={clsx(
          "w-[100px] h-[100px] rounded-[10px] mt-[15px]",
          !rare.amount && "opacity-50"
        )}
      />
      <div className="text-[12px] font-semibold mt-[8px]">
        {rare.name}
      </div>
      {rare.amount && (
        <div className="absolute right-[-20px] top-[-10px] rounded-[10px] h-[25px] border border-2 border-black bg-[#C8D060] text-[12px] font-CherryBomb">
          <div className="w-full bg-[#EBF479] rounded-[15px] px-[4px] h-[18px]">
            x{numberFormatter(rare.amount, 2, true, { isShort: true })}
          </div>
        </div>
      )}
    </div>
  );
}
