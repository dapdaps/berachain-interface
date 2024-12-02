import TitleIcon from "./components/title-icon";
import { useRouter } from "next-nprogress-bar";
import RankMark from "./rank-mark";
import Image from "next/image";

export default function Enterance() {
  const router = useRouter();
  return (
    <div className="absolute !w-[120px] right-[30px] top-[44px]">
      <TitleIcon
        onClick={() => {
          router.push("/meme/bros");
        }}
        className="!w-[120px] !h-[36px] hover:scale-110 transition-transform duration-500 cursor-pointer"
      />
      {/* <div className="relative text-center mt-[8px] w-[120px] h-[20px] rounded-[18px] border border-black bg-[#FFE5B8]">
        <div className="absolute top-[-4px] shrink-0 w-[26px] h-[26px] rounded-full  border-[3px] border-black">
          <Image
            src={""}
            width={26}
            height={26}
            className="rounded-full rotate-12"
            alt={""}
          />

          <RankMark
            rank={1}
            className="left-[-2px] top-[4px]"
            iconClassName="scale-50"
          />
        </div>
        <div className="text-[14px] font-bold mt-[-2px] ml-[-8px]">sPepe</div>
        <button className="absolute right-[1px] top-[1px] w-[35px] h-[16px] rounded-[18px] border border-black bg-[#FFCC00] text-[12px] font-semibold leading-[14px]">
          Get
        </button>
      </div> */}
    </div>
  );
}
