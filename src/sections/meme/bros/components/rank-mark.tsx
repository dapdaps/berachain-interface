import { useMemo } from "react";

const COLOR: Record<number, string[]> = {
  1: ["#FFEE98", "#E9AE45", "#CFB364", "#F1DEA8"],
  2: ["#D8E7FF", "#85628A", "#B4B4B4", "#ABABAB"],
  3: ["#E7BA9A", "#805F48", "#E0B495", "#C09A7F"]
};

export default function RankMark({ rank }: any) {
  const color = useMemo(() => COLOR[rank], [rank]);
  return (
    <div className="relative flex justify-center items-center">
      <div className="text-[14px] font-semibold relative z-[2]">{rank}</div>
      {color && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="32"
          viewBox="0 0 30 32"
          fill="none"
          className="absolute z-[1]"
        >
          <path
            d="M13.9571 1.70462C14.5386 1.14207 15.4614 1.14207 16.0429 1.70462L17.9051 3.50608C18.4593 4.04223 19.2299 4.29262 19.9935 4.18463L22.5589 3.82177C23.36 3.70846 24.1066 4.25091 24.2464 5.04782L24.694 7.59978C24.8273 8.3593 25.3035 9.01484 25.9847 9.37625L28.2734 10.5906C28.9881 10.9698 29.2733 11.8475 28.918 12.5744L27.7802 14.9021C27.4415 15.5949 27.4415 16.4051 27.7802 17.0979L28.918 19.4256C29.2733 20.1525 28.9881 21.0302 28.2734 21.4094L25.9847 22.6238C25.3035 22.9852 24.8273 23.6407 24.694 24.4002L24.2464 26.9522C24.1066 27.7491 23.36 28.2915 22.5589 28.1782L19.9935 27.8154C19.2299 27.7074 18.4593 27.9578 17.9051 28.4939L16.0429 30.2954C15.4614 30.8579 14.5386 30.8579 13.9571 30.2954L12.0949 28.4939C11.5407 27.9578 10.7701 27.7074 10.0065 27.8154L7.44114 28.1782C6.64004 28.2915 5.89342 27.7491 5.75363 26.9522L5.30598 24.4002C5.17275 23.6407 4.69648 22.9852 4.0153 22.6238L1.72657 21.4094C1.01186 21.0302 0.726677 20.1525 1.082 19.4256L2.21985 17.0979C2.5585 16.4051 2.5585 15.5949 2.21985 14.9021L1.082 12.5744C0.726677 11.8475 1.01186 10.9698 1.72657 10.5906L4.0153 9.37625C4.69648 9.01484 5.17275 8.3593 5.30598 7.59978L5.75363 5.04782C5.89342 4.25091 6.64004 3.70846 7.44115 3.82177L10.0065 4.18463C10.7701 4.29262 11.5407 4.04223 12.0949 3.50608L13.9571 1.70462Z"
            fill={`url(#paint0_linear_26750_33373_${rank})`}
            stroke={`url(#paint1_linear_26750_33373_${rank})`}
          />
          <defs>
            <linearGradient
              id={`paint0_linear_26750_33373_${rank}`}
              x1="15"
              y1="0"
              x2="15"
              y2="32"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={color[0]} />
              <stop offset="1" stopColor={color[1]} />
            </linearGradient>
            <linearGradient
              id={`paint1_linear_26750_33373_${rank}`}
              x1="15"
              y1="0"
              x2="15"
              y2="32"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={color[2]} />
              <stop offset="1" stopColor={color[3]} />
            </linearGradient>
          </defs>
        </svg>
      )}
    </div>
  );
}