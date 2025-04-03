import { memo } from "react";

export default memo(function Radio({
  checked
}: {
  checked: boolean
}) {
  return checked ? (
    <div className="flex justify-center items-center min-w-[25px] w-[25px] h-[25px] rounded-full border border-[#7F6C41] bg-[#BDF849]">
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="10" viewBox="0 0 12 10" fill="none">
        <path d="M1 4.62333L4.46154 7.7998L11 1.7998" stroke="black" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  ) : (
    <div className="min-w-[25px] w-[25px] h-[25px] rounded-full border border-[#7F6C41] bg-[#FFF1C7]" />
  )
})
