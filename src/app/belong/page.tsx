"use client";

import BelongView from "@/sections/belong";

const BelongPage = () => {
  return (
    <div className="w-full min-h-screen md:min-h-[unset] md:h-screen md:overflow-y-auto">
      <div className="w-full bg-black bg-[url('/images/belong/v2/bg-bar-primary.png')] bg-no-repeat bg-[length:100%_auto] bg-[position:top_0px_center] py-[114px] md:py-[50px]">
        <BelongView />
      </div>
    </div>
  );
};

export default BelongPage;
