import clsx from "clsx";

export default function Bg({ children, className }: any) {
  return (
    <div
      className={clsx(
        "relative w-[340px] rounded-[24px] border border-black bg-[#B5956E] shadow-shadow1",
        className
      )}
    >
      <div className="relative z-[2] pb-[28px]">{children}</div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="338"
        height="342"
        viewBox="0 0 338 342"
        fill="none"
        className="absolute z-[1] top-0 opacity-50 w-full h-[90%]"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M164.86 82.8216L387.559 -53.3213L355.661 -95.2426L164.86 82.8216L194.081 -178H141.382L164.86 82.8216L85.9681 -162.954L37.9358 -141.287L164.86 82.8216L-78.9928 -2.47523L-90.8068 48.8482L164.86 82.8216L-92 116.266L-79.3028 167.378L164.86 82.8216L20.9262 298.31L67.2261 323.463L164.86 82.8216L125.875 339.173L178.499 342L164.86 82.8216L248.56 325.163L296.619 303.556L164.86 82.8216L351.096 263.768L384.176 222.772L164.86 82.8216L425.838 46.1665L413.205 -4.96178L164.86 82.8216ZM264.888 -164.632L311.718 -140.479L164.86 82.8216L264.888 -164.632ZM429.825 118.069L417.586 169.292L164.86 82.8216L429.825 118.069ZM-23.4056 266.997L-56.8514 226.299L164.86 82.8216L-23.4056 266.997ZM-50.0805 -68.4368L-16.0279 -108.629L164.86 82.8216L-50.0805 -68.4368Z"
          fill="url(#paint0_radial_26877_8215)"
        />
        <defs>
          <radialGradient
            id="paint0_radial_26877_8215"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(168.912 82) rotate(90) scale(260 260.912)"
          >
            <stop stopColor="#EBF479" />
            <stop offset="1" stopColor="#EBF479" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}
