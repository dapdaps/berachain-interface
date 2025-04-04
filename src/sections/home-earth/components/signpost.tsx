import clsx from "clsx";
import { useRouter } from "next/navigation";
import SignpostBubble from "@/sections/home-earth/components/signpost-bubble";
import Popover, {
  PopoverPlacement,
  PopoverTrigger
} from "@/components/popover";
import useIsMobile from "@/hooks/use-isMobile";
import useClickTracking from "@/hooks/use-click-tracking";

const OPEN_BTC_LST = false;

const Signpost = (props: any) => {
  const { className } = props;
  const router = useRouter();
  const isMobile = useIsMobile();
  const { handleReportWithoutDebounce } = useClickTracking();
  return (
    <div
      className={clsx(
        "absolute left-0 bottom-0 z-[5] overflow-hidden flex justify-center bg-no-repeat bg-contain",
        OPEN_BTC_LST
          ? "bg-[url('/images/home-earth/signpost.svg')] w-[178px] h-[277px] bg-[center_30px]"
          : "bg-[url('/images/home-earth/signpost-2.svg')] w-[146px] h-[191px] bg-[center_10px]",
        className
      )}
    >
      <img
        src="/images/home-earth/signpost-bintent.png"
        alt=""
        data-bp="1023-009"
        onClick={() => router.push("/bintent")}
        className={clsx(
          "w-[94px] h-[27px] absolute left-[36px] cursor-pointer object-center object-contain",
          OPEN_BTC_LST ? "top-[58px]" : "top-[32px]"
        )}
      />
      <Popover
        placement={PopoverPlacement.Right}
        trigger={isMobile ? PopoverTrigger.Click : PopoverTrigger.Hover}
        triggerContainerClassName={clsx(
          "absolute left-[20px]",
          OPEN_BTC_LST ? "top-[112px]" : "top-[82px]"
        )}
        contentClassName={isMobile ? "!z-[53]" : "-mt-[50px]"}
        offset={50}
        // closeDelayDuration={0}
        content={
          <SignpostBubble
            className={clsx("", isMobile && "scale-[0.8322]")}
            leftArrowY={140}
          >
            <div className="text-[#FF7040] font-CherryBomb text-[26px] font-normal not-italic leading-[90%] text-stroke-1">
              APR up to 700%!
            </div>
            <div className="mt-[11px] text-[#000] font-CherryBomb text-[16px] font-normal not-italic leading-[110%]">
              Beratown’s Vaults is easiest way to discover, navigate, and access
              da best Berachain & POL yield!
            </div>
            <button
              type="button"
              className="mt-[16px] h-[50px] flex-shrink-0 w-full rounded-[10px] border border-[#000] bg-[#FFDC50] shadow-[6px_6px_0px_rgba(0,0,0,0.25)] text-[#000] text-center font-Montserrat text-[16px] font-bold leading-normal"
              onClick={() => {
                handleReportWithoutDebounce(
                  isMobile ? "1022-002-002" : "1022-001-004"
                );

                router.push("/vaults");
              }}
            >
              Enter
            </button>
          </SignpostBubble>
        }
      >
        <img
          src="/images/home-earth/signpost-vaults.png"
          alt=""
          data-bp={isMobile ? "1022-002-002" : "1022-001-004"}
          onClick={() => {
            if (isMobile) return;
            router.push("/vaults");
          }}
          className="w-[110px] h-[47px] cursor-pointer object-center object-contain"
        />
      </Popover>
      {OPEN_BTC_LST && (
        <img
          src="/images/home-earth/signpost-btc-lst.png"
          alt=""
          onClick={() => { }}
          className="w-[77px] h-[17px] absolute left-[66px] top-[196px] cursor-not-allowed opacity-50 object-center object-contain"
        />
      )}
    </div>
  );
};

export default Signpost;
