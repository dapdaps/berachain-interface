import clsx from "clsx";
import config from "../present-icons/config";
export default function Present({ gift }: any) {
  const { icon: Icon, name, smallSizePositionClassName } = config[gift];
  return (
    <div className="w-[150px] h-[154px] rounded-[10px] bg-black/5 flex flex-col items-center relative shrink-0">
      <div className="w-[100px] h-[100px] rounded-[10px] mt-[15px] flex justify-center items-center">
        <Icon className={clsx("origin-center", smallSizePositionClassName)} />
      </div>
      <div className="text-[14px] font-semibold mt-[8px]">{name}</div>
    </div>
  );
}
