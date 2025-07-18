import Link from "next/link";
import { useBelongContext } from "../context";
import clsx from "clsx";

const FootLink = (props: any) => {
  const { className } = props;

  const {
    currentMarket,
  } = useBelongContext();

  return (
    <div className={clsx("w-full mt-[16px] flex items-center gap-[2px] pl-[21px] text-[12px] text-[#F8F8F8] font-[500] font-Montserrat leading-[100%]", className)}>
      <div className="">View on</div>
      <Link
        className="block underline underline-offset-2"
        href="https://berascan.com/address/0x88c983bf3d4a9adcee14e1b4f1c446c4c5853ea3"
        target="_blank"
        rel="noreferrer nofollow"
      >
        Berascan
      </Link>
      <div className="">&gt;</div>
      <div className="">or</div>
      <Link
        className="block underline underline-offset-2"
        href={`/lending/beraborrow?token=${currentMarket?.address}`}
        prefetch
      >
        Beraborrow
      </Link>
      <div className="">&gt;</div>
    </div>
  );
};

export default FootLink;
