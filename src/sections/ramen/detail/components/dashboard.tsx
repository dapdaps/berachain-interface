import clsx from "clsx";
import Back from "@/sections/ramen/detail/components/back";
import Step from "@/sections/ramen/detail/components/step";
import { useMemo } from "react";
import { useCountdown } from '@/sections/ramen/hooks/use-countdown';
import useIsMobile from '@/hooks/use-isMobile';
import StepVertical from '@/sections/ramen/detail/components/step/vertical';

const Dashboard = (props: any) => {
  const { className, detail, isLaunched, steps, countdown } = props;

  const isMobile = useIsMobile();

  const socials = useMemo(() => {
    const _s: any = [];
    if (detail.whitepaper_url) {
      _s.push({
        key: "doc",
        icon: SOCIAL_ICONS["doc"],
        link: detail.whitepaper_url
      });
    }
    Object.entries(detail.socials).forEach(([key, value], i) => {
      if (!value || !SOCIAL_ICONS[key]) return;
      _s.push({
        key,
        icon: SOCIAL_ICONS[key],
        link: value
      });
    });
    return _s;
  }, [detail]);

  return (
    <div
      className={clsx(
        "bg-[#FFDC50] rounded-[10px] w-full p-[14px_22px_28px_19px] md:p-[13px_14px_22px]",
        className
      )}
    >
      <div className="flex justify-between gap-[20px] md:flex-col">
        <div className="flex gap-[18px] items-start">
          <div className="flex gap-[18px] md:gap-[7px] items-start">
            <Back className="shrink-0 translate-y-[10px] md:hidden" />
            <img
              src={detail.token_icon_url}
              alt=""
              className="w-[78px] h-[78px] md:w-[40px] md:h-[40px] rounded-full shrink-0 ml-[4px] md:ml-0"
            />
            <div className="ml-[4px] text-[20px] text-black font-Montserrat font-[600] leading-[100%] translate-y-[10px] md:translate-y-0">
              <div className="">{detail.token_name}</div>
              <div className="mt-[8px] md:mt-[3px] text-[#3D405A] text-[0.7em] font-[500] underline decoration-solid">
                ${detail.token_symbol}
              </div>
            </div>
          </div>
          {
            isLaunched ? (
              <div className="md:absolute md:left-1/2 md:translate-x-[-50%] md:ml-[unset] md:top-[5px] md:w-[230px] md:px-[10px] translate-y-[10px] p-[9px_11px_8px_12px] w-[219px] shrink-0 bg-[#D4EEFF] border border-black rounded-[10px] text-black font-Montserrat text-[14px] font-[600] leading-[100%]">
                Launch is completed: Tokens are now claimable
              </div>
            ) : (
              <div className="md:absolute md:left-1/2 md:translate-x-[-50%] md:ml-[unset] md:px-[25px] md:top-[10px] md:gap-[8px] whitespace-nowrap flex flex-col items-center gap-[16px] ml-[75px] p-[9px_58px_15px] shrink-0 bg-[#D4EEFF] border border-black rounded-[10px] text-black font-Montserrat text-[14px] font-[600] leading-[100%]">
                <div className="">Auction ending in</div>
                <div className="text-[22px] font-[700]">
                  {countdown?.endSplit?.[0]}d {countdown?.endSplit?.[1]}h{" "}
                  {countdown?.endSplit?.[2]}m {countdown?.endSplit?.[3]}s
                </div>
              </div>
            )
          }
        </div>
        <div className="flex justify-end items-start gap-[20px] translate-y-[16px] md:translate-y-0 md:justify-start">
          {socials.map((s: any) => (
            <a
              href={s.link}
              target="_blank"
              key={s.key}
              className=""
              rel="nofollow"
            >
              <img src={s.icon} alt="" className="w-[24px] h-[24px]" />
            </a>
          ))}
        </div>
      </div>
      <div className="">
        {
          isMobile ? (
            <StepVertical
              className="mt-[22px] w-full ml-[1px] !pb-0"
              list={steps.map((it: any) => ({
                ...it,
                label: (
                  <div className="relative flex flex-col gap-[4px] -translate-y-[8px]">
                    <div className="">
                      {it.label}
                    </div>
                    <div className="text-[#3D405A] text-[12px] font-[500] absolute whitespace-nowrap translate-y-[20px]">
                      {it.date}
                    </div>
                  </div>
                )
              }))}
              gap={32}
            />
          ) : (
            <Step
              className="mt-[24px] w-[calc(100%_-_120px)] ml-[55px]"
              list={steps}
            />
          )
        }
      </div>
    </div>
  );
};

export default Dashboard;

const SOCIAL_ICONS: Record<string, string> = {
  discord: "/images/ramen/icon-discord.svg",
  medium: "/images/ramen/icon-points.svg",
  twitter: "/images/ramen/icon-x.svg",
  website: "/images/ramen/icon-website.svg",
  doc: "/images/ramen/icon-doc.svg",
  youtube: "/images/ramen/icon-youtube.svg"
};
