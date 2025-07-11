"use client";

import PageBack from "@/components/back";
import BearBackground from "@/components/bear-background";
import BelongView from "@/sections/belong";

const BelongPage = () => {
  return (
    <BearBackground
      type="belong"
      style={{
        height: "unset",
        minHeight: "calc(100dvh - 68px)",
      }}
    >
      <div className="p-[25px_35px] md:p-[0]">
        <PageBack className="md:absolute md:left-[12px] md:top-[17px] md:z-[1]" />
        <div className="">
          <BelongView />
        </div>
      </div>
    </BearBackground>
  );
};

export default BelongPage;
