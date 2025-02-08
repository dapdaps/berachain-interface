import clsx from "clsx";
import Back from "@/sections/ramen/detail/components/back";
import Step from "@/sections/ramen/detail/components/step";
import { useMemo } from "react";

const Dashboard = (props: any) => {
  const { className, detail, isLaunched, steps } = props;

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
        "bg-[#FFDC50] rounded-[10px] w-full p-[14px_22px_28px_19px]",
        className
      )}
    >
      <div className="flex justify-between gap-[20px]">
        <div className="flex gap-[18px] items-start">
          <Back className="shrink-0 translate-y-[10px]" />
          <img
            src={detail.token_icon_url}
            alt=""
            className="w-[78px] h-[78px] rounded-full shrink-0 ml-[4px]"
          />
          <div className="ml-[4px] text-[20px] text-black font-Montserrat font-[600] leading-[100%] translate-y-[10px]">
            <div className="">{detail.token_name}</div>
            <div className="mt-[8px] text-[#3D405A] text-[0.7em] font-[500] underline decoration-solid">
              ${detail.token_symbol}
            </div>
          </div>
          {isLaunched && (
            <div className="translate-y-[10px] p-[9px_11px_8px_12px] w-[219px] shrink-0 bg-[#D4EEFF] border border-black rounded-[10px] text-black font-Montserrat text-[14px] font-[600] leading-[100%]">
              Launch is completed: Tokens are now claimable
            </div>
          )}
        </div>
        <div className="flex justify-end items-start gap-[20px] translate-y-[16px]">
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
        <Step
          className="mt-[24px] w-[calc(100%_-_120px)] ml-[55px]"
          list={steps}
        />
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
