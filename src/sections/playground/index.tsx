"use client";

import LightingButton from "@/components/button/lighting-button";
import Link from "next/link";

const PlaygroundView = () => {
  return (
    <div className="flex justify-center items-end gap-[50px] w-full absolute bottom-[100px]">
      <Link
        href="/carnival/magician"
        prefetch={true}
        className="group black flex flex-col items-center gap-[20px]"
      >
        <img
          src="/images/playground/entry-magician.png"
          alt=""
          className="w-[487px] h-[351px] origin-bottom group-hover:scale-[1.24] transition-all duration-300"
        />
        <LightingButton
          outerClassName="!h-[52px] uppercase !text-[20px] w-[120px]"
          disabled={false}
        >
          play
        </LightingButton>
      </Link>
      <Link
        href="/carnival/lucky-bera"
        prefetch={true}
        className="group black flex flex-col items-center gap-[20px]"
      >
        <img
          src="/images/playground/entry-lucky-bera.png"
          alt=""
          className="w-[270px] h-[347px] origin-bottom group-hover:scale-[1.32] transition-all duration-300"
        />
        <LightingButton
          outerClassName="!h-[52px] uppercase !text-[20px] w-[120px]"
          disabled={false}
        >
          play
        </LightingButton>
      </Link>
    </div>
  );
};

export default PlaygroundView;
