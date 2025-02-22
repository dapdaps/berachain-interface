"use client";

import { memo } from "react";
import PageBack from "@/components/back";
import EarnViews from "..";

export default memo(function List({ children }: any) {
  return (
    <div className="relative h-[calc(100vh-68px)] overflow-hidden]">
      <div
        className="fixed inset-0 bg-cover bg-center pointer-events-none h-[100vh]"
        style={{
          backgroundImage: "url(/images/background/earn-bg.png)",
        }}
      ></div>

      <div className="relative mt-[68px]">
        <PageBack
          className="absolute left-[40px] top-[31px]"
          style={{ color: "#fff" }}
        />
        <div className="relative pt-[30px] w-[1200px] m-auto z-10">
            <EarnViews />
        </div>
      </div>
    </div>
  );
});
