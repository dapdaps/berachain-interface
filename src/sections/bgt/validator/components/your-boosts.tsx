import { memo } from "react";

export default memo(function YourBoosts() {

  return (
    <div className="flex flex-col gap-4">
      <div className="text-xl font-semibold">Your Boosts</div>
      <div className="flex items-center justify-between font-medium leading-6">
        <div className="flex items-center">
          <div className="w-[24px]"></div>
          <span className="text-black">
            0.01 BGT
          </span>
        </div>
        <span className="text-[#3D405A]">$0.01</span>
      </div>
    </div>
  )
})
