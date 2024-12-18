import Refresh from "@/components/icons/refresh";
import clsx from "clsx";
export default function CheckButton({ checked, number, className, checking, onClick, numberClassName }: any) {
  return (
    <div
      className={clsx(
        "w-[110px] h-[33px] rounded-[20px] items-center border border-black bg-[#FFFDEB] relative",
        !checked && "cursor-pointer",
        className
      )}
    >
      <div className={`text-[14px] font-semibold h-full flex-1 flex items-center pl-[11px] ${numberClassName}`}>
        {number} boxes
      </div>
      {checked ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          viewBox="0 0 26 26"
          fill="none"
          className="absolute right-[3px] top-[3px] shrink-0"
        >
          <g filter="url(#filter0_d_27056_6271)">
            <circle cx="11.5" cy="11.5" r="10.5" fill="#69E371" />
            <circle cx="11.5" cy="11.5" r="10.5" stroke="black" />
          </g>
          <path
            d="M7 11.5L10.3333 15L17 8"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <defs>
            <filter
              id="filter0_d_27056_6271"
              x="0.5"
              y="0.5"
              width="25"
              height="25"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dx="3" dy="3" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_27056_6271"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_27056_6271"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
      ) : (
        <div
          className="shrink-0 w-[22px] h-[22px] border border-black rounded-full bg-[#FFDC50] flex items-center justify-center absolute right-[4px] top-[4px] drop-shadow-[3px_3px_0px_rgba(0,_0,_0,_0.25)]"
          onClick={onClick}
        >
          <Refresh refreshing={checking} />
        </div>
      )}
    </div>
  );
}
