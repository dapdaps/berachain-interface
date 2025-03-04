import useIsMobile from "@/hooks/use-isMobile";
import Image from "next/image";

type Props = {
  src?: string;
  alt?: string;
  name: string;
  type: string;
  style?: React.CSSProperties;
  className?: string;
};

const Laptop = ({ src, alt, name, type, style, className }: Props) => {
  return (
    <div className={`absolute left-[-80px] ${className}`} style={style}>
      <div className="w-[120px] h-[120px] border border-black rounded-[30px] bg-[#B2E946] pt-[10px] relative z-[1]">
        <div className="h-[108px] rounded-[30px] bg-[#9ACA3B] flex flex-col items-center justify-center">
          <Image
            src={src || "/images/dapps/default_app.png"}
            alt={alt ?? ""}
            width={43}
            height={43}
          />
          <div className="font-CherryBomb text-[20px]">{name}</div>
          <div className="text-[12px] text-[#527213]">
            {type === "Staking"
              ? "Vaults"
              : (type === "lending" ? "Lend" : type?.slice(0, 1)?.toUpperCase?.() + type?.slice(1))}
          </div>
        </div>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="36"
        height="37"
        viewBox="0 0 36 37"
        fill="none"
        className="absolute bottom-[-24px] left-[54px]"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1 29.5V1H14V23H29C32.5899 23 35.5 25.9101 35.5 29.5C35.5 33.0899 32.5899 36 29 36H7.5C3.91015 36 1 33.0899 1 29.5Z"
          fill="#906925"
          stroke="black"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

const Mobile = ({ src, alt, name, type, style, className }: Props) => {
  return (
    <div
      className={`flex items-center gap-[12px] absolute top-[-34px] left-[15px] ${className}`}
      style={style}
    >
      {/* <Image
        src={src || '/images/dapps/default_app.png'}
        alt={alt ?? ''}
        width={36}
        height={36}
      /> */}
      <div className="font-CherryBomb text-[20px]">{name}</div>
    </div>
  );
};

export default function DappIcon(props: Props) {
  const isMobile = useIsMobile();

  return isMobile ? <Mobile {...props} /> : <Laptop {...props} />;
}
