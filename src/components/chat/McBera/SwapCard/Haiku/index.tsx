import HaikuIcon from "./icon";
import ShadowButton from "@/components/chat/components/ShadowButton";
import useHaikuStore from "../../../stores/useHaikuStore";

export default function Haiku({ data }: any) {
  const haikuStore = useHaikuStore();
  return (
    <div className="mt-[30px]">
      <div className="flex gap-[4px] items-center">
        <span>Or you can choose to trade on</span> <HaikuIcon />
        <span className="font-bold">HaiKu</span>
      </div>
      <div className="mt-[10px]">👍 Best route found:</div>
      <div className="border border-[#DAD9CD] rounded-[10px] p-[6px] flex items-center justify-between mt-[6px]">
        <div className="flex gap-[10px] items-center">
          <div className="w-[56px] h-[26px] shrink-0 leading-[26px] text-center rounded-[6px] border border-[#000000] bg-[#FF888A] text-[12px] text-black font-bold">
            Dex
          </div>
          <div className="text-[13px] text-black/50 flex">
            Use the best router provided by Haiku
          </div>
        </div>
        <ShadowButton
          className="w-[56px] h-[26px]"
          onClick={() => {
            haikuStore.set({
              data,
              modalOpen: true
            });
          }}
        >
          Swap
        </ShadowButton>
      </div>
    </div>
  );
}
