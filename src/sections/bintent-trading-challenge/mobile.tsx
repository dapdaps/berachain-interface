import { memo } from "react";
import TaskBoard from "./components/task-board";
import Leaderboard from "./components/leaderboard";
import AirshipSvg from "@public/images/campaign/mobile/airship.svg";
import PageBack from "@/components/back";

export default memo(function Mobile() {
  return (
    <div className="px-[8px] absolute left-0 top-0 right-0 bottom-0 z-30 overflow-auto">
      <PageBack className="mt-[20px]" showBackText={false} />
      <div className="pt-[30px]">
        <AirshipSvg />
        <TaskBoard />
        <Leaderboard />
      </div>
    </div>
  )
})
